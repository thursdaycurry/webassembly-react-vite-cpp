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
