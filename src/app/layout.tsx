"use client"
// app/layout.tsx
// import type { Metadata } from "next";
import "./globals.css";
import ContextProvider from "@/context";
import { useEffect } from 'react';
import { useWalletStore } from '@/store/useWalletStore';

// export const metadata: Metadata = {
//   title: "HashKey Staking Protocol",
//   description: "Powered by HashKey"
// };

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { setAddress, setBalance } = useWalletStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAddress = localStorage.getItem('walletAddress');
      const storedBalance = localStorage.getItem('walletBalance');
      if (storedAddress) setAddress(storedAddress);
      if (storedBalance) setBalance(storedBalance);
    }
  }, [setAddress, setBalance]);

  return (
    <html lang="en">
      <body>
        <div className="flex w-full">
          <ContextProvider>{children}</ContextProvider>
        </div>
      </body>
    </html>
  );
}