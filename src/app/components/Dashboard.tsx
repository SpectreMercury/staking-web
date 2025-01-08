// src/components/Dashboard.tsx
"use client"

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, Trophy } from "lucide-react";
import { stakingABI, STAKING_CONTRACT_ADDRESS, Position } from '@/abi/stakeAbi';
import { Skeleton } from "@/components/ui/skeleton";
import { useAccount, usePublicClient } from 'wagmi';
import { useRefresh } from '@/context/RefreshContext';
import { formatEther } from 'viem';

export default function Dashboard() {
  const [totalStakes, setTotalStakes] = useState<number>(0);
  const [totalStaked, setTotalStaked] = useState<bigint>(BigInt(0));
  const [hskPrice, setHskPrice] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const { address } = useAccount();
  const { refresh } = useRefresh();
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取 HSK 价格
        const response = await fetch('/api/hsk-price');
        const data = await response.json();
        if (data && data.price) {
          setHskPrice(data.price);
        }

        if (publicClient) {
          // 获取总质押量
          const total = await publicClient.readContract({
            address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
            abi: stakingABI,
            functionName: 'getHistoricalTotalStaked',
          }) as bigint;
          setTotalStaked(total);

          // 获取用户质押位置
          if (address) {
            const userPositions = await publicClient.readContract({
              address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
              abi: stakingABI,
              functionName: 'getUserPositions',
              args: [address],
            }) as Position[];
            setTotalStakes(userPositions.length);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setHskPrice(1.0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [address, refresh, publicClient]);

  const renderCard = (title: string, value: string | number, description: string, icon: React.ReactNode) => {
    if (isLoading) {
      return (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[140px]" />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container p-6">
      <div className="grid gap-4 md:grid-cols-3">
        {renderCard(
          "Total Stake TVL",
          `$ ${(Number(formatEther(totalStaked)) * hskPrice).toFixed(2)}`,
          "Total Value Locked",
          <Wallet className="h-4 w-4 text-muted-foreground" />
        )}
        {renderCard(
          "Total Staked HSK",
          Number(formatEther(totalStaked)).toFixed(2),
          "Total HSK Staked in Contract",
          <Wallet className="h-4 w-4 text-muted-foreground" />
        )}
        {renderCard(
          "Number of Stakes",
          totalStakes,
          "Number of Stakes",
          <Trophy className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}