import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
    <GlassCard className="p-4 flex flex-col justify-center h-full min-h-[100px]" hoverEffect={hoverEffect}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sedna-textMuted font-medium text-sm">{title}</span>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{value}</h3>
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
    </GlassCard>
  );
};