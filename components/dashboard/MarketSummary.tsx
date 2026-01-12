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
    image?: string;
  };
}

// ... existing code ...

// inside component return


type TimeRange = '1D' | '5D' | '30D' | '1Y' | '5Y' | 'MAX';

// Custom cursor component for the chart
const CustomCursor = (props: any) => {
  const { points, width, height } = props;
  const { x, y } = points[0];

  return (
    <g>
      <defs>
        <linearGradient id="cursorGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255, 0, 0, 0)" />
          <stop offset="50%" stopColor="rgba(255, 0, 0, 1)" />
          <stop offset="100%" stopColor="rgba(255, 0, 0, 0)" />
        </linearGradient>
      </defs>
      <rect x={x - 1} y={0} width={2} height={height} fill="url(#cursorGradient)" />
    </g>
  );
};


// Helper to generate mock price history based on range
// Helper to generate mock price history based on range with real dates
const generatePriceHistory = (basePrice: number, range: TimeRange) => {
  let points = 100;
  let volatility = 0.05;
  let durationMs = 24 * 60 * 60 * 1000; // Default 1 day

  switch (range) {
    case '1D':
      points = 96; // ~15 min intervals
      volatility = 0.02;
      durationMs = 24 * 60 * 60 * 1000;
      break;
    case '5D':
      points = 120; // Hourly
      volatility = 0.04;
      durationMs = 5 * 24 * 60 * 60 * 1000;
      break;
    case '30D':
      points = 180; // ~4 hours
      volatility = 0.08;
      durationMs = 30 * 24 * 60 * 60 * 1000;
      break;
    case '1Y':
      points = 365; // Daily
      volatility = 0.15;
      durationMs = 365 * 24 * 60 * 60 * 1000;
      break;
    case '5Y':
      points = 260; // Weekly
      volatility = 0.30;
      durationMs = 5 * 365 * 24 * 60 * 60 * 1000;
      break;
    case 'MAX':
      points = 300;
      volatility = 0.50;
      durationMs = 10 * 365 * 24 * 60 * 60 * 1000; // 10 years
      break;
  }

  const intervalMs = durationMs / points;
  const data = [];
  let currentPrice = basePrice * (1 - volatility); // Start slightly lower/different
  const now = new Date();

  for (let i = 0; i < points; i++) {
    // Calculate date backwards from now
    // i=0 is the oldest point, i=points-1 is now. 
    // Wait, usually i=0 is oldest. let's calculate time for each point.
    // Time = now - (points - 1 - i) * interval
    const time = new Date(now.getTime() - ((points - 1 - i) * intervalMs));

    const change = (Math.random() - 0.45) * volatility;
    currentPrice = currentPrice * (1 + change);

    // Format date based on range
    let dateLabel = '';
    if (range === '1D') {
      dateLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      dateLabel = time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }

    data.push({
      date: dateLabel,
      fullDate: time.toLocaleString(),
      price: currentPrice
    });
  }
  // Force expand to current price at end
  data[points - 1].price = basePrice;
  return data;
};

export const MarketSummary: React.FC<MarketSummaryProps> = ({ selectedCoin = { name: 'Bitcoin', symbol: 'BTC', price: 64000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' } }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');

  const chartData = useMemo(() => generatePriceHistory(selectedCoin.price, timeRange), [selectedCoin.name, timeRange]);

  const startPrice = chartData[0].price;
  const endPrice = chartData[chartData.length - 1].price;
  const changeRaw = endPrice - startPrice;
  const changePercent = ((changeRaw / startPrice) * 100).toFixed(2);
  const isPositive = changeRaw >= 0;

  const ranges: TimeRange[] = ['1D', '5D', '30D', '1Y', '5Y', 'MAX'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">

      {/* Column 1: Stats Context */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
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
      <GlassCard className="lg:col-span-3 !p-0 flex flex-col min-h-[450px]" hoverEffect={false}>
        <div className="p-6 border-b border-sedna-glassBorder flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              {selectedCoin.image ? (
                <img
                  src={selectedCoin.image}
                  alt={selectedCoin.name}
                  className="w-8 h-8 rounded-full shadow-lg p-0.5 bg-black/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold text-xs ring-1 ring-red-500/40">
                  {selectedCoin.symbol[0]}
                </div>
              )}
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border ${timeRange === range
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
          <div className="h-64 w-full cursor-pointer">
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
                  cursor={<CustomCursor />}
                  contentStyle={{
                    backgroundColor: 'rgba(5,5,5,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 40px -10px rgba(255,0,0,0.2)'
                  }}
                  itemStyle={{ color: '#FF0000', fontWeight: 600 }}
                  labelStyle={{ color: '#999', marginBottom: '4px' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#FF0000"
                  strokeWidth={3}
                  activeDot={false}
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