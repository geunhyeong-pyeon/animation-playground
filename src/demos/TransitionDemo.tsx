import { useState } from "react";
import { DemoFrame } from "../components/DemoFrame";

export const TransitionDemo = () => {
  const [isMoved, setIsMoved] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  return (
    <>
      <DemoFrame
        title="transition: 상태가 바뀌면 그 사이를 채운다"
        description="버튼을 빠르게 여러 번 눌러 보세요. 중간에서 방향을 바꿔도 지금 위치에서 자연스럽게 돌아갑니다."
      >
        <div className="track">
          <div className={`ball transition-ball ${isMoved ? "is-moved" : ""}`} />
        </div>
        <button onClick={() => setIsMoved(value => !value)}>토글 (isMoved: {String(isMoved)})</button>
      </DemoFrame>
      <DemoFrame
        title="animation: 붙는 순간 스스로 재생된다"
        description="key를 바꿔 요소를 새로 만들면 @keyframes가 처음부터 다시 재생됩니다."
      >
        <div className="track">
          <div key={replayKey} className="ball keyframes-ball" />
        </div>
        <button onClick={() => setReplayKey(key => key + 1)}>다시 재생</button>
      </DemoFrame>
      <DemoFrame
        title="애니메이션되지 않는 속성"
        description="flex-direction에 transition을 걸어도 중간 값이 없어서 순간이동합니다."
      >
        <TeleportDemo />
      </DemoFrame>
    </>
  );
};

const TeleportDemo = () => {
  const [isColumn, setIsColumn] = useState(false);
  return (
    <>
      <div className={`teleport ${isColumn ? "is-column" : ""}`}>
        {["A", "B", "C"].map(label => (
          <div key={label} className="chip">
            {label}
          </div>
        ))}
      </div>
      <button onClick={() => setIsColumn(value => !value)}>row ↔ column</button>
    </>
  );
};
