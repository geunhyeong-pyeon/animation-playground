# 7. FLIP: 레이아웃 변경을 애니메이션하기

## 문제

3열 카드가 "왼쪽 1열 + 오른쪽 상세"로 바뀌는 화면을 생각해 보세요.

```css
.board          { display: flex; flex-direction: row; }
.board.selected { flex-direction: column; width: 33%; }
```

`flex-direction`은 보간할 수 없어서 카드들이 **순간이동**해요. `width`에 transition을 걸어도 폭만 줄어들 뿐, 가로 → 세로로 바뀌는 순간은 여전히 뚝 끊겨요.

## 아이디어

> 레이아웃은 한 번에 바꾸고, **눈속임(transform)만 애니메이션한다.**

| 단계 | 하는 일 |
|---|---|
| **F**irst | 바뀌기 **전** 위치를 잰다 |
| **L**ast | 레이아웃을 바꾸고 **새** 위치를 잰다 |
| **I**nvert | 새 자리에 있는 요소를 `transform`으로 옛 자리에 있는 것처럼 되돌린다 |
| **P**lay | 그 transform을 0으로 풀며 애니메이션한다 |

Invert와 Play가 **화면에 그려지기 전에** 시작되기 때문에, 사용자는 요소가 새 자리에 있는 모습을 한 번도 못 보고 옛 자리에서 출발해 움직이는 모습만 봐요.

## 숫자로 보기

카드가 3열일 때 `(x=1200, y=300)`에 있다가, 1열이 된 뒤 `(x=240, y=900)`에 있다고 할게요.

```
delta = 이전 - 이후 = (1200 - 240, 300 - 900) = (960, -600)

시작: transform: translate(960px, -600px)  → 화면상 (1200, 300)에 보임
끝:   transform: none                       → 실제 자리 (240, 900)
```

## React 구현

```tsx
const useFlip = (layoutKey: unknown) => {
  const elementsRef = useRef(new Map<string, HTMLElement>());
  const rectsBeforeRef = useRef<Map<string, DOMRect> | null>(null);

  const register = (key: string) => (el: HTMLElement | null) => {
    if (!el) return;
    elementsRef.current.set(key, el);
    return () => elementsRef.current.delete(key);
  };

  // First: 상태를 바꾸기 직전(이벤트 핸들러)에 호출
  const capture = () => {
    rectsBeforeRef.current = new Map(
      [...elementsRef.current].map(([key, el]) => [key, el.getBoundingClientRect()]),
    );
  };

  useLayoutEffect(() => {
    const before = rectsBeforeRef.current;
    rectsBeforeRef.current = null;
    if (!before) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    elementsRef.current.forEach((el, key) => {
      const first = before.get(key);
      if (!first) return;
      const last = el.getBoundingClientRect();              // Last
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` },     // Invert
         { transform: "none" }],                            // Play
        { duration: 420, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      );
    });
  }, [layoutKey]);

  return { register, capture };
};
```

사용하는 쪽:

```tsx
const { register, capture } = useFlip(isSelected);

const handleSelect = (id: string) => {
  capture();            // 1. 바뀌기 전 위치 기록
  setSelectedId(id);    // 2. 레이아웃 변경 요청
};

<div className={isSelected ? "board selected" : "board"}>
  {columns.map(c => <div key={c.id} ref={register(c.id)}>...</div>)}
</div>
```

## 자주 하는 실수

- **capture를 setState 뒤에 부르기.** 이미 늦었어요. 반드시 상태를 바꾸기 전에 재야 해요.
- **useEffect에서 하기.** 새 위치가 한 프레임 보였다가 튀어요(6장).
- **레이아웃이 안 바뀌는 변경에도 capture.** delta가 0이라 무해하지만, 레이아웃이 실제로 바뀌는 경우에만 부르는 게 깔끔해요.
- **크기가 바뀌는 경우.** 위치만이 아니라 폭·높이도 변하면 `scale`까지 계산해야 해요. 이때 안의 글자도 같이 늘어나므로, 보통은 위치만 FLIP하고 크기는 즉시 바꿔요.

## 함께 쓰는 연출

- 새로 나타나는 요소(오른쪽 상세 패널)는 "이전 위치"가 없어서 FLIP 대상이 아니에요. `@keyframes` 등장 애니메이션(4장)을 **같은 시간·같은 easing**으로 걸면 한 덩어리로 움직이는 것처럼 보여요.
- 스크롤 위치를 맞춰야 하면 **FLIP의 Last를 재기 전에** 스크롤해요. 그래야 도착 지점이 정확해요.

## 라이브러리

직접 구현이 부담스러우면 아래를 고려하세요.

- **Motion(구 Framer Motion)**: `<motion.div layout />` 한 줄로 FLIP
- **View Transitions API**: `document.startViewTransition()`으로 브라우저가 화면 전체 스냅샷을 전환(최신 브라우저)
