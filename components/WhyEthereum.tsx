import { Card, CardContent } from '@/components/ui/card';
import { Zap, CheckCircle, History, Diamond, Gift, Sparkles } from 'lucide-react';

const features = [
  { icon: <Zap className="w-8 h-8 text-blue-400" />, title: 'Technical Innovation', description: 'Birthplace of smart contracts, leading blockchain innovation with mature Layer 2 scaling solutions' },
  { icon: <CheckCircle className="w-8 h-8 text-blue-400" />, title: 'Security & Stability', description: '8 years with no major security incidents, securing over $200B in assets, highest level of decentralization' },
  { icon: <History className="w-8 h-8 text-blue-400" />, title: 'Thriving Ecosystem', description: 'Home to DeFi, NFTs, GameFi and more, with over 1M daily active addresses' },
  { icon: <Diamond className="w-8 h-8 text-blue-400" />, title: 'Store of Value', description: 'ETH is the second-largest cryptocurrency after Bitcoin, with market cap over $200B' },
  { icon: <Gift className="w-8 h-8 text-blue-400" />, title: 'Community', description: 'World\'s largest blockchain developer community with over 1M active developers' },
  { icon: <Sparkles className="w-8 h-8 text-blue-400" />, title: 'Future Vision', description: 'Continuous performance improvements through sharding, building decentralized internet infrastructure' },
];

export default function WhyEthereum() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Why Ethereum?</h2>
        <p className="text-gray-400">The Foundation of Web3</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
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
  );
} 