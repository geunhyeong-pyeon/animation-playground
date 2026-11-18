# 1. transition vs animation

웹 애니메이션은 크게 두 갈래로 시작해요. **CSS transition**과 **CSS animation(@keyframes)**이에요.

## transition: "값이 바뀌면 그 사이를 채워 줘"

```css
.box {
  transform: translateX(0);
  transition: transform 300ms ease-out;
}
.box.moved {
  transform: translateX(200px);
}
```

- 시작 값과 끝 값은 **상태(클래스, style)**가 정해요. transition은 그 사이를 보간(interpolate)할 뿐이에요.
- 트리거가 필요해요. 클래스가 바뀌거나 hover 같은 상태 변화가 있어야 움직여요.
- 중간에 상태가 다시 바뀌면 **지금 위치에서** 새 목표로 자연스럽게 돌아가요. hover처럼 왔다 갔다 하는 UI에 좋아요.

## animation: "이 시나리오대로 재생해 줘"

```css
@keyframes fade-slide-in {
  from { opacity: 0; transform: translateX(80px); }
  to   { opacity: 1; transform: none; }
}
.panel {
  animation: fade-slide-in 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
```

- 요소가 그 클래스를 갖는 순간 **스스로 재생**돼요. 트리거가 필요 없어요.
- 중간 단계(`50%`)를 여러 개 둘 수 있고, 반복(`infinite`), 방향(`alternate`)도 정할 수 있어요.
- "처음 나타날 때" 효과(등장 애니메이션)에 딱 맞아요. 마운트되는 순간 재생되니까요.

## 언제 무엇을?

| 상황 | 추천 |
|---|---|
| hover, 토글, 열림/닫힘처럼 두 상태를 오감 | transition |
| 새로 나타나는 요소의 등장 | animation (@keyframes) |
| 반복 효과 (로딩 점, 깜빡임) | animation |
| 레이아웃 자체가 바뀜 (3열 → 1열) | 둘 다 안 됨 → **FLIP** (7장) |

## 애니메이션되지 않는 속성

`display`, `flex-direction`, `grid-template-columns`(일부 브라우저 제외) 같은 값은 "중간 값"이 없어서 보간할 수 없어요. 바뀌는 순간 **뚝** 바뀌어요. 이게 FLIP이 필요한 이유예요.

## 단축 속성 읽는 법

```css
transition: transform 300ms ease-out 50ms;
/*          속성      시간   easing   지연 */

animation: fade-slide-in 420ms ease-out 0ms 1 normal both;
/*         이름          시간  easing   지연 횟수 방향  fill-mode */
```

- `fill-mode: both`: 시작 전엔 `from` 상태로 대기하고, 끝난 뒤엔 `to` 상태를 유지해요. 등장 애니메이션에서 첫 프레임 깜빡임을 막아 줘요.
