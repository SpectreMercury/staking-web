"use client"

import { create } from 'zustand'

interface WalletState {
  address: string
  balance: string
  setAddress: (address: string) => void
  setBalance: (balance: string) => void
  disconnect: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  address: '',
  balance: '',
  setAddress: (address) => set({ address }),
  setBalance: (balance) => set({ balance }),
  disconnect: () => set({ address: '', balance: '' }),
})); 