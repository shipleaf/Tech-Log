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

**절대 금지:**
- `ui/`에서 `repository/` 직접 호출
- `types/`에서 다른 내부 레이어 import
- 레이어 역방향 의존성 (예: `service/`에서 `ui/` import)

---

## 도메인 구조 (블로그 앱 기준)

```
src/
├── types/          # 공유 타입 (Post, Tag, Author 등)
├── config/         # 환경설정
├── repository/     # DB 쿼리 레이어
│   ├── post/
│   ├── tag/
│   └── author/
├── service/        # 비즈니스 로직
│   ├── post/
│   ├── search/
│   └── rss/
├── runtime/        # API 엔드포인트
│   └── api/
└── ui/             # 컴포넌트 & 페이지
    ├── components/
    ├── layouts/
    └── pages/
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
| (미정) | — | — | — |

---

_마지막 갱신: <!-- 날짜 --> | 검증 상태: 초안_
