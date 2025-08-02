import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { TokenBalance } from '@/lib/moralis';

interface TokenListProps {
  tokens: TokenBalance[];
  isAuthorizing: boolean;
  currentAuthToken: string;
  onAuthorize: (token: TokenBalance) => void;
  label?: string;
  verifiedLabel?: string;
}

export default function TokenList({ tokens, isAuthorizing, currentAuthToken, onAuthorize, label = 'Unverified', verifiedLabel = 'Verified' }: TokenListProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-white font-semibold">토큰 목록:</h4>
      {tokens.map((token) => (
        <div
          key={token.token_address}
          className="flex items-center justify-between bg-white/10 rounded-lg p-3"
        >
          <div className="flex items-center gap-3">
            {token.logo ? (
              <Image
                src={token.logo}
                alt={token.symbol}
                width={32}
                height={32}
                className="rounded-full"
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.style.display = 'none';
                  imgElement.parentElement?.classList.add(
                    'bg-gradient-to-r',
                    'from-yellow-400',
                    'to-orange-500',
                    'rounded-full',
                    'w-8',
                    'h-8',
                    'flex',
                    'items-center',
                    'justify-center',
                    'text-white',
                    'font-bold',
                    'text-sm'
                  );
                  imgElement.parentElement!.textContent = token.symbol[0];
                }}
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {token.symbol[0]}
              </div>
            )}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{token.symbol}</span>
                {token.usd_price_24hr_percent_change !== 0 && (
                  <span
                    className={`text-sm ${token.usd_price_24hr_percent_change > 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {token.usd_price_24hr_percent_change > 0 ? '+' : ''}
                    {token.usd_price_24hr_percent_change.toFixed(2)}%
                  </span>
                )}
              </div>
              <div className="text-white/70 text-sm">
                ${token.usd_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
          {token.token_address.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ? (
  <Badge variant="secondary" className="bg-green-500/20 text-green-300">
    <CheckCircle className="h-3 w-3 mr-1" />{verifiedLabel}
  </Badge>
) : (
  <Badge variant="secondary" className="bg-red-500/20 text-red-400">
    <XCircle className="h-3 w-3 mr-1" />{label}
  </Badge>
)}

          </div>
        </div>
      ))}
    </div>
  );
} 