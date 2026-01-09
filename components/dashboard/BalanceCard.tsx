import React, { useState, useMemo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from 'recharts';

type TimeRange = '1D' | '1W' | '1M' | '1Y' | 'ALL';

const generateWinLossData = (range: TimeRange) => {
    let points = 20;
    let daysToSubtract = 0;

    switch (range) {
        case '1D': points = 96; daysToSubtract = 1; break; // ~15 mins
        case '1W': points = 84; daysToSubtract = 7; break; // ~2 hours
        case '1M': points = 90; daysToSubtract = 30; break; // ~8 hours
        case '1Y': points = 100; daysToSubtract = 365; break; // ~3.5 days
        case 'ALL': points = 120; daysToSubtract = 730; break;
    }

    const data = [];
    const now = new Date();
    const msPerPoint = (daysToSubtract * 24 * 60 * 60 * 1000) / points;

    // Start with base values for smoother random walk
    let currentWins = 5000;
    let currentLosses = 2000;

    for (let i = 0; i < points; i++) {
        const time = new Date(now.getTime() - ((points - 1 - i) * msPerPoint));
        let dateLabel = '';

        if (range === '1D') {
            dateLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (range === '1W' || range === '1M') {
            dateLabel = time.toLocaleDateString([], { day: 'numeric', month: 'short' });
        } else {
            dateLabel = time.toLocaleDateString([], { month: 'short', year: '2-digit' });
        }

        // Random walk: change by -5% to +5%
        const winChange = (Math.random() - 0.5) * 0.10;
        const lossChange = (Math.random() - 0.5) * 0.10;

        currentWins = currentWins * (1 + winChange);
        currentLosses = currentLosses * (1 + lossChange);

        // Keep bounds reasonable
        currentWins = Math.max(2000, Math.min(8000, currentWins));
        currentLosses = Math.max(1000, Math.min(4000, currentLosses));

        data.push({
            name: dateLabel,
            wins: Math.floor(currentWins),
            losses: Math.floor(currentLosses),
        });
    }
    return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-sedna-glass/95 border border-white/10 p-3 rounded-xl backdrop-blur-xl shadow-xl">
                <p className="text-gray-400 text-xs mb-2">{label}</p>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Wins: ${payload[0].value.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-400 font-medium">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Losses: ${payload[1].value.toLocaleString()}
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const BalanceCard: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('1M');
    const chartData = useMemo(() => generateWinLossData(timeRange), [timeRange]);
    const ranges: TimeRange[] = ['1D', '1W', '1M', '1Y', 'ALL'];

    return (
        <GlassCard className="p-0 relative overflow-hidden h-full" hoverEffect={false}>
            <div className="flex flex-col md:flex-row h-full">

                {/* Left Side: Balance Info */}
                <div className="p-6 md:w-1/3 flex flex-col justify-between relative z-10 bg-gradient-to-r from-black/20 to-transparent">
                    {/* Decorational Background Gradient */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sedna-accent/10 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none" />

                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5">
                                    <Wallet className="text-sedna-accent" size={20} />
                                </div>
                                <span className="text-white/60 font-medium">Total Balance</span>
                            </div>
                        </div>

                        <div className="mb-2 cursor-pointer">
                            <span className="text-4xl font-bold text-white tracking-tighter">
                                $124,532.00
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mb-8">
                            <div className="flex items-center text-green-400 bg-green-400/10 px-2 py-1 rounded-lg text-sm">
                                <ArrowUpRight size={14} className="mr-1" />
                                <span>+4.2%</span>
                            </div>
                            <span className="text-white/40 text-sm">vs last month</span>
                        </div>
                    </div>

                    {/* Quick Stats / Mini Breakdown */}
                    <div className="grid grid-cols-2 gap-3 mt-auto mb-4">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <span className="text-xs text-white/40 block mb-1">On-Chain</span>
                            <span className="text-white font-semibold">1.24 BTC</span>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <span className="text-xs text-white/40 block mb-1">Pending</span>
                            <span className="text-white font-semibold">$1,204.55</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button className="flex-1 bg-sedna-accent text-white font-medium py-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-900/20 cursor-pointer">
                            Deposit
                        </button>
                        <button className="flex-1 bg-white/5 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-colors border border-white/5 cursor-pointer">
                            Withdraw
                        </button>
                    </div>
                </div>

                {/* Right Side: Win/Loss Chart */}
                <div className="p-6 md:w-2/3 border-t md:border-t-0 md:border-l border-white/5 bg-black/20 flex flex-col justify-center relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <h3 className="text-white font-semibold">Performance Flow</h3>
                            <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>Wins</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>Losses</div>
                            </div>
                        </div>

                        <div className="flex p-1 bg-white/5 rounded-lg border border-white/5">
                            {ranges.map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${timeRange === range
                                        ? 'bg-sedna-accent text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorWins" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLosses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                                    dy={10}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                                <Area
                                    type="monotone"
                                    dataKey="wins"
                                    stroke="#22c55e"
                                    fillOpacity={1}
                                    fill="url(#colorWins)"
                                    strokeWidth={3}
                                    activeDot={false}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="losses"
                                    stroke="#ef4444"
                                    fillOpacity={1}
                                    fill="url(#colorLosses)"
                                    strokeWidth={3}
                                    activeDot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};
