
import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ArrowDown, MoreHorizontal } from 'lucide-react';

interface Order {
    price: string;
    amount: string;
    total: string;
    type: 'ask' | 'bid';
    fillPercent: number;
}

export const OrderBook: React.FC = () => {
    // Mock Data
    const asks: Order[] = [
        { price: '100,304.4', amount: '0.30000000', total: '7.10458034', type: 'ask', fillPercent: 30 },
        { price: '100,303.0', amount: '2.39254729', total: '6.80458034', type: 'ask', fillPercent: 80 },
        { price: '100,300.9', amount: '2.39259822', total: '4.41203305', type: 'ask', fillPercent: 80 },
        { price: '100,291.3', amount: '1.53320000', total: '2.01943483', type: 'ask', fillPercent: 50 },
        { price: '100,282.6', amount: '0.28756000', total: '0.48623483', type: 'ask', fillPercent: 10 },
        { price: '100,281.5', amount: '0.01730065', total: '0.19867483', type: 'ask', fillPercent: 5 },
        { price: '100,276.1', amount: '0.10840023', total: '0.18137418', type: 'ask', fillPercent: 15 },
        { price: '100,270.1', amount: '0.01599851', total: '0.07297395', type: 'ask', fillPercent: 2 },
    ];

    const bids: Order[] = [
        { price: '100,234.3', amount: '0.54668852', total: '0.54668852', type: 'bid', fillPercent: 20 },
        { price: '100,234.2', amount: '0.03002100', total: '0.57670952', type: 'bid', fillPercent: 5 },
        { price: '100,221.6', amount: '0.14349904', total: '0.72020856', type: 'bid', fillPercent: 10 },
        { price: '100,219.7', amount: '0.04443074', total: '0.76463930', type: 'bid', fillPercent: 8 },
        { price: '100,217.3', amount: '0.23000000', total: '0.99463930', type: 'bid', fillPercent: 25 },
        { price: '100,215.4', amount: '0.14349904', total: '1.13813834', type: 'bid', fillPercent: 15 },
        { price: '100,214.5', amount: '0.02879434', total: '1.16693268', type: 'bid', fillPercent: 4 },
        { price: '100,208.2', amount: '0.00949760', total: '1.17643028', type: 'bid', fillPercent: 2 },
    ];

    return (
        <GlassCard className="h-full flex flex-col overflow-hidden" hoverEffect={false}>
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">Order book</h3>
                    <span className="text-xs text-sedna-textMuted flex items-center gap-1 cursor-pointer hover:text-white">
                        BTC/EUR <ArrowDown size={12} />
                    </span>
                </div>
                <div className="flex gap-2 text-sedna-textMuted">
                    <button className="hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-hidden flex flex-col text-xs font-mono">
                {/* Column Headers */}
                <div className="grid grid-cols-3 px-4 py-2 text-sedna-textMuted uppercase tracking-wider text-[10px]">
                    <div className="text-left">Price</div>
                    <div className="text-right">Quantity</div>
                    <div className="text-right">Total</div>
                </div>

                {/* Asks (Sells) */}
                <div className="flex-1 flex flex-col justify-end pb-2 space-y-[1px]">
                    {asks.slice().reverse().map((order, i) => ( // Reverse to show lowest ask at bottom
                        <div key={i} className="grid grid-cols-3 px-4 py-0.5 hover:bg-white/5 relative group cursor-pointer">
                            {/* Background fill based on volume */}
                            <div
                                className="absolute right-0 top-0 bottom-0 bg-red-500/10 transition-all"
                                style={{ width: `${order.fillPercent}%` }}
                            />
                            <div className="relative z-10 text-red-400">{order.price}</div>
                            <div className="relative z-10 text-white/80 text-right">{order.amount}</div>
                            <div className="relative z-10 text-white/40 text-right">{order.total}</div>
                        </div>
                    ))}
                </div>

                {/* Spread */}
                <div className="py-2 my-1 border-y border-white/5 flex justify-center items-center gap-2 bg-white/5">
                    <span className="text-lg font-bold text-white">100,234.2</span>
                    <span className="text-xs text-green-400">Spread: 5.3 (0.0053%)</span>
                </div>

                {/* Bids (Buys) */}
                <div className="flex-1 pt-2 space-y-[1px]">
                    {bids.map((order, i) => (
                        <div key={i} className="grid grid-cols-3 px-4 py-0.5 hover:bg-white/5 relative group cursor-pointer">
                            {/* Background fill based on volume */}
                            <div
                                className="absolute right-0 top-0 bottom-0 bg-green-500/10 transition-all"
                                style={{ width: `${order.fillPercent}%` }}
                            />
                            <div className="relative z-10 text-green-400">{order.price}</div>
                            <div className="relative z-10 text-white/80 text-right">{order.amount}</div>
                            <div className="relative z-10 text-white/40 text-right">{order.total}</div>
                        </div>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
};
