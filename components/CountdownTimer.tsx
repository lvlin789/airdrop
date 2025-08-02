import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { useMemo } from 'react';

export default function CountdownTimer() {
  // 只在首次渲染时生成目标时间
  const targetDate = useMemo(() => new Date().getTime() + 3 * 24 * 60 * 60 * 1000, []);
  const timeLeft = useCountdown(targetDate);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-gray-800 rounded-xl shadow">
        <CardHeader className="text-center py-4">
          <CardTitle className="text-xl md:text-2xl flex items-center justify-center gap-2 text-gray-100">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-300" />
            남은 시간
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {[
              { label: '일', value: timeLeft.days },
              { label: '시간', value: timeLeft.hours },
              { label: '분', value: timeLeft.minutes },
              { label: '초', value: timeLeft.seconds },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-black/30 rounded-lg p-2 md:p-4 text-center border border-blue-900/30 shadow"
              >
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-300 tabular-nums">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-gray-300 text-xs md:text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 