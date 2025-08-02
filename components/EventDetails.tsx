import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function EventDetails() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-gray-800 rounded-xl shadow">
        <CardContent className="p-4 md:p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-100">에어드롭 규칙</h2>
              <ul className="space-y-2 text-gray-200">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>메인넷에서 ETH 보유 필수</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>지갑 연령 180일 이상</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>최소 10개의 거래 기록</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>0.1-10 WETH 랜덤 보상</span></li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-100">이벤트 세부사항</h2>
              <ul className="space-y-2 text-gray-200">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>24시간 내 보상 지급</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>지갑 주소당 1회 참여</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>단 3일 남음 - 서둘러 참여하세요!</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-1 flex-shrink-0" /><span>최종 해석권 보유</span></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 