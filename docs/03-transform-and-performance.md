# 3. transform과 성능

## 브라우저가 화면을 그리는 3단계

1. **Layout**: 각 요소의 위치와 크기를 계산
2. **Paint**: 글자, 색, 테두리를 픽셀로 칠함
3. **Composite**: 칠해 둔 레이어들을 합쳐 화면에 보냄

애니메이션 중에 바꾸는 속성이 **몇 번째 단계부터 다시 하게 만드는지**가 성능을 결정해요.

| 바꾸는 속성 | 다시 하는 단계 | 비용 |
|---|---|---|
| `width`, `height`, `top`, `left`, `margin`, `padding` | Layout → Paint → Composite | 비쌈. 주변 요소까지 다시 계산 |
| `color`, `background`, `box-shadow` | Paint → Composite | 중간 |
| `transform`, `opacity` | Composite만 | 쌈. GPU가 처리 |

## 그래서 애니메이션은 transform과 opacity로

```css
/* ❌ 매 프레임 레이아웃을 다시 계산 */
.box { transition: left 300ms; }
.box.moved { left: 200px; }

/* ✅ 그림만 옮김 */
.box { transition: transform 300ms; }
.box.moved { transform: translateX(200px); }
```

- `transform`은 **레이아웃상 자리는 그대로** 두고 그려진 모습만 옮겨요. 그래서 옆 요소가 밀리지 않아요.
- 크기 변화도 `width` 대신 `transform: scale()`로 흉내 낼 수 있어요(단, 글자도 같이 늘어나요).

## will-change

```css
.card { will-change: transform; }
```

- 브라우저에게 "곧 transform이 바뀔 거야"라고 미리 알려 레이어를 준비시켜요.
- 남발하면 메모리를 많이 써요. 실제로 버벅일 때만, 애니메이션하는 요소에만 쓰세요.

## 확인하는 방법

Chrome DevTools → Performance 탭에서 녹화하면, 보라색(Layout)이 매 프레임 생기는지 볼 수 있어요. `transform` 애니메이션은 보라색이 거의 없어야 정상이에요.
