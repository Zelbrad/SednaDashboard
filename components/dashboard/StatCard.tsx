import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: LucideIcon;
  hoverEffect?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, isPositive, icon: Icon, hoverEffect = false }) => {
  return (
    <GlassCard className="p-6 flex flex-col justify-between h-full min-h-[160px]" hoverEffect={hoverEffect}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-gray-400 group-hover:text-white group-hover:bg-sedna-accent/10 transition-colors">
            <Icon size={20} />
          </div>
          <span className="text-sedna-textMuted font-medium text-sm">{title}</span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{value}</h3>
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      </div>
    </GlassCard>
  );
};