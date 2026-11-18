import { useState } from "react";
import { DemoFrame } from "../components/DemoFrame";

export const TransformDemo = () => {
  const [isGrown, setIsGrown] = useState(false);

  return (
    <DemoFrame
      title="width vs transform: scale"
      description="위는 width를 바꿔서 옆 칸이 매 프레임 밀려납니다(Layout 재계산). 아래는 scaleX라 레이아웃이 그대로고 옆 칸이 움직이지 않습니다."
    >
      <div className="compare-row">
        <span className="compare-label">width</span>
        <div className={`grow-by-width ${isGrown ? "is-grown" : ""}`} />
        <div className="neighbor">옆 칸</div>
      </div>
      <div className="compare-row">
        <span className="compare-label">transform</span>
        <div className={`grow-by-scale ${isGrown ? "is-grown" : ""}`} />
        <div className="neighbor">옆 칸</div>
      </div>
      <button onClick={() => setIsGrown(value => !value)}>늘리기 / 줄이기</button>
    </DemoFrame>
  );
};
