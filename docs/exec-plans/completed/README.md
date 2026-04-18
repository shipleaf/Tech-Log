# docs/exec-plans/completed/README.md

> 완료된 실행 계획을 보관하는 디렉터리입니다.

## 상태 값

- `완료`: 목표를 달성하고 종료되었다
- `취소`: 작업을 시작했지만 더 진행하지 않기로 결정했다
- `대체됨`: 다른 작업 단위 계획이나 문서 구조로 교체되었다

## 보관 목록

- [`M0-harness-setup.md`](./M0-harness-setup.md) 초기 하네스 설정 계획의 종료 기록
- [`2026-04-16-exec-plan-flow-audit.md`](./2026-04-16-exec-plan-flow-audit.md) 실행 계획 흐름 점검과 active 정리
- [`2026-04-16-exec-plan-commit-merge.md`](./2026-04-16-exec-plan-commit-merge.md) exec-plans 정리 변경의 커밋과 develop 병합
- [`2026-04-16-post-detail-spacing-tune.md`](./2026-04-16-post-detail-spacing-tune.md) 게시글 상세 간격 조정과 테스트 갱신
- [`2026-04-16-sticky-scroll-header.md`](./2026-04-16-sticky-scroll-header.md) sticky 헤더 구현
- [`2026-04-16-sticky-scroll-header-fix.md`](./2026-04-16-sticky-scroll-header-fix.md) sticky 헤더 overflow 수정
- [`2026-04-16-post-detail-header-layout.md`](./2026-04-16-post-detail-header-layout.md) 게시글 상세 헤더 레이아웃 개편
- [`2026-04-16-ui-monochrome-pretendard.md`](./2026-04-16-ui-monochrome-pretendard.md) 전역 UI 흑백 토큰과 Pretendard 정리
- [`2026-04-16-shell-exec-harness.md`](./2026-04-16-shell-exec-harness.md) AGENTS 실행 순서를 강제하는 셸 하네스 추가
- [`2026-04-18-header-next-tab-removal.md`](./2026-04-18-header-next-tab-removal.md) 헤더의 Next 배지 제거
- [`2026-04-18-code-language-tab-colors.md`](./2026-04-18-code-language-tab-colors.md) 코드 블록 언어 탭 UI 작업과 출하 계획 통합
- [`2026-04-18-merge-enforced-shipping.md`](./2026-04-18-merge-enforced-shipping.md) 머지 강제 종료 워크플로우와 코드 탭 UI 출하
- [`2026-04-18-example-post-code-tabs.md`](./2026-04-18-example-post-code-tabs.md) 예시 블로그 글에 `tsx`, `bash`, `mdx`, `json` 코드 블록 적용
- [`2026-04-18-fix-mojibake-utf8-content.md`](./2026-04-18-fix-mojibake-utf8-content.md) 샘플 블로그 글 한글 깨짐을 UTF-8 본문으로 복구

## 규칙

- 실행 계획이 끝나면 이 디렉터리로 이동한다
- 이동 전에 종료 상태와 결과를 문서에 반영한다
- `docs/PLANS.md`와 상태가 일치하도록 함께 갱신한다
