import { useState } from "react";
import { DemoFrame } from "../components/DemoFrame";

const ROWS = ["Context Recall", "Answer Relevancy", "Faithfulness"];

export const KeyframesDemo = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [blinkKey, setBlinkKey] = useState(0);
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);

  const highlight = (row: string) => {
    setHighlightedRow(row);
    setBlinkKey(key => key + 1);
  };

  return (
    <>
      <DemoFrame title="등장: fade + slide" description="조건부 렌더로 붙는 순간 @keyframes가 재생됩니다. 닫힐 때는 즉시 사라져요(퇴장 애니메이션 없음).">
        <div className="panel-stage">
          {isPanelOpen && <div className="slide-panel">오른쪽에서 들어온 패널</div>}
        </div>
        <button onClick={() => setIsPanelOpen(value => !value)}>{isPanelOpen ? "닫기" : "열기"}</button>
      </DemoFrame>
      <DemoFrame title="강조: 2번 깜빡임" description="같은 행을 다시 눌러도 key를 바꿔 처음부터 재생합니다.">
        <div className="rows">
          {ROWS.map(row => (
            <button
              key={row === highlightedRow ? `${row}-${blinkKey}` : row}
              className={`row ${row === highlightedRow ? "is-highlighted" : ""}`}
              onClick={() => highlight(row)}
            >
              {row}
            </button>
          ))}
        </div>
      </DemoFrame>
      <DemoFrame title="반복 + stagger: 로딩 점" description="같은 애니메이션에 delay만 다르게 주면 순서대로 움직입니다.">
        <div className="dots" aria-label="loading">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </DemoFrame>
    </>
  );
};
