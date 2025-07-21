import { initMoralis as initMoralisSDK } from "@/utils/moralis";

let isInitialized = false;

export const ensureMoralisInitialized = async () => {
  if (!isInitialized) {
    try {
      await initMoralisSDK();
      isInitialized = true;
    } catch (error) {
      // 如果错误是由于已经初始化，我们可以安全地忽略它
      if (!(error instanceof Error) || !error.message.includes('Modules are started already')) {
        console.error('Moralis initialization error:', error);
        throw error;
      }
      isInitialized = true;
    }
  }
};
