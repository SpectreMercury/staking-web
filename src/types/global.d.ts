// src/types/global.d.ts
interface Ethereum {
  on: (event: string, handler: (args: unknown) => void) => void;
  removeListener: (event: string, handler: (args: unknown) => void) => void;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

interface Window {
  ethereum?: Ethereum;
}