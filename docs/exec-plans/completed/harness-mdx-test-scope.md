# harness-mdx-test-scope

> 상태: 진행 중
> 마일스톤: 하네스 테스트 범위 정리
> 시작일: 2026-04-29

## 목표

`content/blog/*.mdx` 변경을 하네스 `tests-done`의 테스트 추가 필수 대상에서 제외하고, MDX 본문 내용을 고정 테스트로 묶는 기존 테스트를 제거한다.

## 범위

- `harness.sh`의 `tests-done` 변경 파일 분류에 `content/*.mdx` 예외를 추가한다.
- MDX 본문 문자열을 직접 검증하던 `tests/blog-content.test.ts`를 제거한다.
- 하네스 테스트에 MDX content 변경 제외 규칙을 추가한다.

## 변경 대상

- `harness.sh`
- `tests/harness-flow.test.ts`
- `tests/blog-content.test.ts`
- `docs/exec-plans/active/`
- `docs/exec-plans/completed/`

## 검증

- `npm.cmd run build`
- `npm.cmd run lint`
- `npm.cmd test`
- `./harness.sh ship harness-mdx-test-scope "chore: update mdx test scope" develop`

## 종료 조건

- `content/blog/*.mdx`만 변경된 경우 `tests-done`이 테스트 추가를 요구하지 않는다.
- MDX 본문 기준 테스트가 제거된다.
- 하네스 테스트가 새 분류 규칙을 검증한다.
- 검증, completed 이동, 커밋, `develop` 머지까지 완료된다.
