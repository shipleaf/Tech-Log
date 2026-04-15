# ARCHITECTURE.md

> 이 문서는 Codex가 코드를 생성할 때 반드시 준수해야 하는 레이어 구조를 정의합니다.
> 위반은 CI에서 자동으로 차단됩니다.

---

## 레이어 의존성 규칙

의존성은 왼쪽에서 오른쪽으로만 흐릅니다.

```
Types → Config → Repository → Service → Runtime → UI
```

| 레이어 | 설명 | 허용된 import |
|--------|------|--------------|
| `types/` | 공유 타입, 인터페이스, 상수 | 외부 라이브러리만 |
| `config/` | 환경변수, 설정값 | `types/` |
| `repository/` | DB 접근, 데이터 영속성 | `types/`, `config/` |
| `service/` | 비즈니스 로직 | `types/`, `config/`, `repository/` |
| `runtime/` | API 라우트, 서버 로직 | 모든 상위 레이어 |
| `ui/` | 컴포넌트, 페이지 | `types/`, `runtime/` API만 |

이 저장소에서 **UI 레이어는 `app/` 라우트와 `components/` 폴더**로 구현한다.
`content/`는 데이터 소스이며, 오직 `runtime/`만 읽을 수 있다.

**절대 금지:**
- `ui/`에서 `repository/` 직접 호출
- `types/`에서 다른 내부 레이어 import
- 레이어 역방향 의존성 (예: `service/`에서 `ui/` import)

---

## 도메인 구조 (블로그 앱 기준)

```
app/                # Next.js App Router surface (UI)
components/         # shadcn/ui 및 블로그 UI 컴포넌트 (UI)
config/             # 사이트 설정
content/
└── blog/           # MDX 원본 포스트, runtime 에서만 읽음
runtime/            # 파일 시스템 접근 및 MDX 렌더링
types/              # 공유 타입
```

---

## 구조적 검증

다음은 CI에서 자동으로 검사됩니다:

- [ ] `ui/`에서 `repository/` import 없음
- [ ] `types/`에서 내부 모듈 import 없음
- [ ] 순환 의존성 없음
- [ ] 레이어별 테스트 커버리지 기준 충족 (`QUALITY_SCORE.md` 참조)

---

## 기술 스택 결정 로그

> 기술 스택은 논의를 통해 결정되며, 결정될 때마다 이 섹션에 추가합니다.

| 카테고리 | 결정 | 근거 | 결정일 |
|---------|------|------|-------|
| 프레임워크 | Next.js 16 App Router | 파일 기반 라우팅과 정적 생성, React Server Components 활용 | 2026-04-15 |
| 언어 | TypeScript strict | 명시적 타입과 자동화 검증 강화 | 2026-04-15 |
| 스타일링 | Tailwind CSS v4 | 빠른 반복과 디자인 토큰 관리 | 2026-04-15 |
| UI 프리미티브 | shadcn/ui | 코드 소유권을 유지한 채 재사용 가능한 UI 확보 | 2026-04-15 |
| 콘텐츠 저장 방식 | `content/blog/*.mdx` 파일 기반 | 작은 MVP에서 작성 마찰과 유지보수 비용 최소화 | 2026-04-15 |

---

_마지막 갱신: 2026-04-15 | 검증 상태: 초안_
