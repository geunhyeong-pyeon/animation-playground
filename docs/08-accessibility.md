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

## JavaScript

```ts
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReducedMotion) return; // element.animate 건너뛰기
```

## 원칙

- **완전히 없애기보다 줄이기.** 큰 이동은 끄되, 짧은 opacity 변화 정도는 남겨도 괜찮아요.
- **정보는 움직임 없이도 전달되게.** "강조 깜빡임"을 끄면 테두리나 배경색으로 강조가 남아 있어야 해요.
- **animationend에 의존하는 로직 주의.** 애니메이션을 끄면 이벤트가 오지 않아요. 퇴장 후 DOM을 지우는 코드는 이 경우 바로 지우도록 분기해야 해요.
