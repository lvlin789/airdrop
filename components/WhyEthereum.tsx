import { Card, CardContent } from '@/components/ui/card';
import { Zap, CheckCircle, History, Diamond, Gift, Sparkles } from 'lucide-react';

const features = [
  { icon: <Zap className="w-8 h-8 text-blue-400" />, title: '기술 혁신', description: '스마트 계약의 발상지로 성숙한 레이어 2 확장 솔루션으로 블록체인 혁신을 선도' },
  { icon: <CheckCircle className="w-8 h-8 text-blue-400" />, title: '보안 및 안정성', description: '8년간 주요 보안 사고 없이 2000억 달러 이상의 자산을 보호, 최고 수준의 탈중앙화' },
  { icon: <History className="w-8 h-8 text-blue-400" />, title: '번영하는 생태계', description: 'DeFi, NFT, GameFi 등의 본고장으로 100만 이상의 일일 활성 주소를 보유' },
  { icon: <Diamond className="w-8 h-8 text-blue-400" />, title: '가치 저장 수단', description: 'ETH는 비트코인 다음으로 두 번째 큰 암호화폐로 2000억 달러 이상의 시가총액을 기록' },
  { icon: <Gift className="w-8 h-8 text-blue-400" />, title: '커뮤니티', description: '100만 명 이상의 활성 개발자를 보유한 세계 최대 블록체인 개발자 커뮤니티' },
  { icon: <Sparkles className="w-8 h-8 text-blue-400" />, title: '미래 비전', description: '샤딩을 통한 지속적인 성능 개선으로 탈중앙화 인터넷 인프라 구축' },
];

export default function WhyEthereum() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">왜 이더리움인가요?</h2>
        <p className="text-gray-400">Web3의 기초</p>
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