import { useState } from "react";
import { TickerWidget } from "./components/TickerWidget";
import TickerWorker from "./ticker.worker?worker";

type WidgetConfig = {
  id: number;
  ticker: string;
  buffer: SharedArrayBuffer;
};

function randomTicker() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export default function App() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [nextId, setNextId] = useState(1);

  const create100Widgets = () => {
    for (let i = 0; i < 100; i++) {
      const id = nextId + i;
      const ticker = randomTicker();
      const buffer = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * 3);

      const worker = new TickerWorker();
      worker.postMessage({
        type: "init",
        buffer,
        ticker,
      });

      setWidgets((prev) => [...prev, { id, ticker, buffer }]);
    }

    setNextId((prev) => prev + 100);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Performante 🚀</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={create100Widgets}>💥 Add 100 widgets</button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {widgets.map(({ id, ticker, buffer }) => (
          <TickerWidget key={id} ticker={ticker} buffer={buffer} />
        ))}
      </div>
    </div>
  );
}
