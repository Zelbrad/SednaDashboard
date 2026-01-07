import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ArrowLeftRight, ChevronDown, RefreshCw, Wallet, DollarSign } from 'lucide-react';

type Tab = 'buy' | 'sell' | 'convert';

export const TradePanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('buy');

    return (
        <GlassCard className="h-full p-6 flex flex-col relative overflow-hidden" hoverEffect={false}>
            {/* Decorational Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="flex bg-black/20 p-1 rounded-xl mb-6 relative z-10">
                {(['buy', 'sell', 'convert'] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all duration-300 cursor-pointer ${activeTab === tab
                            ? 'bg-sedna-accent text-white shadow-lg'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 flex flex-col justify-center relative z-10">
                {activeTab === 'convert' ? (
                    <div className="space-y-4">
                        {/* From Input */}
                        <div className="bg-sedna-panel border border-white/5 rounded-2xl p-4">
                            <div className="flex justify-between text-xs text-white/40 mb-2">
                                <span>From</span>
                                <span>Balance: 2.45 BTC</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <input
                                    type="text"
                                    placeholder="0.00"
                                    className="bg-transparent text-2xl font-bold text-white outline-none w-full placeholder-white/20"
                                />
                                <button className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="w-5 h-5 rounded-full bg-orange-500" />
                                    <span className="font-semibold text-white">BTC</span>
                                    <ChevronDown size={14} className="text-white/50" />
                                </button>
                            </div>
                        </div>

                        {/* Swap Indicator */}
                        <div className="flex justify-center -my-3 relative z-10">
                            <button className="bg-sedna-dark border border-white/10 p-2 rounded-xl hover:bg-white/5 text-sedna-accent transition-colors shadow-lg cursor-pointer">
                                <ArrowLeftRight size={18} />
                            </button>
                        </div>

                        {/* To Input */}
                        <div className="bg-sedna-panel border border-white/5 rounded-2xl p-4">
                            <div className="flex justify-between text-xs text-white/40 mb-2">
                                <span>To</span>
                                <span>Balance: 145.2 ETH</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <input
                                    type="text"
                                    placeholder="0.00"
                                    className="bg-transparent text-2xl font-bold text-white outline-none w-full placeholder-white/20"
                                />
                                <button className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="w-5 h-5 rounded-full bg-blue-500" />
                                    <span className="font-semibold text-white">ETH</span>
                                    <ChevronDown size={14} className="text-white/50" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 flex justify-between items-center text-sm">
                            <span className="text-white/40">Rate</span>
                            <span className="text-white font-medium">1 BTC ≈ 18.42 ETH</span>
                        </div>
                    </div>
                ) : (
                    // Buy / Sell Layout
                    <div className="space-y-4">
                        <div className="bg-sedna-panel border border-white/5 rounded-2xl p-4">
                            <div className="flex justify-between text-xs text-white/40 mb-2">
                                <span>Amount</span>
                                <span>Max: $12k</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-2xl font-bold text-white">
                                    <DollarSign size={20} className="text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        className="bg-transparent outline-none w-full placeholder-white/20"
                                    />
                                </div>
                                <button className="text-sedna-accent text-sm font-semibold uppercase cursor-pointer">Max</button>
                            </div>
                        </div>

                        <div className="bg-sedna-panel border border-white/5 rounded-2xl p-4">
                            <div className="flex justify-between text-xs text-white/40 mb-2">
                                <span>Receive</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-white/50">0.00</span>
                                <button className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="w-5 h-5 rounded-full bg-orange-500" />
                                    <span className="font-semibold text-white">BTC</span>
                                    <ChevronDown size={14} className="text-white/50" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button className="mt-6 w-full bg-sedna-accent text-white font-bold py-4 rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-900/30 flex items-center justify-center gap-2 group cursor-pointer">
                <span className="capitalize">{activeTab === 'convert' ? 'Preview Swap' : `${activeTab} Now`}</span>
                <ArrowLeftRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </GlassCard>
    );
};
