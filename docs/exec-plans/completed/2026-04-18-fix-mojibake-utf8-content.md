# 2026-04-18-fix-mojibake-utf8-content

> 상태: 완료
> 마일스톤: M1 MVP 블로그
> 시작일: 2026-04-18
> 종료일: 2026-04-18
> 머지 상태: 완료

## 목표

코드 탭 예시를 추가하면서 깨진 샘플 블로그 글 본문을 UTF-8 기준의 정상적인 한글 콘텐츠로 복구한다.

## 범위

- `content/blog/first-post.mdx` 한글 본문 복구
- `content/blog/second-post.mdx` 한글 본문 복구
- 관련 테스트와 실행 계획 문서 정리

## 제외 범위

- 코드 탭 UI 동작 변경
- 블로그 렌더링 구조 변경
- 신규 포스트 추가

## 변경 대상

- `content/blog/first-post.mdx`
- `content/blog/second-post.mdx`
- `tests/blog-content.test.ts`
- `docs/exec-plans/`

## 검증

- `npm.cmd test`
- `npm.cmd run lint`
- `npm.cmd run build -- --webpack`

## 종료 조건

- 샘플 블로그 글 두 개가 UTF-8 기준으로 정상적인 한글 본문을 렌더링한다
- 코드 탭 예시용 fenced code block 언어 지정이 유지된다
- 관련 테스트, 린트, 빌드가 모두 통과한다
- 계획 문서를 `completed/`로 이동하고 최종 커밋을 `develop`에 머지한다

## 작업 목록

- [x] active 실행 계획으로 기록한다
- [x] 전용 worktree와 작업 브랜치를 준비한다
- [x] 샘플 MDX 본문을 UTF-8로 복구한다
- [x] 필요한 테스트를 확인하거나 갱신한다
- [x] 검증, completed 이동, 커밋, 머지까지 완료한다

## 완료 결과

- 깨진 샘플 블로그 글 두 개를 정상적인 UTF-8 한글 본문으로 복구했다
- 코드 탭 확인용 `tsx`, `bash`, `mdx`, `json` fenced code block은 그대로 유지했다
- 콘텐츠 테스트에 한글 본문 검증을 추가해 동일한 깨짐을 다시 잡을 수 있게 했다
- `test`, `lint`, `build`를 모두 통과했다
