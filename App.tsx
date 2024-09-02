import React, { useEffect, useState } from "react";
import { loadWasm } from "./loadWasm";

const App: React.FC = () => {
  const [result, setResult] = useState<number | null>(null);
  const [subResult, setSubResult] = useState<number | null>(null);

  useEffect(() => {
    const initWasm = async () => {
      const wasm = await loadWasm();
      const sum = wasm.add(1, 2);
      setResult(sum);
      const sub = wasm.sub(3, 10);
      setSubResult(sub);
    };

    initWasm();
  }, []);

  return (
    <div>
      <h1>WebAssembly with C++</h1>
      <p>Result: {result}</p>
      <p>3 - 10 = {subResult}</p>
    </div>
  );
};

export default App;
