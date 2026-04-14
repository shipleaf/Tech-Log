# AGENTS.md

> 이 파일은 Codex용 부트스트랩 문서입니다.
> Codex는 모든 태스크 시작 전에 반드시 이 파일을 먼저 읽고, 바로 이어서 `docs/EXECUTION_RULES.md`와 관련 문서를 순서대로 로드해야 합니다.

---

## 핵심 원칙

- **코드를 직접 작성하지 않는다.** 모든 구현은 Codex가 담당한다.
- **레포지토리가 단일 진실 공급원이다.** Slack, 메모, 구두 합의는 존재하지 않는다.
- **컨텍스트에 없으면 존재하지 않는다.** 에이전트가 접근할 수 없는 지식은 없는 것과 같다.
- **실패하면 하네스를 고친다.** "더 열심히 시도"가 아니라 "무엇이 빠졌는가"를 묻는다.

---

## 필수 선행 로드

Codex는 어떤 구현 작업도 시작하기 전에 반드시 아래 문서를 순서대로 읽는다.

1. [`docs/EXECUTION_RULES.md`](./docs/EXECUTION_RULES.md)
2. 관련 [`docs/product-specs/index.md`](./docs/product-specs/index.md) 및 세부 명세
3. [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
4. [`docs/exec-plans/active/README.md`](./docs/exec-plans/active/README.md)
5. [`docs/QUALITY_SCORE.md`](./docs/QUALITY_SCORE.md)

위 문서를 읽기 전에는 파일 수정, 테스트 작성, 검증, 커밋, 완료 보고를 시작하지 않는다.

---

## 지식 베이스 지도

### 아키텍처

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — 레이어 구조, 패키지 의존성 규칙
- [`docs/design-docs/index.md`](./docs/design-docs/index.md) — 설계 결정 목록 및 검증 상태

### 제품

- [`docs/product-specs/index.md`](./docs/product-specs/index.md) — 기능 목록 및 명세 링크
- [`docs/PLANS.md`](./docs/PLANS.md) — 현재 진행 중인 마일스톤 및 기능 범위
- [`docs/PRODUCT_SENSE.md`](./docs/PRODUCT_SENSE.md) — 제품 방향성 및 핵심 사용자 가치

### 실행

- [`docs/EXECUTION_RULES.md`](./docs/EXECUTION_RULES.md) — 작업 시작 조건, 실행 순서, 완료 조건
- [`docs/exec-plans/active/README.md`](./docs/exec-plans/active/README.md) — 현재 활성 실행 계획
- [`docs/exec-plans/tech-debt-tracker.md`](./docs/exec-plans/tech-debt-tracker.md) — 기술 부채 목록

### 품질 & 신뢰성

- [`docs/QUALITY_SCORE.md`](./docs/QUALITY_SCORE.md) — 도메인별 품질 등급 (A–F)
- [`docs/RELIABILITY.md`](./docs/RELIABILITY.md) — 안정성 기준 및 SLO
- [`docs/SECURITY.md`](./docs/SECURITY.md) — 보안 원칙 및 체크리스트

### 프론트엔드

- [`docs/FRONTEND.md`](./docs/FRONTEND.md) — UI 컴포넌트 규칙, 스타일 가이드
- [`docs/DESIGN.md`](./docs/DESIGN.md) — 디자인 원칙, 타이포그래피, 컬러
- [`docs/references/design-system-reference-llms.txt`](./docs/references/design-system-reference-llms.txt) — 에이전트용 디자인 시스템 레퍼런스

### 외부 도구 레퍼런스

- [`docs/references/README.md`](./docs/references/README.md) — 라이브러리 LLM 친화적 문서 모음

---

## 태스크 시작 전 체크리스트

1. [`docs/EXECUTION_RULES.md`](./docs/EXECUTION_RULES.md)를 읽었는가?
2. 레이어 규칙([`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md))을 확인했는가?
3. 관련 [`docs/product-specs/index.md`](./docs/product-specs/index.md) 문서와 세부 명세를 읽었는가?
4. 현재 활성 실행 계획([`docs/exec-plans/active/README.md`](./docs/exec-plans/active/README.md))과 충돌하지 않는가?
5. [`docs/QUALITY_SCORE.md`](./docs/QUALITY_SCORE.md)에서 해당 도메인의 현재 등급을 확인했는가?

---

## 코드 생성 규칙

- PR은 하나의 명확한 목적만 가진다 (기능, 버그픽스, 리팩터 혼재 금지)
- 커밋 메시지: `type(scope): description` (예: `feat: 설명`)
- 테스트 없는 PR은 머지하지 않는다
- `docs/generated/`의 파일은 직접 편집하지 않는다 (자동 생성됨)

---

## 문서 갱신 규칙

- 새 기능 추가 시 [`docs/product-specs/index.md`](./docs/product-specs/index.md)에 명세를 먼저 작성한다
- 아키텍처 변경 시 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)와 [`docs/design-docs/index.md`](./docs/design-docs/index.md)를 동시에 업데이트한다
- 완료된 실행 계획은 `docs/exec-plans/active/` → `docs/exec-plans/completed/`로 이동한다
- 문서가 30일 이상 검증되지 않은 경우 stale 태그를 붙인다

---

_마지막 갱신: 2026-04-15 | 검증 상태: 초안_
