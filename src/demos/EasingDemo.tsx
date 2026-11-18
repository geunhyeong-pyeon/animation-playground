import { useState } from "react";
import { DemoFrame } from "../components/DemoFrame";

type Bezier = [number, number, number, number];

const PRESETS: { name: string; value: Bezier }[] = [
  { name: "linear", value: [0, 0, 1, 1] },
  { name: "ease", value: [0.25, 0.1, 0.25, 1] },
  { name: "ease-in", value: [0.42, 0, 1, 1] },
  { name: "ease-out", value: [0, 0, 0.58, 1] },
  { name: "ease-in-out", value: [0.42, 0, 0.58, 1] },
  { name: "snappy out (0.2, 0.8, 0.2, 1)", value: [0.2, 0.8, 0.2, 1] },
  { name: "overshoot", value: [0.34, 1.56, 0.64, 1] },
];

const toCss = ([x1, y1, x2, y2]: Bezier) => `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;

const SIZE = 200;
const PAD = 30;
const toPoint = (x: number, y: number) => `${PAD + x * SIZE},${PAD + (1 - y) * SIZE}`;

const CurveGraph = ({ value }: { value: Bezier }) => {
  const [x1, y1, x2, y2] = value;
  return (
    <svg className="curve" viewBox={`0 0 ${SIZE + PAD * 2} ${SIZE + PAD * 2}`}>
      <rect x={PAD} y={PAD} width={SIZE} height={SIZE} className="curve-frame" />
      <line className="curve-handle" x1={PAD} y1={PAD + SIZE} x2={PAD + x1 * SIZE} y2={PAD + (1 - y1) * SIZE} />
      <line className="curve-handle" x1={PAD + SIZE} y1={PAD} x2={PAD + x2 * SIZE} y2={PAD + (1 - y2) * SIZE} />
      <path className="curve-path" d={`M${toPoint(0, 0)} C${toPoint(x1, y1)} ${toPoint(x2, y2)} ${toPoint(1, 1)}`} />
      <circle className="curve-dot" cx={PAD + x1 * SIZE} cy={PAD + (1 - y1) * SIZE} r={5} />
      <circle className="curve-dot" cx={PAD + x2 * SIZE} cy={PAD + (1 - y2) * SIZE} r={5} />
      <text x={PAD} y={SIZE + PAD * 2 - 6} className="curve-label">시간 →</text>
      <text x={4} y={PAD - 10} className="curve-label">진행 ↑</text>
    </svg>
  );
};

export const EasingDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [durationMs, setDurationMs] = useState(1200);
  const [selected, setSelected] = useState<Bezier>(PRESETS[5].value);

  return (
    <>
      <DemoFrame title="같은 시간, 다른 속도" description="모든 공은 같은 시간에 같은 거리를 갑니다. 출발과 도착의 느낌만 달라요.">
        <div className="race">
          {PRESETS.map(preset => (
            <div key={preset.name} className="race-row">
              <span className="race-name">{preset.name}</span>
              <div className="race-track">
                <div
                  className="ball small"
                  style={{
                    left: isRunning ? "calc(100% - 20px)" : "0px",
                    transition: `left ${durationMs}ms ${toCss(preset.value)}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="controls">
          <button onClick={() => setIsRunning(value => !value)}>{isRunning ? "되돌리기" : "출발"}</button>
          <label>
            시간 {durationMs}ms
            <input type="range" min={200} max={3000} step={100} value={durationMs} onChange={event => setDurationMs(Number(event.target.value))} />
          </label>
        </div>
        <p className="note">
          ※ 이 예제는 비교를 쉽게 하려고 <code>left</code>를 움직입니다. 실제 화면에서는 <code>transform</code>을 쓰세요(3장).
        </p>
      </DemoFrame>
      <DemoFrame title="cubic-bezier 곡선 읽기" description="조절점을 바꿔 보세요. 곡선이 가파른 구간이 빠르게 움직이는 구간입니다.">
        <div className="curve-layout">
          <CurveGraph value={selected} />
          <div className="curve-controls">
            <select value={selected.join(",")} onChange={event => setSelected(event.target.value.split(",").map(Number) as Bezier)}>
              {PRESETS.map(preset => (
                <option key={preset.name} value={preset.value.join(",")}>
                  {preset.name}
                </option>
              ))}
            </select>
            {(["x1", "y1", "x2", "y2"] as const).map((label, index) => (
              <label key={label}>
                {label} {selected[index]}
                <input
                  type="range"
                  min={index % 2 === 0 ? 0 : -0.5}
                  max={index % 2 === 0 ? 1 : 1.6}
                  step={0.01}
                  value={selected[index]}
                  onChange={event => {
                    const next = [...selected] as Bezier;
                    next[index] = Number(event.target.value);
                    setSelected(next);
                  }}
                />
              </label>
            ))}
            <code className="curve-code">{toCss(selected)}</code>
          </div>
        </div>
      </DemoFrame>
    </>
  );
};
