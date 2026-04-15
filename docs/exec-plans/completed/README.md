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

## 규칙

- 활성 계획에서 종료된 문서를 이 디렉터리로 이동한다
- 이동 시 완료일과 결과를 문서에 반영한다
- `docs/PLANS.md`와 상태가 일치하도록 함께 갱신한다
