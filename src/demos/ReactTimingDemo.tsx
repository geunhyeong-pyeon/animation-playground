import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DemoFrame } from "../components/DemoFrame";
import { FLIP_EASING } from "../hooks/useFlip";

type EffectHook = typeof useEffect;

const createMover = (useTimingEffect: EffectHook) => {
  const Mover = ({ label }: { label: string }) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const rectBeforeRef = useRef<DOMRect | null>(null);
    const [isRight, setIsRight] = useState(false);

    useTimingEffect(() => {
      const before = rectBeforeRef.current;
      const box = boxRef.current;
      rectBeforeRef.current = null;
      if (before == null || box == null) return;
      const after = box.getBoundingClientRect();
      box.animate([{ transform: `translateX(${before.left - after.left}px)` }, { transform: "none" }], {
        duration: 700,
        easing: FLIP_EASING,
      });
    }, [isRight]);

    return (
      <div className="timing-case">
        <span className="compare-label">{label}</span>
        <div className={`timing-track ${isRight ? "is-right" : ""}`}>
          <div ref={boxRef} className="square" />
        </div>
        <button
          onClick={() => {
            rectBeforeRef.current = boxRef.current?.getBoundingClientRect() ?? null;
            setIsRight(value => !value);
          }}
        >
          이동
        </button>
      </div>
    );
  };
  return Mover;
};

const MoverWithEffect = createMover(useEffect);
const MoverWithLayoutEffect = createMover(useLayoutEffect);

export const ReactTimingDemo = () => (
  <DemoFrame
    title="useEffect vs useLayoutEffect로 FLIP"
    description="useEffect 쪽은 새 위치가 한 프레임 먼저 그려졌다가 되돌아가서 '툭' 튀는 깜빡임이 보일 수 있습니다. useLayoutEffect는 그리기 전에 되돌려서 매끄럽습니다. (기기가 빠르면 차이가 작으니 여러 번 눌러 보세요)"
  >
    <MoverWithEffect label="useEffect" />
    <MoverWithLayoutEffect label="useLayoutEffect" />
  </DemoFrame>
);
