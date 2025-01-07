import React, { useEffect, useState } from 'react';
import { ethers, formatEther } from 'ethers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { stakingABI, STAKING_CONTRACT_ADDRESS, Position } from '@/abi/stakeAbi';
import { Progress } from "@/components/ui/progress";
import { useAccount, useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import { Skeleton } from "@/components/ui/skeleton";
import { ConnectKitButton } from "connectkit";
import { Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRefresh } from '@/context/RefreshContext';

const DURATION_MAP = {
  '1Min': BigInt(60),
  '6M': BigInt(15778800),
  '1Y': BigInt(31557600),
} as const;

const REWARD_RATES = {
  60: 500,
  15778800: 700,
  31557600: 1500,
};

// const WHITELIST_BONUS = 1.05;

export default function StakePanel() {
  const { address } = useAccount()
  const { data: balance } = useBalance({
    address,
  })

  const formattedBalance = balance ? formatUnits(balance.value, balance.decimals) : '0'

  const [nativeBalance, setNativeBalance] = useState<bigint>(BigInt(0));
  const [inputValue, setInputValue] = useState<string>('');
  const [lockPeriod, setLockPeriod] = useState<bigint>(DURATION_MAP['6M']);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('all');
  const [totalStaked, setTotalStaked] = useState<bigint>(BigInt(0));
  const [currentStaked, setCurrentStaked] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(true);
  const { triggerRefresh } = useRefresh();  


  useEffect(() => {
    if (!address) {
      return;
    }
    const init = async () => {
      try {
        setIsLoading(true);
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingABI, provider);
          
          // 获取质押进度
          const stakingProgress = await contract.getStakingProgress();
          setTotalStaked(stakingProgress.total);
          setCurrentStaked(stakingProgress.current);

          // 获取白名单状态
          const whitelisted = await contract.whitelisted(address);
          setIsWhitelisted(whitelisted);

          // 获取用户的原生余额
          const userBalance = await provider.getBalance(address);
          setNativeBalance(userBalance);
        }
      } catch (error) {
        console.error("Error initializing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [address]);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!address) {
        return;
      }
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingABI, provider);

        // 获取用户的质押位置
        const userPositions = await contract.getUserPositions(address);
        setPositions(userPositions);
      }
    };

    fetchPositions();
  }, [address]);

  if (!address) {
    return (
      <div className="container p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <div className="text-lg font-semibold text-muted-foreground mb-4">
                Connect your wallet to start staking
              </div>
              <ConnectKitButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex space-x-4">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-10 w-1/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 检查是否质押已满
  const isStakingFull = currentStaked >= totalStaked;

  // 如果不在白名单或质押已满,显示相应提示
  if (!isWhitelisted) {
    return (
      <div className="container p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-xl font-semibold text-red-500 mb-2">
                Not Eligible
              </div>
              <p className="text-gray-500 text-center">
                You are not eligible to participate in staking. Please contact support for more information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isStakingFull) {
    return (
      <div className="container p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-xl font-semibold text-yellow-500 mb-2">
                Staking Pool is Full
              </div>
              <p className="text-gray-500 text-center">
                The staking pool has reached its maximum capacity. Please try again later.
              </p>
              <div className="mt-4">
                <Progress 
                  value={100} 
                  className="w-64"
                />
                <div className="text-sm text-center mt-2 text-gray-500">
                  {ethers.formatEther(currentStaked)} / {ethers.formatEther(totalStaked)} HSK
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateCurrentEarnings = (amount: bigint, lockPeriod: bigint, stakedAt: bigint): number => {
    const rewardRate = REWARD_RATES[lockPeriod.toString() as unknown as keyof typeof REWARD_RATES] || 0;
    const apy = (Number(rewardRate) / 1000) * 100;
    const stakedAtSeconds = Number(stakedAt);
    const endTime = stakedAtSeconds + Number(lockPeriod);
    const daysStaked = (endTime - stakedAtSeconds) / 86400;
    
    const dailyRate = apy / 365;
    const earningsPercentage = dailyRate * daysStaked;
    return earningsPercentage;
  };

  const handleStakeClick = async () => {
    if (!inputValue || !address || nativeBalance === undefined) return;
    
    setIsPending(true);
    setError(null);
    try {
      const amount = ethers.parseEther(inputValue);

      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingABI, signer);

      const tx = await contract.stake(lockPeriod, {
        value: amount,
        gasLimit: 500000,
      });

      await tx.wait();
      // Refresh balance and positions after successful stake
      const newBalance = await provider.getBalance(address);
      setNativeBalance(newBalance);
      
      // 重新获取用户的质押位置
      const userPositions = await contract.getUserPositions(address);
      setPositions(userPositions);

      // 显示成功提示
      toast.success("Stake Successful! Your stake was successful.");
      triggerRefresh();
      // Reset input after successful stake
      setInputValue('');

    } catch  {
      setError('Failed to stake tokens. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const handleMaxClick = () => {
    const gasBuffer = ethers.parseEther('0.01');
    const maxAmount = nativeBalance > gasBuffer ? 
      nativeBalance - gasBuffer : 
      BigInt(0);
    setInputValue(ethers.formatEther(maxAmount));
  };

  const handleDurationSelect = (duration: keyof typeof DURATION_MAP) => {
    setLockPeriod(DURATION_MAP[duration]);
  };

  const isButtonDisabled = 
    !inputValue || 
    isPending ||
    Number(inputValue) < 100 ||
    ethers.parseEther(inputValue) > nativeBalance ||
    (currentStaked + ethers.parseEther(inputValue)) > totalStaked;

  const getErrorMessage = () => {
    if (!inputValue) {
      return null;
    }
    if (Number(inputValue) < 100) {
      return 'Minimum stake amount is 100';
    }
    if (ethers.parseEther(inputValue || '0') > nativeBalance) {
      return 'Insufficient balance';
    }
    if ((currentStaked + ethers.parseEther(inputValue || '0')) > totalStaked) {
      return 'Exceeds staking pool capacity';
    }
    return null;
  };

  const handleClaim = async (positionId: bigint) => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingABI, signer);

      setIsPending(true);
      try {
        const tx = await contract.unstake(positionId);
        await tx.wait();
        // 领取后刷新质押状态
        const userPositions = await contract.getUserPositions(address);
        setPositions(userPositions);
        toast.success("Claim Successful! Your claim was successful.");

      } catch (error) {
        console.error('Error claiming reward:', error);
        toast.error("Claim Failed! Failed to claim rewards. Please try again.");
      } finally {
        setIsPending(false);
      }
    }
  };

  const filteredPositions = positions.filter(position => {
    if (activeTab === 'all') return true;
    if (activeTab === 'staking') return !position.isUnstaked;
    if (activeTab === 'claimed') return position.isUnstaked;
    return false;
  });

  const calculateAPY = (duration: bigint) => {
    const rate = REWARD_RATES[duration.toString() as unknown as keyof typeof REWARD_RATES] || 0;
    return (Number(rate) / 1000) * 100;
  };

  return (
    <>
        <div className="container p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Staking History</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="staking">Staking</TabsTrigger>
                    <TabsTrigger value="claimed">Claimed</TabsTrigger>
                  </TabsList>
                  <TabsContent value={activeTab} className="space-y-6">
                    <div className="space-y-4">
                      {filteredPositions.length === 0 ? (
                        <div className="text-center text-gray-500">No staking history found.</div>
                      ) : (
                        filteredPositions.map((position, index) => {
                          const isExpired = Date.now() / 1000 > Number(position.stakedAt) + Number(position.lockPeriod);
                          const currentEarnings = calculateCurrentEarnings(position.amount, position.lockPeriod, position.stakedAt);

                          let statusColor = 'bg-yellow-500';
                          let statusText = 'Pending';

                          if (position.isUnstaked) {
                            statusColor = 'bg-gray-500';
                            statusText = 'Claimed';
                          } else if (isExpired) {
                            statusColor = 'bg-green-500';
                            statusText = 'Ready to Claim';
                          }

                          return (
                            <div key={index} className="relative mb-4 p-4 border rounded-lg shadow-sm bg-white flex flex-col md:flex-row justify-between items-center">
                              <div className="mb-2 md:mb-0">
                                <div className="font-semibold text-lg">Amount: {formatEther(position.amount)} HSK</div>
                                <div className="text-sm text-gray-600">Ends In: {new Date((Number(position.stakedAt) + Number(position.lockPeriod)) * 1000).toLocaleDateString()}</div>
                                <div className="text-sm text-gray-600">Earnings: {currentEarnings.toFixed(4)}%</div>
                              </div>
                              <div className={`absolute top-2 right-2 px-2 py-1 text-white text-xs rounded ${statusColor}`}>
                                {statusText}
                              </div>
                              {isExpired && !position.isUnstaked && (
                                <Button
                                  className="absolute bottom-2 right-2 text-white px-4 py-2 rounded"
                                  onClick={() => handleClaim(position.positionId)}
                                  disabled={isPending}
                                >
                                  {isPending ? 'Processing...' : 'Claim'}
                                </Button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="stake" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="stake">Stake</TabsTrigger>
                    <TabsTrigger value="unstake" disabled>Unstake</TabsTrigger>
                  </TabsList>
                  <TabsContent value="stake" className="space-y-6">
                    <div>
                      <div className="mb-2">
                        <label className="text-sm font-medium">Amount</label>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            Available: {ethers.formatEther(nativeBalance)} HSK
                          </div>
                          <div className="text-sm font-semibold text-green-600">
                            APY: {calculateAPY(lockPeriod)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mb-2">
                        {[25, 50, 75, 100].map((percent) => (
                          <Button
                            key={percent}
                            onClick={() => {
                              const maxAmount = Number(formatEther(nativeBalance));
                              const gasBuffer = 0.01;
                              const availableAmount = Math.max(0, maxAmount - gasBuffer);
                              const amount = (availableAmount * percent) / 100;
                              setInputValue(amount.toFixed(18).replace(/\.?0+$/, ''));
                            }}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            {percent}%
                          </Button>
                        ))}
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={`0.00 (MAX: ${formattedBalance})`}
                          className="pr-24"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
                          <button 
                            onClick={handleMaxClick}
                            className="text-xs"
                          >
                            MAX
                          </button>
                          <span className="text-sm text-muted-foreground">HSK</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2">
                        <label className="text-sm font-medium">Duration</label>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.keys(DURATION_MAP).map((duration) => (
                          <Button
                            key={duration}
                            variant="outline"
                            size="sm"
                            className={`w-full ${lockPeriod === DURATION_MAP[duration as keyof typeof DURATION_MAP] ? 'bg-primary text-primary-foreground' : ''}`}
                            onClick={() => handleDurationSelect(duration as keyof typeof DURATION_MAP)}
                          >
                            {duration}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {(error || getErrorMessage()) && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          {error || getErrorMessage()}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleStakeClick}
                      disabled={isButtonDisabled || isPending}
                      title={Number(inputValue) < 100 ? 'Minimum stake amount is 100' : ''}
                    >
                      {isPending ? 'Processing...' : 'Stake'}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
    </>
  );
}