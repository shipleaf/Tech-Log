# 2026-04-16-ui-monochrome-pretendard

> 상태: 완료
> 마일스톤: M1 — MVP 블로그
> 시작일: 2026-04-16
> 종료일: 2026-04-16
> 머지 상태: 이 작업을 포함한 커밋을 `develop`에 병합함

## 목표

페이지 전체 스타일을 흑백 2색만 사용하는 방향으로 정리하고, 전역 폰트를 `Pretendard`로 통일한다.

## 범위

- 전역 색상 토큰을 흑백 기반으로 단순화
- 전역 폰트 설정을 `Pretendard`로 교체
- 레이아웃 및 공통 UI가 새 토큰을 따르도록 필요한 최소 수정
- 위 변경을 검증하는 자동화 테스트 추가 또는 갱신

## 제외 범위

- 새로운 페이지 구조 추가
- 개별 콘텐츠 카피 수정
- 흑백 범위를 넘는 별도 브랜딩 작업

## 변경 대상

- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/blog/[slug]/page.tsx`
- `components/blog/post-card.tsx`
- `components/blog/mdx-components.tsx`
- `components/ui/button.tsx`
- `tests/`

## 검증

- `npm run build`
- `npm run lint`
- `npm test`

## 종료 조건

- 전역 UI가 흑백 토큰만 사용하도록 정리된다
- 전체 기본 폰트가 `Pretendard`로 설정된다
- 관련 자동화 테스트가 추가되거나 갱신된다
- 빌드, 린트, 테스트가 모두 통과한다

## 작업 목록

- [x] active 실행 계획으로 기록한다
- [x] 전용 worktree와 작업 브랜치를 준비한다
- [x] 전역 스타일과 레이아웃을 요구사항에 맞게 수정한다
- [x] 관련 자동화 테스트를 추가하거나 갱신한다
- [x] 검증 후 완료 기록으로 이동한다

## 완료 결과

- 전역 색상 토큰을 흰색과 검은색만 쓰는 형태로 단순화했다
- `Pretendard`를 전역 기본 폰트와 헤딩, 코드 폰트 변수에 모두 연결했다
- 그라데이션, 그림자, 반투명 스타일을 공통 레이아웃과 주요 UI 컴포넌트에서 제거했다
- `tests/ui-theme.test.ts`를 추가해 흑백 토큰과 폰트 규칙이 유지되도록 고정했다

## 검증 결과

- `npm run build`
- `npm run lint`
- `npm test`
