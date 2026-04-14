#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TMP_DIR="$(mktemp -d)"
PROMPT_ROOT="${TMP_DIR}/prompt-log"
SCRIPT="${ROOT_DIR}/scripts/harness/prompt_log.py"

cleanup() {
  rm -rf "${TMP_DIR}"
}

trap cleanup EXIT

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

assert_file() {
  local path="$1"
  [[ -f "${path}" ]] || fail "missing file: ${path}"
}

assert_not_file() {
  local path="$1"
  [[ ! -f "${path}" ]] || fail "unexpected file: ${path}"
}

assert_contains() {
  local path="$1"
  local needle="$2"
  grep -F "${needle}" "${path}" >/dev/null || fail "missing '${needle}' in ${path}"
}

ID_ONE="$(
  python3 "${SCRIPT}" --root "${PROMPT_ROOT}" start \
    --at "2026-04-15T10:22:33+09:00" \
    --question "하네스 로그를 남기는 방법은?"
)"

EVENT_ONE="${PROMPT_ROOT}/events/2026/04/2026-04-15.jsonl"
DIGEST_ONE="${PROMPT_ROOT}/digests/2026/04/2026-04-15.md"

assert_file "${EVENT_ONE}"
assert_file "${DIGEST_ONE}"
assert_contains "${DIGEST_ONE}" "A: (pending)"

python3 "${SCRIPT}" --root "${PROMPT_ROOT}" finish \
  --id "${ID_ONE}" \
  --at "2026-04-15T10:23:10+09:00" \
  --answer "질문과 1-2줄 답변 요약을 일자별 JSONL과 Markdown digest에 기록하면 된다." >/dev/null

assert_contains "${DIGEST_ONE}" "Date: 2026-04-15"
assert_contains "${DIGEST_ONE}" "Time: 10:22:33+09:00"
assert_contains "${DIGEST_ONE}" "Q: 하네스 로그를 남기는 방법은?"
assert_contains "${DIGEST_ONE}" "A: 질문과 1-2줄 답변 요약을 일자별 JSONL과 Markdown digest에 기록하면 된다."

ID_TWO="$(
  python3 "${SCRIPT}" --root "${PROMPT_ROOT}" start \
    --at "2026-04-16T09:00:00+09:00" \
    --question "월 단위 압축도 필요해?"
)"

python3 "${SCRIPT}" --root "${PROMPT_ROOT}" finish \
  --id "${ID_TWO}" \
  --at "2026-04-16T09:00:20+09:00" \
  --answer "오래된 일자 로그는 월 단위 gzip 아카이브로 묶으면 파일 수와 용량을 줄일 수 있다." >/dev/null

ARCHIVE_FILE="$(
  python3 "${SCRIPT}" --root "${PROMPT_ROOT}" archive-month --month "2026-04"
)"

assert_file "${ARCHIVE_FILE}"
assert_not_file "${EVENT_ONE}"
assert_not_file "${PROMPT_ROOT}/events/2026/04/2026-04-16.jsonl"

ARCHIVE_VIEW="${TMP_DIR}/archive.jsonl"
gzip -cd "${ARCHIVE_FILE}" > "${ARCHIVE_VIEW}"
assert_contains "${ARCHIVE_VIEW}" "하네스 로그를 남기는 방법은?"
assert_contains "${ARCHIVE_VIEW}" "월 단위 압축도 필요해?"

echo "prompt_log_cli_test: ok"
