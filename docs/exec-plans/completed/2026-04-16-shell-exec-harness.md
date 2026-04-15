# 2026-04-16-shell-exec-harness

> 상태: 완료
> 마일스톤: M0 — 하네스 구축
> 시작일: 2026-04-16
> 종료일: 2026-04-16
> 머지 상태: `chore-shell-exec-harness` 브랜치에서 검증 후 `develop`에 fast-forward 병합됨

## 목표

`AGENTS.md`에 정의된 작업 순서를 쉘 기반 하네스로 강제할 수 있게 최소 실행 흐름과 상태 게이트를 도입한다.

## 범위

- 기존 Python 기반 prompt logging 스크립트의 역할을 재평가한다
- `sh` 기반 실행 하네스 엔트리포인트와 단계 게이트를 추가한다
- 누락된 단계가 있으면 다음 단계로 진행하지 못하게 하는 상태 저장 구조를 만든다
- 관련 테스트와 문서를 갱신한다

## 제외 범위

- Codex 외부 런처 수준의 프롬프트 강제
- GitHub 원격 푸시, PR 생성, CI 연동 자동화
- 블로그 애플리케이션 기능 변경

## 변경 대상

- `harness.sh`
- `docs/exec-plans/completed/2026-04-16-shell-exec-harness.md`
- `docs/harness/exec-workflow.md`
- `docs/harness/prompt-logging.md`
- `docs/index.md`
- `tests/harness-flow.test.ts`

## 검증

- 하네스 단계별 차단/재진입 흐름 테스트
- `npm run build`
- `npm run lint`
- `npm test`

## 종료 조건

- `sh` 엔트리포인트로 AGENTS 실행 순서를 따라가는 단계 명령을 실행할 수 있다
- 선행 단계가 없으면 다음 단계 실행이 실패한다
- 누락된 단계를 다시 실행하면 이후 단계로 진행할 수 있다
- 관련 문서와 테스트가 하네스 동작과 일치한다

## 완료 결과

- repo 루트에 `harness.sh`를 추가해 `record-plan → prepare-worktree → implementation-done → tests-done → verify → complete-plan → commit → merge → report` 흐름을 강제했다
- 하네스 상태를 Git 공용 디렉터리에 저장해 linked worktree 사이에서도 같은 task 상태를 공유하게 했다
- `prepare-worktree`가 active plan 파일을 새 worktree로 옮겨 plan 기록과 branch 작업이 분리되지 않게 만들었다
- 단계별 snapshot 비교를 넣어 `tests-done`, `verified`, `plan-completed`, `committed` 이후 변경이 생기면 stale로 간주하고 재실행을 요구하게 했다
- 실행 하네스 문서를 추가하고 prompt logging 문서를 보조 도구로 명확히 분리했다
- temp git repo 기반 통합 테스트를 추가해 단계 차단, stale 재진입, plan 이동, commit, merge, report까지 검증했다

## 검증 결과

- `npm run build`
- `npm run lint`
- `npm test`

## 작업 목록

- [x] 상태 저장 방식과 단계 목록을 확정한다
- [x] 전용 worktree와 브랜치를 준비한다
- [x] 쉘 하네스 엔트리포인트를 구현한다
- [x] 단계 게이트 테스트를 추가한다
- [x] 문서와 검증 스크립트를 정리한다
