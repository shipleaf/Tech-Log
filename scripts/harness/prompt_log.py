#!/usr/bin/env python3
"""Append-only prompt logging workflow for local harness use."""

from __future__ import annotations

import argparse
import gzip
import json
import sys
import uuid
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path


DEFAULT_ROOT = Path(".harness/prompt-log")


@dataclass(frozen=True)
class Paths:
    event_file: Path
    digest_file: Path
    archive_dir: Path
    state_dir: Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Record prompt requests and short answer summaries."
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=DEFAULT_ROOT,
        help="Prompt log root directory. Defaults to .harness/prompt-log",
    )

    subparsers = parser.add_subparsers(dest="command", required=True)

    start = subparsers.add_parser("start", help="Append a question event.")
    start.add_argument("--question", help="Question text. Reads stdin when omitted.")
    start.add_argument(
        "--at",
        help="ISO-8601 timestamp override, e.g. 2026-04-15T10:22:33+09:00",
    )

    finish = subparsers.add_parser("finish", help="Append an answer summary event.")
    finish.add_argument("--id", required=True, help="Prompt log session id.")
    finish.add_argument("--answer", help="Answer summary text. Reads stdin when omitted.")
    finish.add_argument(
        "--at",
        help="ISO-8601 timestamp override, e.g. 2026-04-15T10:23:10+09:00",
    )

    render = subparsers.add_parser("render", help="Render a daily Markdown digest.")
    render.add_argument(
        "--date",
        dest="target_date",
        help="Target date in YYYY-MM-DD format. Defaults to today.",
    )
    render.add_argument(
        "--stdout",
        action="store_true",
        help="Print the rendered digest after writing the file.",
    )

    archive = subparsers.add_parser(
        "archive-month", help="Compress one month of daily JSONL files."
    )
    archive.add_argument(
        "--month", required=True, help="Target month in YYYY-MM format."
    )
    archive.add_argument(
        "--keep-source",
        action="store_true",
        help="Keep original daily JSONL files after writing the archive.",
    )

    return parser.parse_args()


def now_local() -> datetime:
    return datetime.now().astimezone()


def parse_timestamp(raw: str | None) -> datetime:
    if raw is None:
        return now_local()
    parsed = datetime.fromisoformat(raw)
    if parsed.tzinfo is None:
        raise ValueError("timestamp must include timezone offset")
    return parsed


def read_text(flag_value: str | None, label: str) -> str:
    if flag_value is not None:
        text = flag_value.strip()
    else:
        text = sys.stdin.read().strip()
    if not text:
        raise ValueError(f"{label} text is required")
    return text


def ensure_layout(root: Path) -> None:
    for path in (
        root / "events",
        root / "digests",
        root / "archive",
        root / "state" / "open",
        root / "templates",
    ):
        path.mkdir(parents=True, exist_ok=True)


def paths_for_day(root: Path, target: date) -> Paths:
    year = f"{target.year:04d}"
    month = f"{target.month:02d}"
    filename = target.isoformat()
    event_dir = root / "events" / year / month
    digest_dir = root / "digests" / year / month
    archive_dir = root / "archive" / year / month
    state_dir = root / "state" / "open"
    event_dir.mkdir(parents=True, exist_ok=True)
    digest_dir.mkdir(parents=True, exist_ok=True)
    archive_dir.mkdir(parents=True, exist_ok=True)
    state_dir.mkdir(parents=True, exist_ok=True)
    return Paths(
        event_file=event_dir / f"{filename}.jsonl",
        digest_file=digest_dir / f"{filename}.md",
        archive_dir=archive_dir,
        state_dir=state_dir,
    )


def build_session_id(timestamp: datetime) -> str:
    stamp = timestamp.strftime("%Y%m%dT%H%M%S%z")
    return f"{stamp}-{uuid.uuid4().hex[:8]}"


def append_jsonl(path: Path, payload: dict[str, object]) -> None:
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload, ensure_ascii=False))
        handle.write("\n")


def load_jsonl(path: Path) -> list[dict[str, object]]:
    records: list[dict[str, object]] = []
    if not path.exists():
        return records
    with path.open("r", encoding="utf-8") as handle:
        for raw in handle:
            raw = raw.strip()
            if not raw:
                continue
            records.append(json.loads(raw))
    return records


def render_digest(records: list[dict[str, object]], target_date: str) -> str:
    ordered_ids: list[str] = []
    sessions: dict[str, dict[str, str]] = {}

    for record in records:
        session_id = str(record["id"])
        record_type = str(record["type"])
        if session_id not in sessions:
            sessions[session_id] = {"date": "", "time": "", "q": "", "a": "(pending)"}
        session = sessions[session_id]
        if record_type == "q":
            ordered_ids.append(session_id)
            session["date"] = str(record["date"])
            session["time"] = str(record["time"])
            session["q"] = str(record["q"])
        elif record_type == "a":
            session["a"] = str(record["a"])

    lines = [
        f"# Prompt Log Digest - {target_date}",
        "",
        "Template:",
        "Date: YYYY-MM-DD",
        "Time: HH:MM:SS+TZ",
        "Q: Prompt text",
        "A: 1-2 line answer summary",
        "",
    ]

    if not ordered_ids:
        lines.append("_No prompt entries recorded for this date._")
        lines.append("")
        return "\n".join(lines)

    for index, session_id in enumerate(ordered_ids, start=1):
        session = sessions[session_id]
        lines.extend(
            [
                f"## Entry {index}",
                f"Date: {session['date']}",
                f"Time: {session['time']}",
                f"Q: {session['q']}",
                f"A: {session['a']}",
                "",
            ]
        )

    return "\n".join(lines)


