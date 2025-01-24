import { WagmiProvider, createConfig } from "wagmi";
import { http } from 'wagmi'
import { defineChain } from 'viem'
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const hskChain = defineChain({
  id: 133,
  name: 'HSK TestNet',
  network: 'hsk-testnet',
  nativeCurrency: {
    name: 'HSK',
    symbol: 'HSK',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://hashkeychain-testnet.alt.technology'],
    },
    public: {
      http: ['https://hashkeychain-testnet.alt.technology'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HSK Explorer',
      url: 'https://hashkeychain-testnet-explorer.alt.technology/',
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 8059844
    }
  },
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export const config = createConfig({
  chains: [hskChain],
  transports: {
    [hskChain.id]: http(),
  },
  syncConnectedChain: true,
  ssr: true,
})

function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider