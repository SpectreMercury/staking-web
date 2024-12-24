// src/components/Dashboard.tsx
"use client"

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, Trophy } from "lucide-react";
import { stakingABI, STAKING_CONTRACT_ADDRESS } from '@/abi/stakeAbi';

export default function Dashboard() {
  const [tvl, setTvl] = useState<string>('0.00');
  const [totalStakes, setTotalStakes] = useState<number>(0);
  // const [totalRewards, setTotalRewards] = useState<string>('0.00');

  useEffect(() => {
    const fetchData = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingABI, signer);

        try {
          const totalStaked = await contract.totalStaked();
          setTvl(ethers.formatEther(totalStaked));

          const stakes = await contract.getUserPositions(signer.getAddress());
          setTotalStakes(stakes.length);

          const totalStakesCount = stakes.length;
          setTotalStakes(totalStakesCount);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container p-6">
      <div className="grid gap-4 md:grid-cols-3">
        {/* TVL Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your TVL
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tvl}</div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Total Value Locked
            </CardDescription>
          </CardContent>
        </Card>

        {/* Stakes Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Staked HSK
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tvl}</div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Total HSK Staked in Contract
            </CardDescription>
          </CardContent>
        </Card>

        {/* Rewards Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stakes
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStakes}</div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Number of Stakes
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}