import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const milestones = [
  { year: '2013', title: '이더리움 백서', description: '비탈릭 부테린이 이더리움 백서를 발표하며 스마트 계약 플랫폼의 비전을 소개' },
  { year: '2015', title: '제네시스 블록', description: '이더리움 메인넷 출시로 스마트 계약 시대의 시작을 알림' },
  { year: '2016', title: 'DAO 사건', description: 'DAO 공격에 대응하여 커뮤니티 합의로 하드 포크 실시' },
  { year: '2017', title: 'ICO 붐', description: 'ERC-20 토큰 표준이 암호화폐 투자 유치에 혁명을 일으킴' },
  { year: '2020', title: 'DeFi 원년', description: 'TVL 100억 달러 돌파로 DeFi 대폭발' },
  { year: '2021', title: 'NFT 번영', description: 'ERC-721이 디지털 예술과 게임 자산을 변화시킴' },
  { year: '2022', title: '더 머지', description: 'PoS로의 성공적 전환으로 에너지 소비량 99.95% 감소' },
  { year: '2023', title: '상하이 업그레이드', description: '스테이킹 인출 가능으로 스테이킹 생태계 강화' },
  { year: '2024', title: '확장성 진전', description: '레이어 2 생태계 번영, 일일 거래량이 메인넷 초과' },
];

export default function Milestones() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">이더리움 마일스톤</h2>
        <p className="text-gray-400">혁신과 성장의 10년</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {milestones.map((milestone, index) => (
          <Card key={index} className="bg-black/50 border border-gray-800">
            <CardContent className="p-6">
              <Badge className="mb-4 bg-blue-500/10 text-blue-400">{milestone.year}</Badge>
              <h3 className="text-xl font-bold mb-2 text-gray-500">{milestone.title}</h3>
              <p className="text-gray-400">{milestone.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 