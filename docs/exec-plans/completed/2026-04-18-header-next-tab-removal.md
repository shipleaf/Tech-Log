# 2026-04-18-header-next-tab-removal

> 상태: 완료
> 마일스톤: M1 — MVP 블로그
> 시작일: 2026-04-18
> 종료일: 2026-04-18
> 머지 상태: 커밋/머지 미완료

## 목표

사이트 헤더에서 `홈`, `블로그` 링크 오른쪽에 보이는 기술 스택 배지를 제거해 내비게이션을 더 단순하게 만든다.

## 범위

- 헤더 내 기술 스택 배지 제거
- 관련 자동화 테스트 추가 또는 갱신
- 실행 계획 문서 상태 갱신

## 제외 범위

- 헤더의 스크롤 전환 동작 변경
- 헤더 색상, 간격, 타이포그래피 재설계
- 다른 페이지 레이아웃 수정

## 변경 대상

- `components/layout/SiteHeader.tsx`
- `tests/header-scroll.test.ts`
- `docs/exec-plans/active/`

## 검증

- `npm run build`
- `npm run lint`
- `npm test`

## 종료 조건

- 헤더에서 기술 스택 배지가 제거된다
- `홈`, `블로그` 링크는 기존 동작을 유지한다
- 관련 자동화 테스트가 현재 구조를 검증한다
- 빌드, 린트, 테스트가 모두 통과한다

## 작업 목록

- [x] active 실행 계획으로 기록한다
- [x] 전용 worktree와 작업 브랜치를 준비한다
- [x] 헤더 배지를 제거한다
- [x] 관련 자동화 테스트를 갱신한다
- [x] 검증 결과를 기록한 뒤 completed로 이동한다

## 완료 결과

- 헤더 내 `Next.js · MDX · shadcn/ui` 기술 스택 배지를 제거했다
- `홈`, `블로그` 링크는 기존 위치와 동작을 유지했다
- `tests/header-scroll.test.ts`에 내비게이션 링크 존재와 기술 스택 배지 부재를 검증하는 단언을 추가했다

## 검증 결과

- `npm.cmd run lint` 통과
- `npm.cmd run build` 통과
- `npm.cmd test` 실행: 변경 관련 `tests/header-scroll.test.ts`는 통과했지만, 전체 스위트의 `tests/harness-flow.test.ts`는 현재 Windows 실행 환경에 `sh` 바이너리가 없어 실패
