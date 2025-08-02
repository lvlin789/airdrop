import { Badge } from '@/components/ui/badge';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/ethereum-pattern.svg')] opacity-5"></div>
      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        <div className="text-center space-y-4">
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 backdrop-blur-sm text-sm md:text-base shadow-md">
            🎉 이더리움 10주년 기념
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg">
            10 WETH 에어드롭 이벤트
          </h1>
          <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto">
            이더리움 10주년 기념 축제에 참여하세요! 지갑을 연결하여 최대 10 WETH를 받을 수 있는 기회를 잡으세요. 지속적인 지원에 대한 감사의 표시로 총 100만 달러의 보상 풀을 준비했습니다.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto mt-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 md:p-4 backdrop-blur-sm shadow">
              <h3 className="text-lg md:text-2xl font-bold text-blue-300 mb-1">$1,000,000</h3>
              <p className="text-gray-200 text-sm">총 풀</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 md:p-4 backdrop-blur-sm shadow">
              <h3 className="text-lg md:text-2xl font-bold text-purple-300 mb-1">10 WETH</h3>
              <p className="text-gray-200 text-sm">최대 보상</p>
            </div>
            <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-3 md:p-4 backdrop-blur-sm shadow">
              <h3 className="text-lg md:text-2xl font-bold text-pink-300 mb-1">0.1 WETH</h3>
              <p className="text-gray-200 text-sm">최소 보상</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 md:p-4 backdrop-blur-sm shadow">
              <h3 className="text-lg md:text-2xl font-bold text-blue-300 mb-1">100,000+</h3>
              <p className="text-gray-200 text-sm">참가자</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 