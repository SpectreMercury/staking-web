"use client"

import React, { useState, useEffect } from 'react';
import WalletModal from './WalletModal';
import { useWalletStore } from '@/store/useWalletStore';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address, balance, setAddress, setBalance, disconnect } = useWalletStore();

  // 获取钱包余额
  const getBalance = async (address: string) => {
    if (window.ethereum) {
      try {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        } as { method: string; params: [string, string] });
        const ethBalance = (parseInt(balance as string) / 1e18).toFixed(4);
        setBalance(ethBalance);
      } catch (error) {
        console.error('Error getting balance:', error);
      }
    }
  };

  const handleConnectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
        setAddress(accounts[0]);
        await getBalance(accounts[0]);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('MetaMask is not installed!');
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  // 监听账户变化
  useEffect(() => {
    if (window.ethereum) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.ethereum as any).on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          getBalance(accounts[0]);
        } else {
          handleDisconnect();
        }
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <header>
      <div className="container flex h-16 items-center justify-end px-4">
        
        <Button
          variant={address ? "outline" : "default"}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Wallet className="h-4 w-4" />
          {address ? (
            <span className="font-medium">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </span>
          ) : (
            "Connect Wallet"
          )}
        </Button>

        <WalletModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConnectMetaMask={handleConnectMetaMask}
          address={address}
          balance={balance}
          onDisconnect={handleDisconnect}
        />
      </div>
    </header>
  );
}