import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';

// Mock data
const favorites = [
    { id: 1, symbol: 'BTC', name: 'Bitcoin', price: 64230.50, change: 2.4, isUp: true },
    { id: 2, symbol: 'ETH', name: 'Ethereum', price: 3450.12, change: -1.2, isUp: false },
    { id: 3, symbol: 'SOL', name: 'Solana', price: 145.60, change: 5.8, isUp: true },
    { id: 4, symbol: 'ADA', name: 'Cardano', price: 0.45, change: 0.5, isUp: true },
];

export const FavoritesBar: React.FC = () => {
    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar">
            <div className="flex space-x-4 min-w-max px-1">
                {/* Add New Favorite Button */}
                <GlassCard className="w-40 h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 group">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-sedna-accent/20 transition-colors">
                        <Plus className="text-white/70 group-hover:text-sedna-accent" size={20} />
                    </div>
                    <span className="text-xs text-white/50 mt-2">Add Favorite</span>
                </GlassCard>

                {favorites.map((crypto) => (
                    <GlassCard key={crypto.id} className="w-48 h-24 p-4 flex flex-col justify-between cursor-pointer hover:border-sedna-accent/30 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${crypto.isUp ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="font-bold text-white">{crypto.symbol}</span>
                            </div>
                            <span className={`text-xs flex items-center ${crypto.isUp ? 'text-green-400' : 'text-red-400'}`}>
                                {crypto.isUp ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                                {Math.abs(crypto.change)}%
                            </span>
                        </div>
                        <div className="mt-2 text-right">
                            <span className="text-xl font-bold text-white tracking-wide">
                                ${crypto.price.toLocaleString()}
                            </span>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};
