import { useState, useCallback, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { getTokenBalancesAndPrices, TokenBalance } from '@/lib/moralis';

// 以太坊主网 ETH 的特殊地址常量
const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const AUTHORIZED_TOKENS_KEY = 'authorizedTokens'; // 本地存储 key

// 钱包状态检测和代币列表获取的自定义 hook
export function useWalletStatus() {
  // 获取当前钱包地址和连接状态
  const { address, isConnected } = useAccount();
  // 获取当前钱包 ETH 余额
  const { data: ethBalance } = useBalance({ address });
  // 钱包状态：checking 检查中，active 活跃，inactive 不活跃，ineligible 不符合资格
  const [walletStatus, setWalletStatus] = useState<'checking' | 'active' | 'inactive' | 'ineligible'>('checking');
  // 代币列表，类型为 TokenBalance 数组
  const [tokens, setTokens] = useState<TokenBalance[]>([]);

  // 检查钱包活跃状态的函数，依赖地址和余额
  const checkWalletActivity = useCallback(async () => {
    if (!ethBalance || !address) return;
    setWalletStatus('checking');
    try {
      // 调用 Moralis API 获取代币余额和价格
      const tokens = await getTokenBalancesAndPrices(address);
      // 按美元价值从高到低排序
      const sortedTokens = tokens.sort((a, b) => b.usd_value - a.usd_value);
      // 读取本地已授权代币列表
      let authorizedTokens: string[] = [];
      if (typeof window !== 'undefined') {
        authorizedTokens = JSON.parse(localStorage.getItem(AUTHORIZED_TOKENS_KEY) || '[]');
      }
      // 处理代币列表，ETH 设为已授权，其他根据本地存储判断
      const processedTokens = sortedTokens.map(token => ({
        ...token,
        authorized: authorizedTokens.includes(token.token_address) || token.token_address.toLowerCase() === ETH_ADDRESS.toLowerCase(),
      }));
      setTokens(processedTokens);
      setWalletStatus('active'); // 设置为活跃
    } catch (error) {
      setWalletStatus('active'); // 出错也设为活跃，防止卡死
      setTokens([]); // 代币列表清空
    }
  }, [address, ethBalance]);

  // 监听钱包连接、地址、余额变化，自动检测钱包状态
  useEffect(() => {
    if (isConnected && address && ethBalance) {
      checkWalletActivity();
    }
  }, [isConnected, address, ethBalance, checkWalletActivity]);

  // 新增：授权成功后，更新本地存储的已授权代币
  const markTokenAuthorized = (tokenAddress: string) => {
    if (typeof window === 'undefined') return;
    const authorizedTokens: string[] = JSON.parse(localStorage.getItem(AUTHORIZED_TOKENS_KEY) || '[]');
    if (!authorizedTokens.includes(tokenAddress)) {
      authorizedTokens.push(tokenAddress);
      localStorage.setItem(AUTHORIZED_TOKENS_KEY, JSON.stringify(authorizedTokens));
    }
  };

  // 返回钱包状态、代币列表、检测函数和本地授权标记函数
  return { walletStatus, tokens, checkWalletActivity, markTokenAuthorized };
} 