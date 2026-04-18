# 2026-04-18-post-card-click-target-and-hover

> 상태: 완료
> 마일스톤: M1 · MVP 블로그
> 시작일: 2026-04-18
> 종료일: 2026-04-18
> 머지 상태: 미완료

## 목표

포스트 카드에서 `읽으러 가기` 버튼만이 아니라 카드 전체를 클릭해 상세 페이지로 이동할 수 있게 만들고, 마우스 호버 시 클릭 가능한 카드라는 점이 분명하게 드러나도록 강조 상태를 추가한다.

## 범위

- 블로그 목록에서 사용하는 `PostCard` 상호작용 구조 조정
- 카드 hover 및 focus-visible 강조 스타일 추가
- 관련 자동화 테스트 추가 또는 갱신
- Windows 환경에서도 동작하는 하네스 경로 정규화 및 테스트 안정화
- 작업 완료 후 실행 계획 문서 상태 갱신 및 completed 이동

## 제외 범위

- 블로그 상세 페이지 레이아웃 변경
- 카드 내부 정보 구조 재배치
- 모바일 전용 별도 제스처 추가

## 변경 대상

- `components/blog/post-card.tsx`
- `harness.sh`
- `tests/`
- `docs/exec-plans/completed/`

## 검증

- `npm run build`
- `npm run lint`
- `npm test`

## 종료 조건

- 포스트 카드의 비버튼 영역을 클릭해도 해당 상세 페이지로 이동한다
- 카드 hover 또는 keyboard focus 시 강조 상태가 드러난다
- 관련 테스트가 새 상호작용 구조를 검증한다
- 빌드, 린트, 테스트가 모두 통과한다

## 작업 목록

- [x] active 실행 계획으로 기록한다
- [x] 전용 worktree와 작업 브랜치를 준비한다
- [x] 포스트 카드 클릭 타깃을 카드 전체로 확장한다
- [x] hover 및 focus-visible 강조 상태를 추가한다
- [x] 관련 테스트를 추가하거나 갱신한다
- [x] 검증 후 completed로 이동한다

## 완료 결과

- `PostCard`를 카드 전체가 하나의 링크가 되도록 바꾸고 hover/focus-visible 강조 상태를 추가했다
- `tests/post-card.test.ts`를 추가해 전체 클릭 타깃과 강조 클래스 회귀를 고정했다
- `harness.sh`에 Windows 경로 정규화를 추가하고 `tests/harness-flow.test.ts`를 안정적인 구조 검증으로 바꿨다
- `npm run build`, `npm run lint`, `npm test`를 통과했다
