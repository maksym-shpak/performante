# 🚀 Performante

**Performante** is a high-performance prototype demonstrating how to handle real-time financial data in React without compromising UI responsiveness.

Each widget is a self-contained unit:

- A unique Web Worker per widget
- Dedicated SharedArrayBuffer
- Server-pushed data stream
- SMA computed via WebAssembly
- Live-synced with React components

---

## 🎯 Use Case

This prototype was developed as a **proof of concept (POC)** for a fintect client.  
Their original web app was receiving streaming series of financial data and computing live metrics like liquidity/gamma exposure heatmaps directly in the UI thread, which led to visible lags under load.

Designed Rust-based computation engine compiled to WebAssembly, offloaded all calculations to Web Workers, and pushed clean results back to the React state via SharedArrayBuffer.  
As a result:

- UI stayed smooth even with **1000+ real-time widgets**
- React renders were minimal
- Data throughput scaled linearly

---

## ⚙️ Architecture Overview

```plaintext
[ Server Push ] → [ Web Worker ] → [ WASM HEATMAP Engine (Rust) ]
                                                 ↓
                                        [ SharedArrayBuffer ]
                                                 ↓
                                         [ React Widget UI ]
```

---

## 📦 Tech Stack

- 🧵 **Web Workers** – parallelism per widget
- 🧬 **WebAssembly** – ultra-fast numeric computation (heatmaps)
- 🪢 **SharedArrayBuffer** – memory-level sync with React
- 🦀 **Rust → WASM (.wat)** – handwritten `.wat` module compiled to `.wasm`

---

## 🧪 Performance Insights

| Metric                   | JS Only     | WASM + SAB        |
| ------------------------ | ----------- | ----------------- |
| SMA Calc Time (per tick) | ~0.15ms     | ~0.02ms           |
| UI Responsiveness        | Drops >300  | Smooth up to 1000 |
| Memory per Widget        | ~4KB (GCed) | 24 bytes + Worker |
| FPS @ 1000 Widgets       | <20 FPS     | ~55–60 FPS        |
| Thread Offloading        | ❌          | ✅                |

---

## 📁 Folder Structure

```
├── public/
│   └── sma.wasm          # WASM binary module compiled from .wat
├── src/
│   ├── components/
│   │   └── TickerWidget.tsx
│   ├── ticker.worker.ts  # Web Worker logic
│   ├── App.tsx
│   └── main.tsx
```

---

## 🛠 To Run

```bash
npm install
npm run dev
```

Make sure to place `sma.wasm` in the `public/` folder.

---

## 🙌 Credits

Crafted as a performance POC to demonstrate scalable frontend architecture for real-time data apps.  
If you'd like help optimizing your UI + compute pipeline — I'm happy to assist!
