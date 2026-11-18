# 5. Web Animations API (element.animate)

CSS `@keyframes`를 **JavaScript로 즉석에서** 만들고 재생하는 브라우저 내장 API예요. 라이브러리 설치가 필요 없어요.

```ts
const animation = element.animate(
  [
    { transform: "translateX(0)", opacity: 1 },
    { transform: "translateX(200px)", opacity: 0.5 },
  ],
  {
    duration: 420,
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    fill: "forwards",
    iterations: 1,
  },
);
```

- 첫 인자: 키프레임 배열(CSS의 `from`, `to`, `%`에 해당)
- 둘째 인자: 시간, easing, 반복 등 옵션

## 언제 CSS 대신 쓰나

- **값을 실행 중에 계산해야 할 때.** 예: "이 요소가 얼마나 이동했는지"를 재서 그만큼 되돌리기(FLIP). CSS 파일에는 그 숫자를 미리 적을 수 없어요.
- **재생을 제어해야 할 때.** 일시정지, 되감기, 속도 변경, 끝난 시점 알기 등이 필요할 때요.

## 제어 메서드

```ts
animation.pause();
animation.play();
animation.reverse();       // 지금 위치에서 거꾸로
animation.playbackRate = 2; // 2배속
animation.cancel();        // 효과 제거, 원래 스타일로
await animation.finished;  // 끝날 때까지 기다리기 (Promise)
```

## style을 직접 바꾸는 방식과의 차이

```ts
// 직접 style을 바꾸는 방식: 정리할 게 많음
el.style.transition = "none";
el.style.transform = `translate(${dx}px, ${dy}px)`;
el.getBoundingClientRect(); // 강제로 레이아웃 반영
el.style.transition = "transform 420ms";
el.style.transform = "";
el.addEventListener("transitionend", () => (el.style.transition = ""), { once: true });

// element.animate: 끝나면 효과가 자동으로 사라짐
el.animate(
  [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
  { duration: 420 },
);
```

`fill`을 지정하지 않으면(기본 `none`) 애니메이션이 끝난 뒤 효과가 사라지고 원래 CSS가 적용돼요. FLIP처럼 "원래 자리로 돌아오는" 애니메이션엔 이게 딱 맞아요.
