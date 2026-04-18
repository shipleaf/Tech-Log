# 2026-04-18-merge-enforced-shipping

> 상태: 완료
> 마일스톤: M1 · MVP 블로그
> 시작일: 2026-04-18
> 종료일: 2026-04-18
> 머지 상태: 완료

## 목표

작업 종료 시 Codex가 머지까지 직접 수행하도록 하네스와 실행 문서를 강화하고, 대기 중이던 코드 블록 언어 탭 UI 변경을 `develop`에 반영한다.

## 범위

- 종료 워크플로우에서 머지까지 한 번에 수행하는 하네스 명령 추가
- 관련 문서와 테스트 갱신
- 기존 코드 블록 언어 탭 UI 변경을 같은 브랜치에서 검증 및 반영

## 제외 범위

- 원격 푸시 자동화
- PR 생성 자동화
- 코드 블록 구문 하이라이팅 엔진 도입

## 변경 대상

- `harness.sh`
- `tests/harness-flow.test.ts`
- `AGENTS.md`
- `docs/exec-plans/README.md`
- `docs/exec-plans/active/`
- `docs/exec-plans/completed/`
- `components/blog/mdx-components.tsx`
- `app/globals.css`
- `tests/`

## 검증

- `npm.cmd test`
- `npm.cmd run lint`
- `npm.cmd run build -- --webpack`

## 종료 조건

- 하네스에서 최종 단계가 머지를 포함해 한 번에 수행된다
- 관련 테스트가 Windows 환경에서도 통과한다
- 코드 블록 언어 탭 UI 변경이 함께 검증된다
- 최종 커밋이 `develop`에 병합되어 루트 작업 트리에서 확인된다

## 작업 목록

- [x] active 실행 계획으로 기록한다
- [x] 현재 기능 worktree를 `develop` 기준으로 정렬한다
- [x] 종료 워크플로우와 테스트를 갱신한다
- [x] 코드 블록 UI 변경과 함께 검증한다
- [x] completed 이동 후 커밋, 머지, 결과 확인까지 끝낸다

## 완료 결과

- `harness.sh ship <task-id> <commit-message> <target-branch>` 명령을 추가했다
- `tests/harness-flow.test.ts`를 Windows 친화적으로 보강하고 `ship` 흐름을 검증하도록 갱신했다
- `AGENTS.md`와 `docs/exec-plans/README.md`에 머지까지 직접 수행하는 종료 규칙을 명시했다
- MDX 코드 블록은 언어 라벨 헤더와 언어별 강조색을 적용했다
- `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build -- --webpack`를 모두 통과했다
