# 2026-04-16-post-detail-spacing-tune

> 상태: 완료
> 마일스톤: M1 — MVP 블로그
> 시작일: 2026-04-16
> 종료일: 2026-04-16
> 머지 상태: 이 작업을 포함한 커밋을 `develop`에 병합 예정

## 목표

게시글 상세 페이지에서 제목 영역과 본문 영역 사이의 간격을 지금보다 더 여유 있게 조정해 읽기 전환이 답답하지 않도록 만든다.

## 범위

- 게시글 상세 페이지 헤더와 본문 사이 vertical gap 확대
- 해당 간격 회귀를 막는 테스트 갱신

## 제외 범위

- 제목/메타 정렬 구조 변경
- 본문 타이포그래피 수정
- 목록 페이지 간격 조정

## 변경 대상

- `app/blog/[slug]/page.tsx`
- `tests/blog-post-page.test.ts`
- `docs/exec-plans/active/`

## 검증

- `npm run build`
- `npm run lint`
- `npm test`

## 종료 조건

- 게시글 상세 페이지에서 헤더와 본문 사이 간격이 현재보다 명확히 늘어난다
- 관련 테스트가 새 간격을 고정한다
- 빌드, 린트, 테스트가 모두 통과한다

## 작업 목록

- [x] active 실행 계획으로 기록한다
- [x] 전용 worktree와 작업 브랜치를 준비한다
- [x] 상세 페이지 간격과 테스트를 갱신한다
- [x] 검증 후 완료 기록으로 이동한다

## 완료 결과

- 게시글 상세 페이지 `article`의 vertical gap을 `gap-12`에서 `gap-24`로 늘렸다
- `tests/blog-post-page.test.ts`가 새 간격 클래스를 직접 확인하도록 갱신했다

## 검증 결과

- `npm run build`
- `npm run lint`
- `npm test`
