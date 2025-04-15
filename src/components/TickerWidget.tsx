import { useEffect, useState } from "react";

type Props = {
  ticker: string;
  buffer: SharedArrayBuffer;
};

export const TickerWidget = ({ ticker, buffer }: Props) => {
  const [bid, setBid] = useState(0);
  const [ask, setAsk] = useState(0);
  const [sma, setSma] = useState(0);

  useEffect(() => {
    const view = new Float64Array(buffer);
    const interval = setInterval(() => {
      setBid(view[0]);
      setAsk(view[1]);
      setSma(view[2]);
    }, 100);

    return () => clearInterval(interval);
  }, [buffer]);

  return (
    <div
      style={{ border: "1px solid #ddd", padding: "1rem", margin: "0.5rem" }}
    >
      <h3>{ticker}</h3>
      <div>Bid: {bid.toFixed(2)}</div>
      <div>Ask: {ask.toFixed(2)}</div>
      <div>SMA: {sma.toFixed(2)}</div>
    </div>
  );
};
