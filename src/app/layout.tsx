"use client"
import { ToastContainer } from "react-toastify";
// app/layout.tsx
// import type { Metadata } from "next";
import "./globals.css";
import ContextProvider from "@/context";
import { RefreshProvider } from "@/context/RefreshContext";

// export const metadata: Metadata = {
//   title: "HashKey Staking Protocol",
//   description: "Powered by HashKey"
// };

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body>
        <div className="flex w-full">
          <ContextProvider>
            <RefreshProvider>
              {children}
            </RefreshProvider>
          </ContextProvider>
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}