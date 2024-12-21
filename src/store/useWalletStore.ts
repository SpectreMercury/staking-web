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
  let initialAddress = '';
  let initialBalance = '';

  if (typeof window !== 'undefined') { // 确保在客户端环境中
    initialAddress = localStorage.getItem('walletAddress') || '';
    initialBalance = localStorage.getItem('walletBalance') || '';
  }

  return {
    address: initialAddress,
    balance: initialBalance,
    setAddress: (address) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('walletAddress', address);
      }
      set({ address });
    },
    setBalance: (balance) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('walletBalance', balance);
      }
      set({ balance });
    },
    disconnect: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('walletBalance');
      }
      set({ address: '', balance: '' });
    },
  };
}); 