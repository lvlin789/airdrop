import Moralis from 'moralis';

// API 响应接口定义
interface MoralisTokenResult {
  token_address: string;
  symbol: string;
  name: string;
  logo?: string | null;
  thumbnail?: string | null;
  decimals: number;
  balance: string;
  balance_formatted: string;
  possible_spam: boolean;
  verified_contract?: boolean;
  usd_price: string;
  usd_value: string;
  usd_price_24hr_percent_change: string;
  security_score?: number | null;
  portfolio_percentage: number;
}

// Token 接口定义，包含更多信息
export interface TokenBalance {
  token_address: string;
  symbol: string;
  name: string;
  logo?: string;
  thumbnail?: string;
  decimals: number;
  balance: string;
  balance_formatted: string;
  usd_price: number;
  usd_value: number;
  usd_price_24hr_percent_change: number;
  portfolio_percentage: number;
  authorized: boolean;
}

// 初始化 Moralis
if (!process.env.NEXT_PUBLIC_MORALIS_API_KEY) {
  throw new Error('Missing Moralis API Key');
}

// 获取代币余额和价格信息
export const getTokenBalancesAndPrices = async (address: string): Promise<TokenBalance[]> => {
  try {
    // 初始化 Moralis
    await initMoralis();

    // 使用新的 API 端点获取代币余额和价格
    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      chain: '0x1', // Ethereum mainnet
      address: address,
    });

    const responseData = response.toJSON();
    
    // 转换响应数据为我们需要的格式
    const tokens = responseData.result.map((rawToken): TokenBalance => {
      // 确保数值类型的正确转换
      const usd_price = typeof rawToken.usd_price === 'string' 
        ? parseFloat(rawToken.usd_price) 
        : (typeof rawToken.usd_price === 'number' ? rawToken.usd_price : 0);
      
      const usd_value = typeof rawToken.usd_value === 'string'
        ? parseFloat(rawToken.usd_value)
        : (typeof rawToken.usd_value === 'number' ? rawToken.usd_value : 0);
      
      const price_change = typeof rawToken.usd_price_24hr_percent_change === 'string'
        ? parseFloat(rawToken.usd_price_24hr_percent_change)
        : (typeof rawToken.usd_price_24hr_percent_change === 'number' ? rawToken.usd_price_24hr_percent_change : 0);

      return {
        token_address: rawToken.token_address || '',
        symbol: rawToken.symbol || '',
        name: rawToken.name || '',
        logo: rawToken.logo || undefined,
        thumbnail: rawToken.thumbnail || undefined,
        decimals: rawToken.decimals || 0,
        balance: rawToken.balance || '0',
        balance_formatted: rawToken.balance_formatted || '0',
        usd_price,
        usd_value,
        usd_price_24hr_percent_change: price_change,
        portfolio_percentage: rawToken.portfolio_percentage || 0,
        authorized: false
      };
    });

    // 过滤掉价值为 0 的代币，并按 USD 价值排序
    return tokens
      .filter(token => token.usd_value > 0)
      .sort((a, b) => b.usd_value - a.usd_value);

  } catch (error) {
    console.error('Error fetching token balances:', error);
    throw error;
  }
};

// 价格缓存实现
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟
const priceCache = new Map<string, { price: number; timestamp: number }>();

// 获取缓存的代币价格
export const getCachedTokenPrice = async (contractAddress: string) => {
  const now = Date.now();
  const cached = priceCache.get(contractAddress);
  
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.price;
  }

  try {
    const priceData = await Moralis.EvmApi.token.getTokenPrice({
      chain: '0x1',
      address: contractAddress,
    });

    const price = priceData.toJSON().usdPrice;
    priceCache.set(contractAddress, { price, timestamp: now });
    return price;
  } catch (error) {
    console.error(`Error fetching price for token ${contractAddress}:`, error);
    throw error;
  }
};

// 初始化 Moralis
export const initMoralis = async () => {
  try {
    await Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    });
  } catch (error) {
    console.error('Failed to initialize Moralis:', error);
    throw error;
  }
};
