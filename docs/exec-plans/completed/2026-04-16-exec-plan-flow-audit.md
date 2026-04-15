# 2026-04-16-exec-plan-flow-audit

> 상태: 완료
> 마일스톤: M0 — 하네스 구축
> 시작일: 2026-04-16
> 종료일: 2026-04-16
> 머지 상태: 이 작업 정리 커밋에 포함되어 develop에 병합됨

## 목표

`docs/exec-plans` 운영 흐름을 점검하고, 앞으로는 사용자 명령마다 작은 단위 플랜을 `active/`에 기록한 뒤 완료 시 `completed/`로 이동하는 방식으로 정리한다.

## 범위

- 현재 `active/`와 `completed/` 운영 상태 점검
- stale 상태가 된 `M0-harness-setup.md` 정리
- `AGENTS.md`, `CONTEXT_MAP.md`, `docs/PLANS.md`, `docs/exec-plans/*` 문서 정합성 수정

## 제외 범위

- CI, 린트, 앱 코드 동작 변경
- M0의 미완료 구현 항목 착수

## 변경 대상

- `AGENTS.md`
- `CONTEXT_MAP.md`
- `docs/PLANS.md`
- `docs/exec-plans/README.md`
- `docs/exec-plans/active/README.md`
- `docs/exec-plans/completed/M0-harness-setup.md`
- `docs/exec-plans/completed/README.md`
- `docs/index.md`
- `tests/exec-plans-docs.test.ts`

## 검증

- 문서 간 링크와 참조 경로 확인
- `active/`와 `completed/` 최종 구조 점검
- stale 상태였던 기술 스택 항목 반영 여부 확인

## 종료 조건

- `active/`에 장기 마일스톤 파일이 남아 있지 않다
- 실행 계획 흐름이 문서로 명확히 정의되어 있다
- 이번 작업 기록을 완료 후 `completed/`로 이동할 수 있다

## 완료 결과

- `M0-harness-setup.md`를 활성 계획에서 제거하고 종료 기록으로 보관했다
- `docs/PLANS.md`와 `docs/exec-plans/*`의 역할을 마일스톤 추적과 작업 단위 추적으로 분리했다
- 사용자 명령마다 작은 단위 플랜을 `active/`에 기록하고 종료 시 `completed/`로 이동하는 규칙을 문서화했다
- `tests/exec-plans-docs.test.ts`를 추가해 실행 계획 디렉터리 구조를 자동 점검하게 했다

## 검증 결과

- `npm run build`
- `npm run lint`
- `npm test`

## 작업 목록

- [x] 운영 흐름 점검 결과를 문서화한다
- [x] `active/` 운영 규칙을 작은 단위 플랜 기준으로 갱신한다
- [x] 기존 `M0` 문서를 종료 기록으로 전환한다
- [x] 완료 후 이 파일을 `completed/`로 이동한다
