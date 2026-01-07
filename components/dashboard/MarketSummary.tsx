import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
import { GlassCard } from '../ui/GlassCard';
import { StatCard } from './StatCard';
import { Wallet, PiggyBank, Download } from 'lucide-react';

// Generate more granular data to match the dense visual style of the reference image
const generateChartData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [];
  
  // Create 4 data points per month to simulate weekly data for a denser "bar" look
  for (let i = 0; i < months.length; i++) {
    for (let j = 0; j < 4; j++) {
      const baseRepayment = 2000 + Math.random() * 5000;
      const baseOrigination = 3000 + Math.random() * 8000;
      
      // Create a wave-like pattern
      const wave = Math.sin((i * 4 + j) / 10) * 2000;
      
      data.push({
        name: j === 0 ? months[i] : '', // Only show label for first week of month
        repayment: Math.abs(baseRepayment + wave),
        origination: -Math.abs(baseOrigination + wave * 0.8), // Negative for mirroring
      });
    }
  }
  return data;
};

const chartData = generateChartData();

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-sedna-panel border border-sedna-glassBorder p-3 rounded-lg shadow-xl backdrop-blur-md">
        {label && <p className="text-gray-400 text-xs mb-2">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm mb-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: index === 0 ? '#EC4899' : '#3B82F6' }}
            />
            <span className="text-gray-300 capitalize">
              {entry.dataKey === 'repayment' ? 'Repayment' : 'Origination'}:
            </span>
            <span className="font-mono text-white">
              {Math.abs(entry.value).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const MarketSummary: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      {/* Column 1: Stacked Stats */}
      <div className="flex flex-col gap-6">
        <StatCard 
          title="Pool Reserve" 
          value="5,093 USDC" 
          trend="+0.45%" 
          isPositive={true} 
          icon={Wallet} 
        />
        <StatCard 
          title="Max. Reserve" 
          value="20,000,000 USDC" 
          trend="+2.15%" 
          isPositive={true} 
          icon={PiggyBank} 
        />
      </div>

      {/* Column 2: Large Chart */}
      <GlassCard className="col-span-1 lg:col-span-2 !p-0 flex flex-col min-h-[400px]" hoverEffect={false}>
        <div className="p-6 border-b border-sedna-glassBorder flex justify-between items-center">
          <div>
            <h3 className="text-white font-semibold">Originations & Repayments</h3>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="flex items-center gap-2 text-sedna-textMuted">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span> Repayment
              </span>
              <span className="flex items-center gap-2 text-sedna-textMuted">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Origination
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-sedna-glassBorder hover:bg-white/5 text-xs text-sedna-textMuted transition-colors">
            <Download size={14} />
            Download
          </button>
        </div>

        <div className="p-6 flex-1 w-full relative">
          <div className="flex justify-between mb-6">
             <div>
                <span className="block text-xs text-sedna-textMuted uppercase tracking-wider">Repayment Total</span>
                <span className="text-2xl font-bold text-white tracking-tight">78,127,911 USDC</span>
             </div>
             <div className="text-right">
                <span className="block text-xs text-sedna-textMuted uppercase tracking-wider">Origination Total</span>
                <span className="text-2xl font-bold text-white tracking-tight">116,449,548 USDC</span>
             </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} stackOffset="sign" barGap={0} barCategoryGap="10%">
                <defs>
                  <linearGradient id="repaymentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity={1} />
                    <stop offset="100%" stopColor="#db2777" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="originationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 11 }} 
                  dy={10}
                  interval={0}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 11 }}
                  tickFormatter={(value) => `${Math.abs(value / 1000)}k`}
                />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.03)'}} />
                
                {/* Stacked allows them to align on the same X-axis point, expanding in opposite directions due to negative values */}
                <Bar 
                  dataKey="repayment" 
                  stackId="a" 
                  fill="url(#repaymentGradient)" 
                  radius={[4, 4, 0, 0]}
                  barSize={6}
                />
                <Bar 
                  dataKey="origination" 
                  stackId="a" 
                  fill="url(#originationGradient)" 
                  radius={[0, 0, 4, 4]} 
                  barSize={6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};