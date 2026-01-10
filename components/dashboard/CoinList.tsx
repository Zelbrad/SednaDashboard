import React from 'react';
import { CoinData } from '../../types';
import { Sparkline } from './Sparkline';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, FileText, Star } from 'lucide-react';

interface CoinListProps {
  coins: CoinData[];
  onSelect?: (coin: CoinData) => void;
  favorites?: string[];
  onToggleFavorite?: (coin: CoinData) => void;
}

export const CoinList: React.FC<CoinListProps> = ({ coins, onSelect, favorites = [], onToggleFavorite }) => {
  return (
    <div className="w-full">
      {/* ... Headers ... */}
      <div className="grid grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-3 text-xs font-medium text-sedna-textMuted uppercase tracking-wider border-b border-white/5">
        <div className="col-span-1"></div>
        <div className="col-span-5 md:col-span-3">Asset</div>
        <div className="col-span-3 md:col-span-2 text-right">Price</div>
        <div className="col-span-3 md:col-span-2 text-right">Change (24h)</div>
        <div className="hidden md:block col-span-2 text-right">Trend</div>
        <div className="hidden md:block col-span-2 text-right">Actions</div>
      </div>

      {/* List Items */}
      <div className="space-y-1 mt-2">
        {coins.map((coin) => (
          <CoinRow
            key={coin.id}
            coin={coin}
            onSelect={onSelect}
            isFavorite={favorites.includes(coin.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

interface CoinRowProps {
  coin: CoinData;
  onSelect?: (c: CoinData) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (c: CoinData) => void;
}

const CoinRow: React.FC<CoinRowProps> = ({ coin, onSelect, isFavorite, onToggleFavorite }) => {
  const isPositive = coin.price_change_percentage_24h >= 0;

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row selection
    onToggleFavorite?.(coin);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };

  return (
    <div
      onClick={() => onSelect?.(coin)}
      className="group grid grid-cols-12 gap-2 md:gap-4 items-center px-4 md:px-6 py-4 rounded-lg hover:bg-white/[0.03] transition-colors duration-200 border border-transparent hover:border-white/5 cursor-pointer"
    >

      {/* Checkbox / Star */}
      <div className="col-span-1 flex items-center">
        <button
          className={`transition-colors cursor-pointer ${isFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}
          onClick={handleStarClick}
        >
          <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Asset Name */}
      <div className="col-span-5 md:col-span-3 flex items-center gap-2 md:gap-3">
        <img src={coin.image} alt={coin.name} className="w-6 h-6 md:w-8 md:h-8 rounded-full" />
        <div className="overflow-hidden">
          <p className="font-medium text-white text-sm truncate">{coin.name}</p>
          <p className="text-xs text-gray-500">{coin.symbol.toUpperCase()}</p>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-3 md:col-span-2 text-right">
        <p className="text-xs md:text-sm font-mono text-gray-200">{formatCurrency(coin.current_price)}</p>
      </div>

      {/* Change */}
      <div className="col-span-3 md:col-span-2 flex justify-end">
        <div className={`flex items-center gap-1 text-xs md:text-sm font-medium ${isPositive ? 'text-green-500' : 'text-sedna-accent'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>

      {/* Trend (Sparkline) */}
      <div className="hidden md:flex col-span-2 h-10 items-center justify-end opacity-60 group-hover:opacity-100 transition-opacity">
        {coin.sparkline_in_7d && (
          <div className="w-24 h-full">
            <Sparkline data={coin.sparkline_in_7d.price} isPositive={isPositive} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="hidden md:flex col-span-2 justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white">
          <FileText size={14} />
        </button>
        <button className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white">
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  );
};