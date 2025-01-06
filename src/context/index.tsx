// context/index.tsx
'use client'

import { projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import { createConfig, WagmiProvider, http } from 'wagmi'
import { getDefaultConfig, ConnectKitProvider } from 'connectkit';
// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// 自定义网络配置
export const hashKeyChainTestnet = {
  id: 133,
  name: 'HashKey Chain Testnet',
  rpcUrls: {
    default: {
      http: ['https://hashkeychain-testnet.alt.technology'],
    },
  },
  nativeCurrency: {
    name: 'HSK',
    symbol: 'HSK',
    decimals: 18,
  },
}

// 主网配置
export const hashKeyChainMainnet = {
  id: 177,
  name: 'HashKey Chain',
  rpcUrls: {
    default: {
      http: ['https://mainnet.hsk.xyz'],
    },
  },
  nativeCurrency: {
    name: 'HSK',
    symbol: 'HSK',
    decimals: 18,
  },
  explorer: 'https://explorer.hsk.xyz',
}

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [hashKeyChainTestnet],
    transports: {
      // RPC URL for each chain
      [hashKeyChainMainnet.id]: http(
        hashKeyChainMainnet.rpcUrls.default.http[0]
      ),
      [hashKeyChainTestnet.id]: http(
        hashKeyChainTestnet.rpcUrls.default.http[0]
      ),
    },
    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    // Required App Info
    appName: "HashKye Staking",

    // Optional App Info
    appDescription: "HashKey staking",
  }),
);



function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider