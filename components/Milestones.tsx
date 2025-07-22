import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const milestones = [
  { year: '2013', title: 'Ethereum Whitepaper', description: 'Vitalik Buterin published the Ethereum whitepaper, introducing the vision of a smart contract platform' },
  { year: '2015', title: 'Genesis Block', description: 'Ethereum mainnet launch, marking the beginning of the smart contract era' },
  { year: '2016', title: 'The DAO Event', description: 'Community consensus led to a hard fork in response to The DAO attack' },
  { year: '2017', title: 'ICO Boom', description: 'ERC-20 token standard revolutionized cryptocurrency fundraising' },
  { year: '2020', title: 'DeFi Year One', description: 'DeFi explosion with TVL exceeding $10 billion' },
  { year: '2021', title: 'NFT Prosperity', description: 'ERC-721 transformed digital art and gaming assets' },
  { year: '2022', title: 'The Merge', description: 'Successful transition to PoS, reducing energy consumption by 99.95%' },
  { year: '2023', title: 'Shanghai Upgrade', description: 'Enabled staking withdrawals, enhancing the staking ecosystem' },
  { year: '2024', title: 'Scaling Progress', description: 'Layer 2 ecosystem flourishes, daily transactions exceed mainnet' },
];

export default function Milestones() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Ethereum Milestones</h2>
        <p className="text-gray-400">A Decade of Innovation and Growth</p>
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