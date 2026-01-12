import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import AnimatedList from '../AnimatedList';
import { GlassCard } from '../ui/GlassCard';
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';

// Mock data removed (lifted to App.tsx)

interface FavoritesBarProps {
    onSelect?: (coin: { name: string; symbol: string; price: number }) => void;
    availableCoins?: any[];
    favorites: any[];
    onToggleFavorite: (coin: any) => void;
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({ onSelect, availableCoins = [], favorites, onToggleFavorite }) => {
    // Local state for UI only
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string | number } | null>(null);
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [addMenuPos, setAddMenuPos] = useState<{ x: number; y: number } | null>(null);
    const addMenuRef = useRef<HTMLDivElement>(null);

    // Responsive Max Items
    const [maxItems, setMaxItems] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width > 3000) {
                setMaxItems(8);
            } else if (width > 2900) {
                setMaxItems(7);
            } else if (width > 2500) {
                setMaxItems(6);
            } else if (width > 1770) {
                setMaxItems(5);
            } else {
                setMaxItems(4);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close menus on click outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            setContextMenu(null);

            // Logic to close add menu on click outside
            const target = e.target as HTMLElement;
            if (addMenuRef.current && !addMenuRef.current.contains(target)) {
                if (!target.closest('.favorites-portal-menu')) {
                    setIsAddMenuOpen(false);
                }
            }
        };

        // ... existing scroll handler ...
        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement;
            // Don't close if scrolling inside the favorites menu
            if (target.closest && target.closest('.favorites-portal-menu')) {
                return;
            }
            if (isAddMenuOpen) setIsAddMenuOpen(false);
            if (contextMenu) setContextMenu(null);
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('scroll', handleScroll, true); // Capture phase is important here

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
        onToggleFavorite({ id });
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
        if (favorites.some(fav => fav.id === coin.id)) {
            setIsAddMenuOpen(false);
            return;
        }

        // Limit to max items
        if (favorites.length >= maxItems) {
            setIsAddMenuOpen(false);
            return;
        }

        onToggleFavorite(coin);
        setIsAddMenuOpen(false);
    };

    return (
        <div className="w-full pb-4 pt-2">
            <div className="flex gap-4 px-1 overflow-x-auto no-scrollbar pb-2">
                {/* Add New Favorite Button & Dropdown Container */}
                <div className="relative group w-28 md:w-40 shrink-0" ref={addMenuRef}>
                    <GlassCard
                        hoverEffect={false}
                        className="w-full h-20 md:h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 !shadow-none !translate-y-0"
                        onClick={handleAddClick}
                    >
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            <div className={`h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/10 flex items-center justify-center transition-colors mb-2 ${isAddMenuOpen ? 'bg-sedna-accent/20 text-sedna-accent' : 'group-hover:bg-sedna-accent/20'}`}>
                                <Plus className={`transition-colors ${isAddMenuOpen ? 'text-sedna-accent' : 'text-white/70 group-hover:text-sedna-accent'}`} size={20} />
                            </div>
                            <span className="text-[10px] md:text-xs text-white/50">Add Favorite</span>
                        </div>
                    </GlassCard>
                </div>

                <div className={`flex md:grid gap-4 transition-all duration-300 shrink-0 md:shrink md:flex-1 ${maxItems === 8 ? 'md:grid-cols-8' :
                        maxItems === 7 ? 'md:grid-cols-7' :
                            maxItems === 6 ? 'md:grid-cols-6' :
                                maxItems === 5 ? 'md:grid-cols-5' :
                                    'md:grid-cols-4'
                    }`}>
                    {favorites.slice(0, maxItems).map((crypto) => (
                        <div
                            key={crypto.id}
                            onClick={() => onSelect?.(crypto)}
                            onContextMenu={(e) => handleContextMenu(e, crypto.id)}
                            className={`
                                relative w-28 md:w-full h-20 md:h-24 p-3 md:p-4 rounded-2xl border border-white/5 bg-sedna-glass/10 backdrop-blur-md 
                                flex flex-col justify-between cursor-pointer shrink-0
                                hover:bg-white/5 hover:border-sedna-accent/30 transition-all
                                ${contextMenu?.id === crypto.id ? 'border-sedna-accent ring-1 ring-sedna-accent' : ''}
                            `}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${crypto.isUp ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="font-bold text-sm md:text-base text-white">{crypto.symbol}</span>
                                </div>
                                <span className={`text-[10px] md:text-xs flex items-center ${crypto.isUp ? 'text-green-400' : 'text-red-400'}`}>
                                    {crypto.isUp ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                                    {Math.abs(crypto.change)}%
                                </span>
                            </div>
                            <div className="mt-2 text-right">
                                <span className="text-lg md:text-xl font-bold text-white tracking-wide">
                                    ${crypto.price.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Empty Slots Placeholders */}
                    {Array.from({ length: Math.max(0, maxItems - favorites.length) }).map((_, index) => (
                        <div
                            key={`empty-${index}`}
                            onClick={handleAddClick}
                            className="w-28 md:w-full h-20 md:h-24 rounded-2xl border border-dashed border-white/5 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group shrink-0"
                        >
                            <Plus className="text-white/20 group-hover:text-white/40 mb-1" size={24} />
                            <span className="text-[10px] md:text-xs text-white/30 group-hover:text-white/50">Empty Slot</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* GLOBAL PORTAL-LIKE OVERLAYS */}
            {/* We render these into document.body to break out of any overflow containers completely */}

            {isAddMenuOpen && addMenuPos && createPortal(
                <div
                    className="favorites-portal-menu fixed z-[9999] w-72 bg-sedna-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                    style={{
                        left: addMenuPos.x,
                        top: addMenuPos.y + 10 // Add a little offset
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-xs font-semibold text-gray-500 px-4 pt-3 pb-2 uppercase tracking-wider bg-sedna-dark z-10 border-b border-white/5">Available Assets</div>
                    {availableCoins.length > 0 ? (
                        <div className="p-2">
                            <AnimatedList
                                items={availableCoins}
                                onItemSelect={handleAddFavorite}
                                showGradients={false}
                                displayScrollbar={true}
                                className="w-full"
                                listClassName="max-h-[220px] overflow-y-auto !scrollbar-thin"
                                itemClassName="bg-transparent p-0"
                                renderItem={(coin, index, isSelected) => (
                                    <div className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors group text-left ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full shadow-sm" />
                                            <div>
                                                <span className="block text-sm text-gray-200 group-hover:text-white font-semibold tracking-tight">{coin.symbol.toUpperCase()}</span>
                                                <span className="block text-[10px] text-gray-500 font-medium">{coin.name}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono font-medium">${coin.current_price.toLocaleString()}</span>
                                    </div>
                                )}
                            />
                        </div>
                    ) : (
                        <div className="p-8 text-center text-xs text-gray-500">
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
