# 2026-04-28-npm-cmd-harness-verify

> 상태: 완료
> 마일스톤: M1 · 실행 하네스
> 시작일: 2026-04-28
> 종료일: 2026-04-28
> 머지 상태: 완료

## 목표

하네스 검증 단계가 Windows PowerShell의 `npm.ps1` 실행 정책 제한에 걸리지 않도록 `npm.cmd`를 직접 호출하게 한다.

## 범위

- `harness.sh`의 `verify` 명령에서 build, lint, test 실행 명령을 `npm.cmd` 기반으로 변경
- 하네스 검증 명령 문자열을 고정하는 테스트 갱신
- 하네스 실행 문서의 npm 명령 표기 갱신

## Out of Scope

- Broader package manager changes.
- CI provider configuration changes.
- Product UI or content changes.

## 변경 대상

- `harness.sh`
- `tests/harness-flow.test.ts`
- `docs/harness/exec-workflow.md`
- This execution plan document

## 검증

- `npm.cmd test`
- `npm.cmd run lint`
- `npm.cmd run build -- --webpack`
- `./harness.sh verify <task-id>` as part of the harness lifecycle, which should now log `npm.cmd` commands.

## 종료 조건

- Harness verification uses `npm.cmd` for build, lint, and test.
- The test suite asserts the new verification command spelling.
- Required verification commands pass or any environment limitation is documented.
- Plan is moved to `docs/exec-plans/completed/`, committed, and merged to `develop` if the main worktree state allows it.

## 작업 목록

- [x] active 실행 계획으로 기록한다.
- [x] 전용 worktree와 작업 브랜치를 준비한다.
- [x] 하네스 검증 명령을 `npm.cmd` 호출로 바꾼다.
- [x] 관련 테스트와 문서를 갱신한다.
- [x] `npm.cmd` 기반 검증을 통과시킨다.
- [x] 커밋하고 `develop`에 병합한다.

## 완료 결과

- `harness.sh verify`가 `npm.cmd run build`, `npm.cmd run lint`, `npm.cmd test`를 실행하도록 변경했다.
- `tests/harness-flow.test.ts`가 새 명령 표기를 검증한다.
- `docs/harness/exec-workflow.md`의 하네스 핵심 로컬 명령 설명을 `npm.cmd` 기준으로 맞췄다.
- 검증 결과: `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build -- --webpack` 통과.
- `harness.sh` 직접 실행은 현재 Windows 환경에 `sh` 바이너리가 없어 수동 동등 절차로 진행했다.
