import { Badge } from '@/components/ui/badge';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/ethereum-pattern.svg')] opacity-5"></div>
      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        <div className="text-center space-y-4">
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 backdrop-blur-sm text-sm md:text-base shadow-md">
            🎉 Ethereum 10th Anniversary
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg">
            10 WETH Airdrop Event
          </h1>
          <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto">
            Join Ethereum&apos;s 10th Anniversary celebration! Connect your wallet for a chance to win up to 10 WETH. To thank our community for their continued support, we&apos;ve prepared a total reward pool of $1 million.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto mt-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 md:p-4 backdrop-blur-sm shadow">
              <h3 className="text-lg md:text-2xl font-bold text-blue-300 mb-1">$1,000,000</h3>
              <p className="text-gray-200 text-sm">Total Pool</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 md:p-4 backdrop-blur-sm shadow">
              <h3 className="text-lg md:text-2xl font-bold text-purple-300 mb-1">10 WETH</h3>
              <p className="text-gray-200 text-sm">Max Reward</p>
            </div>
            <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-3 md:p-4 backdrop-blur-sm shadow">
              <h3 className="text-lg md:text-2xl font-bold text-pink-300 mb-1">0.1 WETH</h3>
              <p className="text-gray-200 text-sm">Min Reward</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 md:p-4 backdrop-blur-sm shadow">
              <h3 className="text-lg md:text-2xl font-bold text-blue-300 mb-1">100,000+</h3>
              <p className="text-gray-200 text-sm">Participants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 