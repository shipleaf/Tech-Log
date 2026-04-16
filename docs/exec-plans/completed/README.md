# docs/exec-plans/completed/README.md

> 완료된 실행 계획을 보관하는 디렉터리입니다.

## 상태 값

- `완료` — 목표를 달성하고 종료됨
- `취소` — 작업을 시작했지만 더 진행하지 않기로 결정됨
- `대체됨` — 더 작은 단위 계획이나 다른 문서 구조로 교체됨

## 보관 목록

- [`M0-harness-setup.md`](./M0-harness-setup.md) — 장기 마일스톤 계획에서 종료 기록으로 전환됨
- [`2026-04-16-exec-plan-flow-audit.md`](./2026-04-16-exec-plan-flow-audit.md) — 실행 계획 운영 흐름 점검 및 active 초기화
- [`2026-04-16-exec-plan-commit-merge.md`](./2026-04-16-exec-plan-commit-merge.md) — exec-plans 정리 변경 커밋 및 develop 병합
- [`2026-04-16-sticky-scroll-header.md`](./2026-04-16-sticky-scroll-header.md) — 스크롤 위치에 따라 전환되는 sticky 헤더 구현
- [`2026-04-16-sticky-scroll-header-fix.md`](./2026-04-16-sticky-scroll-header-fix.md) — sticky 헤더를 무력화하던 overflow 레이아웃 회귀 수정
- [`2026-04-16-post-detail-header-layout.md`](./2026-04-16-post-detail-header-layout.md) — 게시글 상세 헤더의 카드 border를 제거하고 가운데 정렬 메타 레이아웃과 조회수/좋아요 자리표시를 추가
- [`2026-04-16-ui-monochrome-pretendard.md`](./2026-04-16-ui-monochrome-pretendard.md) — 전역 UI를 흑백 토큰과 Pretendard 폰트로 정리
- [`2026-04-16-shell-exec-harness.md`](./2026-04-16-shell-exec-harness.md) — AGENTS 실행 순서를 강제하는 쉘 하네스 추가

## 규칙

- 활성 계획에서 종료된 문서를 이 디렉터리로 이동한다
- 이동 시 완료일과 결과를 문서에 반영한다
- `docs/PLANS.md`와 상태가 일치하도록 함께 갱신한다
