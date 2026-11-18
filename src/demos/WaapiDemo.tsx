import { useRef, useState } from "react";
import { DemoFrame } from "../components/DemoFrame";
import { FLIP_EASING } from "../hooks/useFlip";

export const WaapiDemo = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const [status, setStatus] = useState("idle");
  const [playbackRate, setPlaybackRate] = useState(1);

  const getAnimation = () => {
    if (animationRef.current != null) return animationRef.current;
    const box = boxRef.current;
    if (box == null) return null;
    const animation = box.animate(
      [
        { transform: "translateX(0) rotate(0)", opacity: 1 },
        { transform: "translateX(260px) rotate(180deg)", opacity: 0.4 },
      ],
      { duration: 2000, easing: FLIP_EASING, fill: "both" },
    );
    animation.pause();
    animation.onfinish = () => setStatus("finished");
    animationRef.current = animation;
    return animation;
  };

  const run = (action: (animation: Animation) => void, label: string) => {
    const animation = getAnimation();
    if (animation == null) return;
    action(animation);
    setStatus(label);
  };

  return (
    <DemoFrame title="element.animate 제어" description="같은 애니메이션 객체를 재생 · 일시정지 · 되감기 · 배속 · 취소합니다.">
      <div className="track">
        <div ref={boxRef} className="square" />
      </div>
      <div className="controls">
        <button onClick={() => run(animation => animation.play(), "running")}>play</button>
        <button onClick={() => run(animation => animation.pause(), "paused")}>pause</button>
        <button onClick={() => run(animation => animation.reverse(), "reversed")}>reverse</button>
        <button
          onClick={() => {
            animationRef.current?.cancel();
            animationRef.current = null;
            setStatus("cancelled (원래 스타일로)");
          }}
        >
          cancel
        </button>
        <label>
          playbackRate {playbackRate}x
          <input
            type="range"
            min={0.25}
            max={3}
            step={0.25}
            value={playbackRate}
            onChange={event => {
              const rate = Number(event.target.value);
              setPlaybackRate(rate);
              if (animationRef.current != null) animationRef.current.playbackRate = rate;
            }}
          />
        </label>
      </div>
      <p className="note">상태: {status}</p>
    </DemoFrame>
  );
};
