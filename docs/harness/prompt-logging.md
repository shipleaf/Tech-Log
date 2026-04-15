# Prompt Logging Workflow

> 이 문서는 prompt log 보조 도구에 대한 설명입니다.
> `AGENTS.md` 실행 순서를 강제하는 실제 하네스는 [`exec-workflow.md`](./exec-workflow.md)를 따른다.

> 프롬프트 요청과 1-2줄 답변 요약을 로컬에 기록하는 하네스 워크플로우입니다.
> 저장은 append-only JSONL로 하고, 사람이 읽는 Markdown digest를 별도로 생성합니다.

---

## 목적

- 사용자가 입력한 요청을 누락 없이 남긴다.
- 답변 전문 대신 1-2줄 요약만 남겨 로그 크기 증가를 늦춘다.
- 하루 단위 원본 로그와 일일 digest를 분리해 검색성과 유지보수를 높인다.
- 오래된 로그는 월 단위 gzip 아카이브로 압축해 파일 수와 용량을 줄인다.

---

## 저장 구조

```text
.harness/prompt-log/
  events/YYYY/MM/YYYY-MM-DD.jsonl
  digests/YYYY/MM/YYYY-MM-DD.md
  archive/YYYY/MM/YYYY-MM.jsonl.gz
  state/open/<session-id>.json
  templates/daily-entry.md
```

- `events/`: append-only 일별 원본 이벤트 로그
- `digests/`: 사람이 읽는 일별 Markdown 요약
- `archive/`: 오래된 월간 압축본
- `state/open/`: 질문은 기록됐지만 답변 요약이 아직 없는 열린 세션 상태

생성 로그는 [.gitignore](/Users/shipleaf/Projects/Tech-Log/.gitignore:1)에서 Git 추적 대상에서 제외한다.

---

## 템플릿

일일 digest의 각 항목은 아래 형식을 따른다.

```md
## Entry N
Date: YYYY-MM-DD
Time: HH:MM:SS+TZ
Q: Prompt text
A: 1-2 line answer summary
```

질문만 기록된 상태라면 `A: (pending)`으로 표시한다.

---

## 사용 방법

질문 기록:

```bash
python3 scripts/harness/prompt_log.py start --question "지금 하네스가 실제로 강제되나?"
```

응답 요약 기록:

```bash
python3 scripts/harness/prompt_log.py finish --id "<session-id>" --answer "문서 규칙은 있지만, 실제 강제는 CI나 외부 래퍼가 필요하다."
```

일일 digest 재생성:

```bash
python3 scripts/harness/prompt_log.py render --date 2026-04-15 --stdout
```

월간 압축:

```bash
python3 scripts/harness/prompt_log.py archive-month --month 2026-04
```

---

## 실제 강제와 한계

- 이 스크립트는 기록 로직을 제공하지만, repo 안의 파일만으로는 "모든 프롬프트 전에 무조건 실행"을 강제할 수 없다.
- 진짜 강제는 Codex 호출 앞단의 외부 래퍼나 오케스트레이터가 `start`를 먼저 호출하고, 응답 완료 후 `finish`를 호출할 때만 가능하다.
- CI는 머지 전 검증을 강제할 수 있지만, 프롬프트 시작 시점 강제는 외부 런처가 담당해야 한다.

권장 래퍼 흐름:

1. 사용자 프롬프트 수신
2. `prompt_log.py start` 호출
3. Codex 작업 실행
4. 답변 1-2줄 요약 추출
5. `prompt_log.py finish` 호출

---

## 검증

- 테스트 스크립트: [tests/harness/prompt_log_cli_test.sh](/Users/shipleaf/Projects/Tech-Log/tests/harness/prompt_log_cli_test.sh:1)
- 검증 대상:
  - 질문 기록 시 일별 JSONL 생성
  - 응답 요약 기록 시 digest 갱신
  - 월간 아카이브 생성 시 gzip 압축과 원본 정리
