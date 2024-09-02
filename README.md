# WebAssembly with C++ and React(Vite)

> This guide provides instructions for compiling C++ code to WebAssembly using Emscripten and integrating it into a React project(Vite).

! DO NOT CLONE THIS REPO. THIS IS ONLY FOR DOCUMENTATION PURPOSE !

Correct Compilation Approach for Emscripten
Verify C++ Code
Ensure your C++ code is written correctly for exporting functions to WebAssembly. Here’s a simple example:

## Step-by-Step Guide

create cpp file

```C++
// example.cpp
extern "C" {
    int add(int a, int b) {
        return a + b;
    }
    int sub(int a, int b) {
        return a - b;
    }
}
```

run bash

```
$ source ~/emsdk/emsdk_env.sh
```

use compilation command

```
$ emcc example.cpp -o example.js -s EXPORTED_FUNCTIONS='["_add", "_sub"]' -s EXPORTED_RUNTIME_METHODS='["cwrap"]' -s WASM=1
```

After this command, `.js` and `.wasm` files will be generated in the path you set above.

Details:

- `-s EXPORTED_FUNCTIONS='["_add"]'` : to specify the add function which should be exported
- `-s EXPORTED_RUNTIME_METHODS='["cwrap"]'` : to include cwrap function, which helps calling WebAssembly funcs from JS
- `-s WASM=1` : to set the output in WebAssembly format

Create React project with Vite

```
$ npm create vite@latest ./
$ npm i
```

```ts
// src/loadWasm.ts
interface WasmExports {
  add(a: number, b: number): number;
  sub(a: number, b: number): number;
}

export const loadWasm = async (): Promise<WasmExports> => {
  // Load the WebAssembly file
  // const response = await fetch("/wasm/example.wasm");
  const response = await fetch("../example.wasm");
  const wasmBuffer = await response.arrayBuffer();

  // Instantiate the WebAssembly module
  const wasmModule = await WebAssembly.instantiate(wasmBuffer);
  return wasmModule.instance.exports as unknown as WasmExports;
};
```

You can add multiple functions types in interface and also change wasm file name.

```ts
// src/App.tsx

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
```

Start React project

```
$ npm run dev
```

## Output

![result](public/result-calculation.png)

go to React site and check if the results of calculation are displayed like this.
