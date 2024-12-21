// src/types/global.d.ts
interface Ethereum {
  removeListener(arg0: string, arg1: () => void): unknown;
  request: (args: { method: string }) => Promise<unknown>;
}

interface Window {
  ethereum?: Ethereum;
}