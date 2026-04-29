# Execution Harness Workflow

> `AGENTS.md`의 실행 순서를 실제 명령 단계로 강제하는 쉘 하네스 문서입니다.
> 엔트리포인트는 repo 루트의 [`harness.sh`](../../harness.sh)입니다.

---

## 목적

- `AGENTS.md`의 순서를 사람이 기억하지 않아도 단계별로 강제한다
- 누락된 단계가 있으면 다음 단계가 실패하게 만든다
- 이미 지난 단계 이후에 파일이 바뀌면 해당 단계를 stale로 간주하고 다시 밟게 만든다
- plan 기록과 worktree 이동 사이의 실제 Git 제약을 하네스가 흡수한다

---

## 왜 쉘인가

- 이 하네스는 `git worktree`, `git commit`, `git merge`, `npm.cmd run build`, `npm.cmd run lint`, `npm.cmd test` 같은 로컬 명령 실행이 핵심이다
- 그래서 JSON 렌더링이나 압축보다 명령 오케스트레이션이 중요하고, 이 경우 `sh` 엔트리포인트가 더 직접적이다
- 기존 [`scripts/harness/prompt_log.py`](../../scripts/harness/prompt_log.py)는 prompt logging 보조 도구이며, 실행 순서 강제기와는 목적이 다르다

---

## 상태 저장

- 하네스 상태는 Git 공용 디렉터리 아래 `codex-harness/<task-id>/`에 저장한다
- linked worktree를 써도 같은 task 상태를 공유한다
- 작업 트리 snapshot을 단계별로 저장해, 이후 수정이 생기면 `tests-done`, `verified`, `plan-completed`, `committed` 단계를 stale로 판단한다

---

## 명령

플랜 기록:

```sh
./harness.sh record-plan shell-flow docs/exec-plans/active/2026-04-16-shell-exec-harness.md
```

worktree 준비:

```sh
./harness.sh prepare-worktree shell-flow chore-shell-exec-harness /private/tmp/tech-log-shell-exec-harness develop
```

구현 완료 표시:

```sh
./harness.sh implementation-done shell-flow
```

테스트 작성 완료 표시:

```sh
./harness.sh tests-done shell-flow
```

검증:

```sh
./harness.sh verify shell-flow
```

플랜 종료 처리:

```sh
./harness.sh complete-plan shell-flow
```

커밋:

```sh
./harness.sh commit shell-flow "chore: add shell execution harness"
```

병합:

```sh
./harness.sh merge shell-flow develop
```

완료 보고:

```sh
./harness.sh report shell-flow
```

종료 일괄 처리:

```sh
./harness.sh ship shell-flow "chore: add shell execution harness" develop
```

상태 확인:

```sh
./harness.sh status shell-flow
```

---

## 강제 규칙

- `record-plan` 전에 어떤 단계도 시작할 수 없다
- `prepare-worktree`는 main repo root 내부 경로를 거부한다
  repo 내부에 linked worktree를 만들면 root가 untracked 디렉터리로 더러워져 merge 단계가 막히기 때문이다
- `tests-done`은 문서 외 변경이 있는데 테스트 파일 변경이 없으면 실패한다
- `verify`는 `tests-done` 이후 작업 트리가 바뀌면 실패한다
- `complete-plan`은 `verified` snapshot이 stale이면 실패한다
- `commit`은 `plan-completed` snapshot이 stale이면 실패한다
- `merge`는 main repo root가 target branch 위에 있고 clean 상태일 때만 수행한다
- `ship`은 `complete-plan`, `commit`, `merge`, `report`를 같은 순서로 실행한다

---

## plan과 worktree의 연결

`AGENTS.md`는 plan을 먼저 기록하고 그다음 worktree를 준비하게 요구한다.
Git linked worktree는 uncommitted 파일을 새 worktree로 자동 복제하지 않기 때문에, 하네스는 `prepare-worktree` 단계에서 active plan 파일을 새 worktree로 옮기고 이후 메타데이터도 그 경로를 기준으로 갱신한다.

이 동작이 없으면:

- main worktree에만 plan 파일이 남고
- task worktree에서는 `complete-plan`이 다른 작업 트리의 파일을 건드리게 되며
- branch와 plan 기록이 분리된다

하네스는 이 불일치를 자동으로 막는다.
