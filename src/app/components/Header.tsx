"use client"

import React, { useEffect } from 'react';
import { ConnectKitButton } from "connectkit";
import { useAccount } from 'wagmi';



// const TARGET_NETWORK = {
//   chainId: '0x85', // 133 in hexadecimal
//   chainName: 'HashKey Chain Testnet',
//   rpcUrls: ['https://hashkeychain-testnet.alt.technology'],
//   nativeCurrency: {
//     name: 'HSK',
//     symbol: 'HSK',
//     decimals: 18,
//   },
//   blockExplorerUrls: ['https://hashkeychain-testnet-explorer.alt.technology'],
// };

export default function Header() {
  const { address } = useAccount();

  // 添加调试日志
  useEffect(() => {
    console.log('Current address:', address);
  }, [address]);

  // const getBalance = async (address: string) => {
  //   if (window.ethereum) {
  //     try {
  //       const balance = await window.ethereum.request({
  //         method: 'eth_getBalance',
  //         params: [address, 'latest']
  //       } as { method: string; params: [string, string] });
  //       const ethBalance = (parseInt(balance as string) / 1e18).toFixed(4);
  //       setBalance(ethBalance);
  //     } catch (error) {
  //       console.error('Error getting balance:', error);
  //     }
  //   }
  // };

  // const handleConnectMetaMask = async () => {
  //   if (window.ethereum) {
  //     try {
  //       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
  //       setAddress(accounts[0]);
  //       await getBalance(accounts[0]);
  //       setIsModalOpen(false);
  //     } catch (error) {
  //       console.error('Error connecting to MetaMask:', error);
  //     }
  //   } else {
  //     alert('MetaMask is not installed!');
  //   }
  // };

  // const handleDisconnect = () => {
  //   disconnect();
  // };

  // const switchNetwork = async () => {
  //   if (window.ethereum) {
  //     try {
  //       await window.ethereum.request({
  //         method: 'wallet_switchEthereumChain',
  //         params: [{ chainId: TARGET_NETWORK.chainId }],
  //       });
  //     } catch (switchError: unknown) {
  //       const error = switchError as { code: number };
  //       if (error.code === 4902) {
  //         try {
  //           await window.ethereum.request({
  //             method: 'wallet_addEthereumChain',
  //             params: [TARGET_NETWORK],
  //           });
  //         } catch (addError) {
  //           console.error('Error adding network:', addError);
  //         }
  //       }
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (window.ethereum) {
  //     window.ethereum.on('accountsChanged', (accounts: unknown) => {
  //       const walletAccounts = accounts as string[];
  //       if (walletAccounts.length > 0) {
  //         setAddress(walletAccounts[0]);
  //         getBalance(walletAccounts[0]);
  //       } else {
  //         handleDisconnect();
  //       }
  //     });

  //     window.ethereum.on('chainChanged', (args: unknown) => {
  //       const chainId = args as string;
  //       setIsCorrectNetwork(chainId === TARGET_NETWORK.chainId);
  //     });
  //     const checkNetwork = async () => {
  //       if (window.ethereum) {
  //         const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  //         setIsCorrectNetwork(chainId === TARGET_NETWORK.chainId);
  //       }
  //     };

  //     checkNetwork();
  //   }

  //   return () => {
  //     if (window.ethereum) {
  //       window.ethereum.removeListener('accountsChanged', () => {});
  //       window.ethereum.removeListener('chainChanged', () => {});
  //     }
  //   };
  // }, []);

  return (
    <header>
      <div className="container flex h-16 items-center justify-end px-4">
        <ConnectKitButton />

        {/* <WalletModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConnectMetaMask={handleConnectMetaMask}
          address={address}
          balance={balance}
          onDisconnect={handleDisconnect}
        /> */}
      </div>
    </header>
  );
}