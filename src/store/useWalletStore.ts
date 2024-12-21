"use client"

import { create } from 'zustand'

interface WalletState {
  address: string
  balance: string
  setAddress: (address: string) => void
  setBalance: (balance: string) => void
  disconnect: () => void
}

export const useWalletStore = create<WalletState>((set) => {
  // 从 localStorage 加载初始状态
  const initialAddress = localStorage.getItem('walletAddress') || '';
  const initialBalance = localStorage.getItem('walletBalance') || '';

  return {
    address: initialAddress,
    balance: initialBalance,
    setAddress: (address) => {
      localStorage.setItem('walletAddress', address);
      set({ address });
    },
    setBalance: (balance) => {
      localStorage.setItem('walletBalance', balance);
      set({ balance });
    },
    disconnect: () => {
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletBalance');
      set({ address: '', balance: '' });
    },
  };
}); 