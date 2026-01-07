import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CoinData } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Sparkline } from './Sparkline';

interface CoinCardProps {
  coin: CoinData;
}

export const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  const isPositive = coin.price_change_percentage_24h >= 0;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  return (
    <GlassCard className="p-5 flex flex-col justify-between h-full min-h-[220px]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={coin.image} 
            alt={coin.name} 
            className="w-10 h-10 rounded-full shadow-lg"
          />
          <div>
            <h3 className="font-bold text-lg leading-tight text-white">{coin.name}</h3>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{coin.symbol}</span>
          </div>
        </div>
        <div className={`
          flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-md
          ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}
        `}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-400 mb-1">Price</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {formatCurrency(coin.current_price)}
            </p>
          </div>
          {coin.sparkline_in_7d && (
            <Sparkline 
              data={coin.sparkline_in_7d.price} 
              isPositive={isPositive} 
            />
          )}
        </div>
      </div>
    </GlassCard>
  );
};