# 2026-04-29-restore-harness-ship

> 상태: 진행 중
> 마일스톤: 하네스 정합성
> 시작일: 2026-04-29

## 목표

`AGENTS.md`와 실행 계획 문서가 요구하는 `./harness.sh ship <task-id> <commit-message> develop` 종료 흐름을 실제 `harness.sh`에 복구한다.

## 범위

- `harness.sh`에 `ship` 명령을 추가해 plan 완료, 커밋, 머지, 보고를 한 번에 수행하게 한다.
- 하네스 테스트가 `ship` 명령 존재와 실행 순서를 검증하도록 갱신한다.
- 필요하면 하네스 문서의 명령 목록을 `ship` 기준과 맞춘다.

## 제외 범위

- 원격 push 자동화
- PR 생성 자동화
- Codex 호출 전 프롬프트 래퍼 강제

## 변경 대상

- `harness.sh`
- `tests/harness-flow.test.ts`
- `content/blog/first-post.mdx`
- `docs/harness/exec-workflow.md`
- `docs/exec-plans/active/`
- `docs/exec-plans/completed/`

## 검증

- `npm.cmd test`
- `npm.cmd run lint`
- `npm.cmd run build`
- 하네스 lifecycle: `record-plan -> prepare-worktree -> implementation-done -> tests-done -> verify -> ship`

## 종료 조건

- `./harness.sh ship <task-id> <commit-message> develop` 명령이 실제로 존재한다.
- `ship`이 완료 계획 이동, 커밋, `develop` 머지, 보고를 순서대로 수행한다.
- 테스트가 `ship` 흐름을 검증한다.
- 최종 변경이 `develop`에 병합된다.

## 작업 목록

- [x] 실행 계획을 하네스에 등록한다.
- [x] 별도 worktree를 준비한다.
- [x] `ship` 명령과 테스트를 복구한다.
- [x] 검증을 통과시킨다.
- [ ] 계획을 completed로 이동하고 커밋 및 병합한다.

## 완료 결과

- `harness.sh ship <task-id> <commit-message> <target-branch>` 명령을 복구했다.
- `ship`은 `complete-plan`, `commit`, `merge`, `report`를 순서대로 실행한다.
- 하네스 테스트가 `ship` 명령 노출과 내부 실행 순서를 검증하도록 갱신했다.
- `docs/harness/exec-workflow.md`에 종료 일괄 처리 명령을 추가했다.
- `first-post.mdx`의 `app/` 표기를 콘텐츠 테스트 기대값과 맞췄다.
- `npm.cmd run build`, `npm.cmd run lint`, `npm.cmd test`를 하네스로 통과했다.
