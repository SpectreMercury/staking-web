"use client"

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import StakePanel from "./components/StakePanel";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { STAKING_CONTRACT_ADDRESS, stakingABI } from '@/abi/stakeAbi';
import { Progress } from "@/components/ui/progress";
import { useRefresh } from "@/context/RefreshContext";

export default function Home() {
  const [totalStaked, setTotalStaked] = useState<bigint>(BigInt(0));
  const [currentStaked, setCurrentStaked] = useState<bigint>(BigInt(0));
  const { refresh } = useRefresh();

  
  useEffect(() => {
    const fetchStakingProgress = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingABI, signer);

        const stakingProgress = await contract.getStakingProgress();
        setTotalStaked(stakingProgress.total);
        setCurrentStaked(stakingProgress.current);
      }
    };

    fetchStakingProgress();
  }, [refresh]);
  

  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1">
        <Header />
        <div className="container">
          <Dashboard />          
          <div className="grid gap-4 md:grid-cols-2 p-6">
            <Card>
              <CardHeader>
                <CardTitle>Stake with Confidence</CardTitle>
                <CardDescription>
                  Join us to earn rewards and support the future of decentralized networks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm font-medium">Staking Progress</div>
                  <Progress className="my-4" value={Number(currentStaked) / Number(totalStaked) * 100} />
                  <div className="text-xs text-muted-foreground">
                    {ethers.formatEther(currentStaked)} / {ethers.formatEther(totalStaked)} HSK
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New to Staking?</CardTitle>
                <CardDescription>
                  Learn what staking is, its benefits, and how to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link href="/docs" className="flex items-center">
                    Read our docs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <StakePanel />
        </div>
      </main>
    </div>
  );
}
