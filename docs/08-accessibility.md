# 8. 접근성: prefers-reduced-motion

어지럼증이나 전정 장애가 있는 사용자는 큰 움직임에 불편을 느껴요. OS 설정에서 **"동작 줄이기"**를 켤 수 있어요.

- macOS: 시스템 설정 → 손쉬운 사용 → 디스플레이 → 동작 줄이기
- Windows: 설정 → 접근성 → 시각 효과 → 애니메이션 효과 끄기
- Chrome DevTools: Rendering 탭 → Emulate CSS media feature `prefers-reduced-motion`

## CSS

```css
@media (prefers-reduced-motion: reduce) {
  .panel { animation: none; }
  .box   { transition: none; }
}
```

Tailwind에서는 `motion-reduce:transition-none`, `motion-safe:animate-...` 변형을 써요.

## JavaScript: window.matchMedia

```ts
window.matchMedia("(prefers-reduced-motion: reduce)").matches
```

CSS의 미디어 쿼리를 **JavaScript에서 물어보는** 코드예요. 결과는 `true` / `false`예요.

| 부분 | 뜻 |
|---|---|
| `window.matchMedia(...)` | 괄호 안의 미디어 쿼리를 브라우저에 물어봐요. `MediaQueryList` 객체를 돌려줘요 |
| `"(prefers-reduced-motion: reduce)"` | CSS `@media`에 쓰는 것과 똑같은 조건이에요. "사용자가 움직임을 줄여 달라고 했나?" |
| `.matches` | 그 조건이 **지금** 맞는지 `true` / `false` |

CSS로 쓰면 이것과 같은 질문이에요.

```css
@media (prefers-reduced-motion: reduce) {
  /* 여기 스타일이 적용되는 상황이면 → matches === true */
}
```

`(max-width: 720px)`, `(prefers-color-scheme: dark)`처럼 CSS 미디어 쿼리라면 무엇이든 같은 방식으로 물어볼 수 있어요.

### 왜 JS에서도 확인하나

CSS 애니메이션(`@keyframes`, `transition`)은 위의 `@media` 블록으로 끌 수 있어요. 하지만 `element.animate()`(5장)나 FLIP(7장)처럼 **JS로 실행하는 애니메이션은 CSS로 막을 수 없어요.** 그래서 실행 직전에 직접 물어보고 건너뛰어요.

```ts
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
// ↑ 동작 줄이기를 켰으면 애니메이션 없이 바로 새 레이아웃을 보여주고 끝
```

이 사용자에게는 카드가 미끄러지지 않고 **바로** 새 자리에 놓여요. 기능은 그대로고 움직임만 빠져요.

### 한 번 묻기 vs 계속 지켜보기

`.matches`는 **부른 그 순간**의 값이에요.

- 애니메이션을 시작할 때마다 한 번 물어보는 용도라면 `.matches`로 충분해요.
- 화면에 설정 상태를 계속 표시하거나, 설정이 바뀌는 즉시 반응해야 하면 `change` 이벤트를 구독해요.

```ts
const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
mediaQuery.addEventListener("change", () => {
  console.log(mediaQuery.matches); // 설정을 바꾸는 순간 호출
});
```

React에서는 `useSyncExternalStore`로 감싸면 설정이 바뀔 때 자동으로 리렌더돼요. 이 저장소의 [`src/hooks/usePrefersReducedMotion.ts`](../src/hooks/usePrefersReducedMotion.ts)가 이 방식이고, 아래 예제가 그 훅으로 값을 실시간 표시해요.

```ts
const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
};

export const usePrefersReducedMotion = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, // 지금 값
    () => false, // 서버 렌더링 때 값 (window가 없음)
  );
```

### 직접 확인해 보기

1. Chrome DevTools에서 `⌘ + Shift + P` → "Rendering"을 입력해 Rendering 탭을 열어요.
2. **Emulate CSS media feature prefers-reduced-motion**에서 `reduce`를 골라요.
3. 콘솔에 `window.matchMedia("(prefers-reduced-motion: reduce)").matches`를 치면 `true`가 나와요.
4. 그 상태로 7장 FLIP 예제를 눌러 보면 애니메이션 없이 바로 바뀌어요.

## 원칙

- **완전히 없애기보다 줄이기.** 큰 이동은 끄되, 짧은 opacity 변화 정도는 남겨도 괜찮아요.
- **정보는 움직임 없이도 전달되게.** "강조 깜빡임"을 끄면 테두리나 배경색으로 강조가 남아 있어야 해요.
- **animationend에 의존하는 로직 주의.** 애니메이션을 끄면 이벤트가 오지 않아요. 퇴장 후 DOM을 지우는 코드는 이 경우 바로 지우도록 분기해야 해요.
