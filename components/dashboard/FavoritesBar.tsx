import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { GlassCard } from '../ui/GlassCard';
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';

// Mock data - in a real app this would come from props/context
const initialFavorites = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 64230.50, change: 2.4, isUp: true },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3450.12, change: -1.2, isUp: false },
    { id: 'solana', symbol: 'SOL', name: 'Solana', price: 145.60, change: 5.8, isUp: true },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.45, change: 0.5, isUp: true },
];

interface FavoritesBarProps {
    onSelect?: (coin: { name: string; symbol: string; price: number }) => void;
    availableCoins?: any[]; // Keep any for now to avoid massive type imports, ideally CoinData
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({ onSelect, availableCoins = [] }) => {
    const [favorites, setFavorites] = useState(initialFavorites);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string | number } | null>(null);
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [addMenuPos, setAddMenuPos] = useState<{ x: number; y: number } | null>(null);
    const addMenuRef = useRef<HTMLDivElement>(null);

    // Close menus on click outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            setContextMenu(null);

            // Logic to close add menu on click outside
            // We need to check if click is NOT in the button (addMenuRef covers that)
            // AND NOT in the portal dropdown (which we can identify by class or attribute)
            const target = e.target as HTMLElement;
            if (addMenuRef.current && !addMenuRef.current.contains(target)) {
                if (!target.closest('.favorites-portal-menu')) {
                    setIsAddMenuOpen(false);
                }
            }
        };

        const handleScroll = () => {
            // Close on scroll to prevent detached UI
            if (isAddMenuOpen) setIsAddMenuOpen(false);
            if (contextMenu) setContextMenu(null);
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isAddMenuOpen, contextMenu]);

    const handleContextMenu = (e: React.MouseEvent, id: string | number) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, id });
        setIsAddMenuOpen(false);
    };

    const handleDelete = (id: string | number) => {
        setFavorites(prev => prev.filter(f => f.id !== id));
        setContextMenu(null);
    };

    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAddMenuOpen) {
            setIsAddMenuOpen(false);
            return;
        }

        if (addMenuRef.current) {
            const rect = addMenuRef.current.getBoundingClientRect();
            // Position menu below the button
            setAddMenuPos({ x: rect.left, y: rect.bottom });
            setIsAddMenuOpen(true);
            setContextMenu(null);
        }
    };

    const handleAddFavorite = (coin: any) => {
        // Prevent adding duplicates
        if (favorites.some(fav => fav.id === coin.id || fav.symbol === coin.symbol.toUpperCase())) {
            setIsAddMenuOpen(false);
            return;
        }

        const newFavorite = {
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            price: coin.current_price,
            change: coin.price_change_percentage_24h,
            isUp: coin.price_change_percentage_24h >= 0
        };

        setFavorites(prev => [...prev, newFavorite]);
        setIsAddMenuOpen(false);
    };

    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar">
            <div className="flex space-x-4 min-w-max px-1">
                {/* Add New Favorite Button & Dropdown Container */}
                <div className="relative group" ref={addMenuRef}>
                    <GlassCard
                        hoverEffect={false}
                        className="w-40 h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 !shadow-none !translate-y-0"
                        onClick={handleAddClick}
                    >
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            <div className={`h-10 w-10 rounded-full bg-white/10 flex items-center justify-center transition-colors mb-2 ${isAddMenuOpen ? 'bg-sedna-accent/20 text-sedna-accent' : 'group-hover:bg-sedna-accent/20'}`}>
                                <Plus className={`transition-colors ${isAddMenuOpen ? 'text-sedna-accent' : 'text-white/70 group-hover:text-sedna-accent'}`} size={20} />
                            </div>
                            <span className="text-xs text-white/50">Add Favorite</span>
                        </div>
                    </GlassCard>
                </div>

                {favorites.map((crypto) => (
                    <div
                        key={crypto.id}
                        onClick={() => onSelect?.(crypto)}
                        onContextMenu={(e) => handleContextMenu(e, crypto.id)}
                        className={`
                            relative w-48 h-24 p-4 rounded-2xl border border-white/5 bg-sedna-glass/10 backdrop-blur-md 
                            flex flex-col justify-between cursor-pointer 
                            hover:bg-white/5 hover:border-sedna-accent/30 transition-all
                            ${contextMenu?.id === crypto.id ? 'border-sedna-accent ring-1 ring-sedna-accent' : ''}
                        `}
                    >
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
                    </div>
                ))}
            </div>

            {/* GLOBAL PORTAL-LIKE OVERLAYS */}
            {/* We render these into document.body to break out of any overflow containers completely */}

            {isAddMenuOpen && addMenuPos && createPortal(
                <div
                    className="favorites-portal-menu fixed z-[9999] w-64 max-h-64 overflow-y-auto bg-sedna-dark border border-white/10 rounded-xl shadow-2xl p-2 no-scrollbar animate-in fade-in zoom-in-95 duration-100"
                    style={{
                        left: addMenuPos.x,
                        top: addMenuPos.y + 10 // Add a little offset
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-xs font-semibold text-gray-500 mb-2 px-2 uppercase tracking-wider sticky top-0 bg-sedna-dark py-1">Available Assets</div>
                    {availableCoins.length > 0 ? (
                        availableCoins.map(coin => (
                            <button
                                key={coin.id}
                                onClick={() => handleAddFavorite(coin)}
                                className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors group text-left"
                            >
                                <div className="flex items-center gap-2">
                                    <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                                    <div>
                                        <span className="block text-sm text-gray-300 group-hover:text-white font-medium">{coin.symbol.toUpperCase()}</span>
                                        <span className="block text-[10px] text-gray-500">{coin.name}</span>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 font-mono">${coin.current_price.toLocaleString()}</span>
                            </button>
                        ))
                    ) : (
                        <div className="p-4 text-center text-xs text-gray-500">
                            Loading coins...
                        </div>
                    )}
                </div>,
                document.body
            )}

            {contextMenu && createPortal(
                <div
                    className="favorites-portal-menu fixed z-[9999] bg-sedna-dark border border-white/10 rounded-lg shadow-xl p-1 animate-in fade-in zoom-in-95 duration-100"
                    style={{
                        left: contextMenu.x,
                        top: contextMenu.y,
                        minWidth: '100px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => handleDelete(contextMenu.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-white/5 rounded-md transition-colors"
                    >
                        <Trash2 size={12} />
                        Delete
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
};
