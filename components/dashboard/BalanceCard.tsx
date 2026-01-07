import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';

export const BalanceCard: React.FC = () => {
    return (
        <GlassCard className="p-6 h-full flex flex-col justify-between relative overflow-hidden">
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

                <div className="mb-2">
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
            <div className="grid grid-cols-2 gap-3 mt-auto">
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
            <div className="mt-4 flex gap-3">
                <button className="flex-1 bg-sedna-accent text-white font-medium py-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-900/20">
                    Deposit
                </button>
                <button className="flex-1 bg-white/5 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                    Withdraw
                </button>
            </div>
        </GlassCard>
    );
};
