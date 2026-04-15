# PS-001 — 포스트 작성 & 발행

## 목표

개발자가 `content/blog/*.mdx` 파일만 추가해도 기술 블로그 목록과 상세 페이지에
즉시 반영되는 최소 발행 흐름을 제공한다.

## 범위

- Next.js App Router 기반의 목록 페이지: `app/blog/page.tsx`
- 동적 상세 페이지: `app/blog/[slug]/page.tsx`
- 파일 기반 콘텐츠 저장소: `content/blog/*.mdx`
- frontmatter 기반 메타데이터
- 정적 경로 생성 및 빌드 시 검증

## 기능 요구사항

1. 포스트는 `.mdx` 파일 하나로 관리한다.
2. 각 포스트는 아래 frontmatter를 제공해야 한다.
   - `title`
   - `description`
   - `date`
   - `tags`
   - `published`
3. 목록 페이지는 발행된 포스트만 최신순으로 보여준다.
4. 상세 페이지는 슬러그 기반 동적 라우트를 사용한다.
5. 읽기 시간은 콘텐츠 본문 기준으로 자동 계산한다.
6. 빌드 전에 `build → lint → test` 검증을 통과해야 한다.

## 비기능 요구사항

- 루트에 이미 존재하는 문서와 하네스 파일은 이동하지 않는다.
- TypeScript strict 모드를 유지한다.
- Tailwind CSS와 shadcn/ui를 사용해 UI를 구성한다.

## 제외 범위

- CMS 연동
- 로그인/권한
- 태그 상세 페이지
- 검색, RSS, 코드 하이라이팅 고도화
