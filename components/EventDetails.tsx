import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function EventDetails() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-gray-800 rounded-xl shadow">
        <CardContent className="p-4 md:p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-100">Airdrop Rules</h2>
              <ul className="space-y-2 text-gray-200">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>Must hold ETH on mainnet</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>Wallet age 180 days</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>Minimum 10 historical transactions</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>Random reward between 0.1-10 WETH</span></li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-100">Event Details</h2>
              <ul className="space-y-2 text-gray-200">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>Rewards distributed within 24 hours</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>One participation per wallet address</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>Only 3 days left - Act fast!</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>Final interpretation rights reserved</span></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 