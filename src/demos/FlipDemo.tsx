import { useEffect, useState } from "react";
import { DemoFrame } from "../components/DemoFrame";
import { useFlip } from "../hooks/useFlip";

const COLUMNS = [
  { id: "performance", title: "Performance", tone: "blue", items: ["Retrieval", "Answer Quality", "Routing"] },
  { id: "policy", title: "Policy & UX", tone: "amber", items: ["Tone", "Guideline"] },
  { id: "safety", title: "Safety", tone: "red", items: ["Toxicity", "PII Leak", "Jailbreak", "Bias"] },
];

const BoardDemo = () => {
  const [isFlipEnabled, setIsFlipEnabled] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const isSelected = selectedItem != null;
  const { register, capture } = useFlip(isSelected, { isEnabled: isFlipEnabled });

  const select = (item: string | null) => {
    const nextItem = item === selectedItem ? null : item;
    if ((nextItem != null) !== isSelected) capture();
    setSelectedItem(nextItem);
  };

  useEffect(() => {
    if (!isSelected) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") select(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <DemoFrame
      title="3열 보드 → 왼쪽 목록 + 오른쪽 상세"
      description="항목을 눌러 보세요. 같은 항목을 다시 누르거나 Esc로 닫습니다. FLIP을 끄고 켜서 차이를 비교해 보세요."
    >
      <label className="toggle">
        <input type="checkbox" checked={isFlipEnabled} onChange={event => setIsFlipEnabled(event.target.checked)} />
        FLIP 사용
      </label>
      <div className={`board ${isSelected ? "has-selection" : ""}`}>
        <div className="board-columns">
          {COLUMNS.map(column => (
            <div key={column.id} ref={register(column.id)} className={`board-column tone-${column.tone}`}>
              <h4>{column.title}</h4>
              {column.items.map(item => (
                <button
                  key={item}
                  className={`board-item ${item === selectedItem ? "is-selected" : ""}`}
                  aria-pressed={item === selectedItem}
                  onClick={() => select(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
        {isSelected && (
          <div className={`board-detail ${isFlipEnabled ? "slide-panel-motion" : ""}`}>
            <p className="eyebrow">Detail</p>
            <h4>{selectedItem}</h4>
            <p>새로 생기는 요소는 "이전 위치"가 없어서 FLIP 대신 @keyframes 등장 애니메이션을 같은 시간 · easing으로 겁니다.</p>
          </div>
        )}
      </div>
    </DemoFrame>
  );
};

const INITIAL_CARDS = ["1", "2", "3", "4", "5", "6", "7", "8"];

const shuffle = (list: string[]) => {
  const next = [...list];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
};

const ShuffleDemo = () => {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const { register, capture } = useFlip(cards, { isEnabled: true, durationMs: 600 });

  return (
    <DemoFrame title="가장 단순한 FLIP: 순서 섞기" description="DOM 순서만 바뀌었는데 각 카드가 새 자리로 미끄러집니다.">
      <div className="shuffle-grid">
        {cards.map(card => (
          <div key={card} ref={register(card)} className="shuffle-card">
            {card}
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          capture();
          setCards(shuffle);
        }}
      >
        섞기
      </button>
    </DemoFrame>
  );
};

export const FlipDemo = () => (
  <>
    <ShuffleDemo />
    <BoardDemo />
  </>
);
