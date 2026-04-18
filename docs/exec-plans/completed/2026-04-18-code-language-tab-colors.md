# 2026-04-18-code-language-tab-colors

> 상태: 대체됨
> 마일스톤: M1 · MVP 블로그
> 시작일: 2026-04-18
> 종료일: 2026-04-18
> 머지 상태: 완료

## 목표

블로그 글의 MDX 코드 블록에 언어 라벨 헤더를 추가하고, 언어별 강조색을 적용해 VS Code처럼 빠르게 구분되는 읽기 경험을 만든다.

## 범위

- MDX 코드 블록 렌더링 구조 확장
- 언어별 코드 블록 헤더 및 색상 토큰 추가
- 관련 자동화 테스트 추가 또는 갱신
- 작업 완료 후 실행 계획 문서 상태 갱신

## 제외 범위

- 실제 구문 단위 syntax highlighting 엔진 도입
- 글 본문 전체의 컬러 시스템 재설계
- 코드 복사 버튼, 파일명 배지 등 부가 기능 추가

## 변경 대상

- `components/blog/mdx-components.tsx`
- `app/globals.css`
- `tests/`
- `docs/exec-plans/active/`

## 검증

- `npm.cmd test`
- `npm.cmd run lint`
- `npm.cmd run build -- --webpack`

## 종료 조건

- fenced code block 위에 언어 라벨 헤더가 렌더링된다
- 언어 종류에 따라 헤더 색이 달라진다
- 관련 테스트가 새 구조를 검증한다
- 빌드, 린트, 테스트가 모두 통과한다

## 작업 목록

- [x] active 실행 계획으로 기록한다
- [x] 전용 worktree와 작업 브랜치를 준비한다
- [x] MDX 코드 블록 UI를 언어 인지형으로 확장한다
- [x] 관련 테스트를 추가하거나 갱신한다
- [x] 검증을 완료한다

## 완료 결과

- 코드 블록 언어 탭 UI는 구현 완료됐다
- 실제 출하와 머지는 후속 계획 `2026-04-18-merge-enforced-shipping.md`에 통합됐다