def write_digest(root: Path, target: date) -> Path:
    day_paths = paths_for_day(root, target)
    records = load_jsonl(day_paths.event_file)
    digest = render_digest(records, target.isoformat())
    day_paths.digest_file.write_text(digest, encoding="utf-8")
    return day_paths.digest_file


def start_session(root: Path, question: str, timestamp: datetime) -> int:
    ensure_layout(root)
    day_paths = paths_for_day(root, timestamp.date())
    session_id = build_session_id(timestamp)
    payload = {
        "id": session_id,
        "type": "q",
        "timestamp": timestamp.isoformat(),
        "date": timestamp.date().isoformat(),
        "time": timestamp.strftime("%H:%M:%S%z")[:-2] + ":" + timestamp.strftime("%H:%M:%S%z")[-2:],
        "q": question,
    }
    append_jsonl(day_paths.event_file, payload)
    state = {
        "id": session_id,
        "event_file": str(day_paths.event_file),
        "digest_file": str(day_paths.digest_file),
        "question_date": timestamp.date().isoformat(),
        "question_time": payload["time"],
    }
    (day_paths.state_dir / f"{session_id}.json").write_text(
        json.dumps(state, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    write_digest(root, timestamp.date())
    sys.stdout.write(f"{session_id}\n")
    return 0


def finish_session(root: Path, session_id: str, answer: str, timestamp: datetime) -> int:
    ensure_layout(root)
    state_path = root / "state" / "open" / f"{session_id}.json"
    if not state_path.exists():
        raise ValueError(f"open prompt session not found: {session_id}")
    state = json.loads(state_path.read_text(encoding="utf-8"))
    event_file = Path(state["event_file"])
    payload = {
        "id": session_id,
        "type": "a",
        "timestamp": timestamp.isoformat(),
        "date": timestamp.date().isoformat(),
        "time": timestamp.strftime("%H:%M:%S%z")[:-2] + ":" + timestamp.strftime("%H:%M:%S%z")[-2:],
        "a": answer,
    }
    append_jsonl(event_file, payload)
    state_path.unlink()
    digest_file = write_digest(root, date.fromisoformat(str(state["question_date"])))
    sys.stdout.write(f"{digest_file}\n")
    return 0


def render_for_date(root: Path, raw_date: str | None, print_stdout: bool) -> int:
    ensure_layout(root)
    target = date.fromisoformat(raw_date) if raw_date else now_local().date()
    digest_file = write_digest(root, target)
    if print_stdout:
        sys.stdout.write(digest_file.read_text(encoding="utf-8"))
    else:
        sys.stdout.write(f"{digest_file}\n")
    if print_stdout and not digest_file.read_text(encoding="utf-8").endswith("\n"):
        sys.stdout.write("\n")
    return 0


def archive_month(root: Path, raw_month: str, keep_source: bool) -> int:
    ensure_layout(root)
    year, month = raw_month.split("-", maxsplit=1)
    month_dir = root / "events" / year / month
    if not month_dir.exists():
        raise ValueError(f"event month not found: {raw_month}")

    open_sessions = list((root / "state" / "open").glob("*.json"))
    for state_path in open_sessions:
        state = json.loads(state_path.read_text(encoding="utf-8"))
        if str(state.get("question_date", "")).startswith(raw_month):
            raise ValueError(f"cannot archive month with open session: {state['id']}")

    event_files = sorted(month_dir.glob("*.jsonl"))
    if not event_files:
        raise ValueError(f"no daily event files found for month: {raw_month}")

    archive_dir = root / "archive" / year / month
    archive_dir.mkdir(parents=True, exist_ok=True)
    archive_path = archive_dir / f"{raw_month}.jsonl.gz"

    with gzip.open(archive_path, "wt", encoding="utf-8") as handle:
        for event_file in event_files:
            handle.write(event_file.read_text(encoding="utf-8"))

    if not keep_source:
        for event_file in event_files:
            event_file.unlink()

    sys.stdout.write(f"{archive_path}\n")
    return 0


def main() -> int:
    args = parse_args()
    root = args.root
    try:
        if args.command == "start":
            question = read_text(args.question, "question")
            return start_session(root, question, parse_timestamp(args.at))
        if args.command == "finish":
            answer = read_text(args.answer, "answer")
            return finish_session(root, args.id, answer, parse_timestamp(args.at))
        if args.command == "render":
            return render_for_date(root, args.target_date, args.stdout)
        if args.command == "archive-month":
            return archive_month(root, args.month, args.keep_source)
    except ValueError as exc:
        sys.stderr.write(f"error: {exc}\n")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
