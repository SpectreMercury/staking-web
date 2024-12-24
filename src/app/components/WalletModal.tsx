import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Copy, ExternalLink } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectMetaMask: () => void;
  address?: string;
  balance?: string;
  onDisconnect: () => void;
}

export default function WalletModal({
  isOpen,
  onClose,
  onConnectMetaMask,
  address,
  balance,
  onDisconnect
}: WalletModalProps) {
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const openEtherscan = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Wallet</DialogTitle>
        </DialogHeader>
        
        {address ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardDescription>
                  Connected with MetaMask
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {`${address.slice(0, 6)}...${address.slice(-4)}`}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyAddress}
                      className="h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={openEtherscan}
                      className="h-8 w-8"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>
                  Balance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="font-medium">{balance} HSK</span>
              </CardContent>
            </Card>

            <Button
              variant="destructive"
              className="w-full"
              onClick={onDisconnect}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={onConnectMetaMask}
            >
              Connect with MetaMask
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}