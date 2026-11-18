# 4. @keyframes 실전 패턴

## 등장: fade + slide

```css
@keyframes fade-slide-in-x {
  from {
    opacity: 0;
    transform: translateX(80px);
  }
}
.panel {
  animation: fade-slide-in-x 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
```

- `to`를 생략하면 **요소의 원래 스타일**이 끝 상태가 돼요. 시작 상태만 적으면 되니 재사용하기 좋아요.
- 요소가 DOM에 붙는 순간 재생돼요. React에서는 `{isOpen && <Panel />}`처럼 조건부로 렌더하면 열릴 때마다 재생돼요.

## 강조: 깜빡임 (2번)

```css
@keyframes highlight-blink {
  0%, 50%, 100% { background: white; }
  25%, 75%      { background: #e8f6ff; }
}
.row.highlighted {
  animation: highlight-blink 2s ease-in-out 1;
}
```

- 키프레임 % 여러 개에 같은 값을 줄 수 있어요(`0%, 50%, 100%`).
- 다시 재생하려면 클래스를 뗐다가 붙여야 해요. React에서는 `key`를 바꿔서 요소를 새로 만들면 간단해요.

## 반복: 로딩 점

```css
@keyframes dot {
  0%, 80%, 100% { opacity: 0.2; }
  40%           { opacity: 1; }
}
.dot { animation: dot 1.2s infinite; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
```

- 같은 애니메이션에 **지연(delay)만 다르게** 주면 순서대로 움직이는 효과(stagger)가 나와요.

## 퇴장 애니메이션이 어려운 이유

`{isOpen && <Panel />}`에서 `isOpen`이 false가 되면 React가 **즉시 DOM에서 지워요.** 사라지는 애니메이션을 재생할 틈이 없어요.

해결 방법:

1. 닫힘 상태를 하나 더 둬요(`closing`). 퇴장 애니메이션 클래스를 붙이고, `animationend` 이벤트에서 실제로 지워요.
2. 라이브러리(Motion의 `AnimatePresence` 등)를 써요.
3. base-ui, Radix 같은 UI 라이브러리는 `data-ending-style` 같은 속성으로 퇴장 애니메이션을 지원해요.

`prefers-reduced-motion`으로 애니메이션을 끄면 `animationend`가 오지 않으니, 그 경우엔 바로 지우도록 예외 처리해야 해요(8장).
