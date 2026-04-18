# 2026-04-18-example-post-code-tabs

> 상태: 완료
> 마일스톤: M1 · MVP 블로그
> 시작일: 2026-04-18
> 종료일: 2026-04-18
> 머지 상태: 완료

## 목표

현재 예시 블로그 글 두 편에 언어별 코드 블록 예시를 보강해, 새 MDX 코드 탭 UI가 실제 게시글에서 바로 보이도록 만든다.

## 범위

- `content/blog/*.mdx` 예시 글 보강
- 관련 콘텐츠 테스트 추가 또는 갱신
- 검증 후 실행 계획 문서 종료 처리

## 제외 범위

- 코드 블록 UI 구현 자체 변경
- 새 블로그 글 추가
- 디자인 토큰 재조정

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

- 두 예시 글에서 서로 다른 언어 코드 블록을 실제로 확인할 수 있다
- 관련 테스트가 콘텐츠 예시를 검증한다
- 검증이 모두 통과한다
- 최종 커밋이 `develop`에 병합된다

## 작업 목록

- [x] active 실행 계획으로 기록한다
- [x] 전용 worktree와 작업 브랜치를 준비한다
- [x] 예시 글의 코드 블록 예시를 보강한다
- [x] 관련 테스트를 갱신한다
- [x] 검증, completed 이동, 커밋, 머지까지 끝낸다

## 완료 결과

- 첫 번째 예시 글에 `tsx`, `bash` 코드 블록을 배치했다
- 두 번째 예시 글에 `mdx`, `json` 코드 블록을 배치했다
- 콘텐츠 테스트가 각 예시 글의 언어별 fenced block을 검증한다
- 검증 명령 전체를 통과했다
