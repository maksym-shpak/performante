type InitMessage = {
  type: "init";
  buffer: SharedArrayBuffer;
  ticker: string;
};

let floatView: Float64Array;
let ohlc: number[][] = [];

let sma: (ptr: number, len: number) => number;
let memory: WebAssembly.Memory;

onmessage = async (e: MessageEvent<InitMessage>) => {
  if (e.data.type === "init") {
    try {
      const response = await fetch("/sma.wasm");
      const wasmBinary = await response.arrayBuffer();

      const wasmModule = await WebAssembly.instantiate(wasmBinary, {});
      // @ts-expect-error -- we know what is it going to be
      sma = wasmModule.instance.exports.sma;
      // @ts-expect-error -- same story
      memory = wasmModule.instance.exports.memory;

      floatView = new Float64Array(e.data.buffer);
      ohlc = generateOHLC(300);

      update();

      setInterval(() => {
        updateOHLC();
        update();
      }, 10);
    } catch (err) {
      console.error("WASM init failed:", err);
    }
  }
};

function generateOHLC(count: number): number[][] {
  const arr: number[][] = [];
  let lastClose = 100 + Math.random() * 10;
  for (let i = 0; i < count; i++) {
    const open = lastClose;
    const close = open + (Math.random() - 0.5) * 2;
    const high = Math.max(open, close) + Math.random();
    const low = Math.min(open, close) - Math.random();
    lastClose = close;
    arr.push([open, high, low, close]);
  }
  return arr;
}

function updateOHLC() {
  const i = ohlc.length - 1;
  const [o] = ohlc[i];
  const close = o + (Math.random() - 0.5) * 2;
  const high = Math.max(o, close) + Math.random();
  const low = Math.min(o, close) - Math.random();
  ohlc[i] = [o, high, low, close];
}

function update() {
  const closes = ohlc.map(([, , , c]) => c);

  const ptr = 0;
  const wasmView = new Float64Array(memory.buffer, ptr, closes.length);
  wasmView.set(closes);

  const result = sma(ptr, closes.length);

  const lastClose = closes[closes.length - 1];
  const bid = lastClose - 0.05;
  const ask = lastClose + 0.05;

  floatView[0] = bid;
  floatView[1] = ask;
  floatView[2] = result;
}
