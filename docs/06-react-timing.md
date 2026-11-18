# 6. React와 타이밍: useEffect vs useLayoutEffect

애니메이션에서 DOM을 재고 고치려면 **"언제"** 하느냐가 중요해요.

## React가 화면을 바꾸는 순서

```
setState
  → 렌더 (JSX 계산, 아직 DOM 안 바뀜)
  → DOM 반영 (commit)
  → useLayoutEffect 실행     ← DOM은 새 모습, 화면은 아직 옛 모습
  → 브라우저가 화면에 그림 (paint)
  → useEffect 실행           ← 사용자가 이미 새 화면을 봤음
```

## 둘의 차이

| | useLayoutEffect | useEffect |
|---|---|---|
| 실행 시점 | paint **전** | paint **후** |
| 화면을 막나 | 막음 (오래 걸리면 버벅임) | 안 막음 |
| 쓰임 | DOM 크기·위치 측정 후 바로 보정 | 데이터 요청, 구독, 로그 |

## 왜 애니메이션엔 useLayoutEffect인가

"새 레이아웃의 위치를 재서, 사용자가 보기 전에 원래 자리로 되돌려 놓기"(FLIP)를 하려면 **paint 전**이어야 해요.

`useEffect`로 하면 이런 순서가 돼요.

1. 새 레이아웃이 한 프레임 그려짐 (요소가 새 자리에 보임)
2. effect에서 원래 자리로 되돌림 (요소가 옛 자리로 튐)
3. 애니메이션 시작

사용자 눈에는 **깜빡임(flicker)**으로 보여요. 이 사이트의 React 타이밍 예제에서 두 방식을 나란히 비교할 수 있어요.

## useRef: 렌더 사이에 값 들고 있기

```ts
const rectBeforeRef = useRef<DOMRect | null>(null);

const handleClick = () => {
  rectBeforeRef.current = boxRef.current!.getBoundingClientRect(); // 바뀌기 전 위치
  setIsOpen(v => !v);
};

useLayoutEffect(() => {
  const before = rectBeforeRef.current;
  if (!before) return;
  rectBeforeRef.current = null;
  // ... 새 위치와 비교해서 애니메이션
}, [isOpen]);
```

- `useState`는 값이 바뀌면 리렌더해요. `useRef`는 리렌더 없이 값을 보관해요.
- "클릭 때 잰 위치를 다음 렌더 직후까지 들고 있기"에 딱 맞아요.
- **규칙: `ref.current`는 렌더 중에 읽거나 쓰지 않아요.** 이벤트 핸들러나 effect 안에서만 다뤄요. 렌더 중에 건드리면 React가 렌더를 버리고 다시 할 때 값이 어긋나요.

## 콜백 ref: 여러 요소의 DOM 모으기

```tsx
const elementsRef = useRef(new Map<string, HTMLDivElement>());

const setElement = (key: string) => (element: HTMLDivElement | null) => {
  if (!element) return;
  elementsRef.current.set(key, element);
  return () => elementsRef.current.delete(key); // React 19: ref cleanup
};

{items.map(item => <div key={item.id} ref={setElement(item.id)} />)}
```

`ref`에 함수를 넘기면 요소가 붙을 때 DOM을 받아요. 목록처럼 요소가 여러 개일 때 Map에 모아 두면 돼요.
