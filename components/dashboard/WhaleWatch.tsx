import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Disc, ArrowRight, AlertTriangle } from 'lucide-react';

interface Transaction {
    id: string;
    amount: number;
    currency: 'BTC' | 'ETH' | 'USDT';
    from: string;
    to: string;
    isWhale: boolean;
    time: string;
}

const generateTx = (): Transaction => {
    const isWhale = Math.random() > 0.7;
    const currency = Math.random() > 0.5 ? 'BTC' : 'ETH';
    const amount = isWhale
        ? (currency === 'BTC' ? Math.random() * 50 + 10 : Math.random() * 500 + 100)
        : (currency === 'BTC' ? Math.random() * 2 : Math.random() * 10);

    return {
        id: Math.random().toString(36).substring(7),
        amount: parseFloat(amount.toFixed(4)),
        currency,
        from: `0x${Math.random().toString(16).substring(2, 6)}...`,
        to: `0x${Math.random().toString(16).substring(2, 6)}...`,
        isWhale,
        time: 'Just now'
    };
};

export const WhaleWatch: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // Initial population
        setTransactions(Array(5).fill(null).map(generateTx));

        const interval = setInterval(() => {
            setTransactions(prev => [generateTx(), ...prev.slice(0, 6)]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <GlassCard className="h-full p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Disc className="text-blue-400" size={20} />
                </div>
                <div>
                    <h3 className="text-white font-bold">Whale Watch</h3>
                    <p className="text-xs text-blue-400 flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Live Feed
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-visible space-y-3">
                {transactions.map((tx) => (
                    <div key={tx.id} className={`p-3 rounded-xl border flex flex-col gap-2 transition-all animate-in slide-in-from-top-2 fade-in duration-500 ${tx.isWhale
                        ? 'bg-gradient-to-r from-sedna-accent/10 to-transparent border-sedna-accent/20'
                        : 'bg-white/5 border-white/5'
                        }`}>
                        <div className="flex justify-between items-start w-full">
                            <div className="flex flex-col">
                                <span className="text-xs text-white/40 font-mono">{tx.time}</span>
                                <div className="flex items-center gap-2 font-bold text-white text-sm whitespace-nowrap">
                                    {tx.isWhale && <AlertTriangle size={12} className="text-sedna-accent" />}
                                    <span>{tx.amount} {tx.currency}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-white/40 w-full bg-black/20 p-1.5 rounded-lg">
                            <span className="font-mono truncate flex-1">{tx.from}</span>
                            <ArrowRight size={10} className="flex-shrink-0" />
                            <span className="font-mono truncate flex-1 text-right">{tx.to}</span>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
};
