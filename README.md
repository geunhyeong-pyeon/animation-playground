# Animation Playground

웹 애니메이션 개념을 **문서 + 직접 만져 보는 예제**로 정리한 저장소입니다. 기초(transition, easing)부터 레이아웃 전환 애니메이션(FLIP)까지 다룹니다.

**사이트:** https://geunhyeong-pyeon.github.io/animation-playground/

## 목차

| 장 | 문서 | 예제에서 해 볼 것 |
|---|---|---|
| 1 | [transition vs animation](docs/01-transition-vs-animation.md) | 토글 중 방향 바꾸기, @keyframes 재생, 순간이동하는 flex-direction |
| 2 | [Easing](docs/02-easing.md) | 같은 거리를 달리는 공 비교, cubic-bezier 곡선 조절 |
| 3 | [transform과 성능](docs/03-transform-and-performance.md) | width vs scaleX: 옆 요소가 밀리는지 |
| 4 | [@keyframes 패턴](docs/04-keyframes.md) | 등장 패널, 2번 깜빡임, 로딩 점 stagger |
| 5 | [Web Animations API](docs/05-web-animations-api.md) | play / pause / reverse / 배속 / cancel |
| 6 | [React 타이밍](docs/06-react-timing.md) | useEffect vs useLayoutEffect FLIP 비교 |
| 7 | [FLIP](docs/07-flip.md) | 카드 섞기, 3열 보드 → 목록 + 상세 (FLIP 켜고 끄기) |
| 8 | [접근성](docs/08-accessibility.md) | prefers-reduced-motion 실시간 확인 |

재사용할 수 있는 코드:

- [`src/hooks/useFlip.ts`](src/hooks/useFlip.ts): React용 FLIP 훅
- [`src/hooks/usePrefersReducedMotion.ts`](src/hooks/usePrefersReducedMotion.ts): 동작 줄이기 설정 구독

## 실행

```bash
pnpm install
pnpm dev
```

`main` 브랜치에 push하면 GitHub Actions가 빌드해 GitHub Pages로 배포합니다.

## 새 내용 추가하기

1. `docs/NN-주제.md`에 문서를 씁니다.
2. `src/demos/`에 예제 컴포넌트를 만듭니다.
3. `src/chapters.ts`의 `CHAPTERS`에 한 줄 추가합니다.
