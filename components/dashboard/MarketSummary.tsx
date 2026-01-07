import React, { useMemo, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts';
import { GlassCard } from '../ui/GlassCard';
import { StatCard } from './StatCard';
import { Wallet, TrendingUp, Download, Calendar } from 'lucide-react';

interface MarketSummaryProps {
  selectedCoin?: {
    name: string;
    symbol: string;
    price: number;
  };
}

type TimeRange = '1D' | '5D' | '30D' | '1Y' | '5Y' | 'MAX';

// Helper to generate mock price history based on range
const generatePriceHistory = (basePrice: number, range: TimeRange) => {
  let points = 30;
  let volatility = 0.05;

  switch (range) {
    case '1D': points = 24; volatility = 0.02; break; // Hourly
    case '5D': points = 60; volatility = 0.04; break; // Every 2 hours
    case '30D': points = 30; volatility = 0.08; break; // Daily
    case '1Y': points = 52; volatility = 0.15; break; // Weekly
    case '5Y': points = 60; volatility = 0.30; break; // Monthly
    case 'MAX': points = 80; volatility = 0.50; break;
  }

  const data = [];
  let currentPrice = basePrice * (1 - volatility); // Start slightly lower/different

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.45) * volatility;
    currentPrice = currentPrice * (1 + change);
    data.push({
      date: `Pt ${i + 1}`,
      price: currentPrice
    });
  }
  // Force expand to current price at end
  data[points - 1].price = basePrice;
  return data;
};

export const MarketSummary: React.FC<MarketSummaryProps> = ({ selectedCoin = { name: 'Bitcoin', symbol: 'BTC', price: 64000 } }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');

  const chartData = useMemo(() => generatePriceHistory(selectedCoin.price, timeRange), [selectedCoin.name, timeRange]);

  const startPrice = chartData[0].price;
  const endPrice = chartData[chartData.length - 1].price;
  const changeRaw = endPrice - startPrice;
  const changePercent = ((changeRaw / startPrice) * 100).toFixed(2);
  const isPositive = changeRaw >= 0;

  const ranges: TimeRange[] = ['1D', '5D', '30D', '1Y', '5Y', 'MAX'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

      {/* Column 1: Stats Context */}
      <div className="flex flex-col gap-6">
        <StatCard
          title="Current Price"
          value={`$${selectedCoin.price.toLocaleString()}`}
          trend={`${isPositive ? '+' : ''}${changePercent}% (${timeRange})`}
          isPositive={isPositive}
          icon={Wallet}
        />
        <StatCard
          title="Market Cap"
          value="$1.2T"
          trend="+1.2%"
          isPositive={true}
          icon={TrendingUp}
        />
      </div>

      {/* Column 2: Price History Chart */}
      <GlassCard className="col-span-1 lg:col-span-2 !p-0 flex flex-col min-h-[400px]" hoverEffect={false}>
        <div className="p-6 border-b border-sedna-glassBorder flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold text-xs ring-1 ring-red-500/40">
                {selectedCoin.symbol[0]}
              </div>
              <div>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  {selectedCoin.name} Price History
                </h3>

                <span className="text-xs text-sedna-textMuted uppercase tracking-wider scale-90 origin-left block">{selectedCoin.symbol} / USD</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${timeRange === range
                  ? 'bg-red-500/20 text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.2)]'
                  : 'border-transparent text-sedna-textMuted hover:text-white hover:bg-white/5'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 flex-1 w-full relative">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart key={`${selectedCoin.symbol}-${timeRange}`} data={chartData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF0000" stopOpacity={0.6} />
                    <stop offset="50%" stopColor="#FF0000" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" strokeDasharray="10 10" />
                <XAxis
                  dataKey="date"
                  hide={true}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 11 }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  width={60}
                />
                <Tooltip
                  cursor={{ stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{
                    backgroundColor: 'rgba(5,5,5,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 40px -10px rgba(255,0,0,0.2)'
                  }}
                  itemStyle={{ color: '#FF0000', fontWeight: 600 }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#FF0000"
                  strokeWidth={3}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', shadowColor: '#FF0000' }}
                  fill="url(#priceGradient)"
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};