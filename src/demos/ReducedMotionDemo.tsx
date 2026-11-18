import { useState } from "react";
import { DemoFrame } from "../components/DemoFrame";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export const ReducedMotionDemo = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DemoFrame
      title="지금 내 설정"
      description="OS의 '동작 줄이기'를 켜거나 DevTools Rendering 탭에서 에뮬레이트하면 값이 바로 바뀝니다."
    >
      <p className={`status-pill ${prefersReducedMotion ? "is-on" : ""}`}>
        prefers-reduced-motion: {prefersReducedMotion ? "reduce (애니메이션 줄임)" : "no-preference"}
      </p>
      <div className="panel-stage">
        {isOpen && <div className="slide-panel reduced-aware">reduce면 바로 나타나요</div>}
      </div>
      <button onClick={() => setIsOpen(value => !value)}>{isOpen ? "닫기" : "열기"}</button>
    </DemoFrame>
  );
};
