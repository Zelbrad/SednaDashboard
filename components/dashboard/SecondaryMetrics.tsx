import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid, XAxis } from 'recharts';
import { GlassCard } from '../ui/GlassCard';
import { Download, Lock } from 'lucide-react';

const areaData = [
  { name: 'Jan', invest: 4000, redeem: 2400 },
  { name: 'Feb', invest: 3000, redeem: 1398 },
  { name: 'Mar', invest: 2000, redeem: 9800 },
  { name: 'Apr', invest: 2780, redeem: 3908 },
  { name: 'May', invest: 1890, redeem: 4800 },
  { name: 'Jun', invest: 2390, redeem: 3800 },
  { name: 'Jul', invest: 3490, redeem: 4300 },
  { name: 'Aug', invest: 4000, redeem: 2400 },
  { name: 'Sep', invest: 3000, redeem: 1398 },
  { name: 'Oct', invest: 5000, redeem: 6800 },
  { name: 'Nov', invest: 2780, redeem: 3908 },
  { name: 'Dec', invest: 1890, redeem: 4800 },
];

const orders = [
  { type: 'LTF investments', amount: '0 USDC' },
  { type: 'Total investments', amount: '0 USDC' },
  { type: 'LTF investments', amount: '0 USDC' },
  { type: 'LTF investments', amount: '0 USDC' },
  { type: 'LTF investments', amount: '0 USDC' },
  { type: 'Total redemptions', amount: '0 USDC' },
];

export const SecondaryMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Column 1: Investment Chart (Wide) */}
      <GlassCard className="col-span-1 lg:col-span-2 !p-0 flex flex-col min-h-[350px]" hoverEffect={false}>
         <div className="p-6 border-b border-sedna-glassBorder flex justify-between items-center">
          <div>
            <h3 className="text-white font-semibold">Investments & Redemptions</h3>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="flex items-center gap-2 text-sedna-textMuted">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Investment
              </span>
              <span className="flex items-center gap-2 text-sedna-textMuted">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Redemption
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-sedna-glassBorder hover:bg-white/5 text-xs text-sedna-textMuted transition-colors">
            <Download size={14} />
            Download
          </button>
        </div>

        <div className="p-6 flex-1 w-full">
            <div className="flex justify-between mb-8">
             <div>
                <span className="block text-xs text-sedna-textMuted">Investment</span>
                <span className="text-xl font-bold text-white">38,458,041 USDC</span>
             </div>
             <div className="text-right">
                <span className="block text-xs text-sedna-textMuted">Redemption</span>
                <span className="text-xl font-bold text-white">108,041 USDC</span>
             </div>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRedeem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333' }} />
                <Area type="monotone" dataKey="invest" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorInvest)" />
                <Area type="monotone" dataKey="redeem" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorRedeem)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      {/* Column 2: Order Overview */}
      <GlassCard className="col-span-1 !p-0 flex flex-col" hoverEffect={false}>
        <div className="p-6 border-b border-sedna-glassBorder">
          <h3 className="text-white font-semibold">Order Overview</h3>
        </div>
        <div className="p-6">
          <div className="flex justify-between text-xs text-sedna-textMuted mb-4 font-medium uppercase tracking-wider">
            <span>Order</span>
            <span>Locked</span>
          </div>
          <div className="space-y-4">
            {orders.map((order, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 -mx-2 rounded transition-colors cursor-default group">
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{order.type}</span>
                <div className="flex items-center gap-2">
                   <Lock size={12} className="text-sedna-textMuted" />
                   <span className="text-sm font-mono text-white">{order.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};