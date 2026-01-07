import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Background } from './components/layout/Background';
import { MarketSummary } from './components/dashboard/MarketSummary';
import { SecondaryMetrics } from './components/dashboard/SecondaryMetrics';
import { CoinList } from './components/dashboard/CoinList';
import { FavoritesBar } from './components/dashboard/FavoritesBar';
import { BalanceCard } from './components/dashboard/BalanceCard';
import { TradePanel } from './components/dashboard/TradePanel';
import { WhaleWatch } from './components/dashboard/WhaleWatch';
import { fetchMarketData } from './services/api';
import { CoinData } from './types';
import { Loader2, Search, Filter, SlidersHorizontal, ArrowDownToLine, Menu } from 'lucide-react';
import { Logo } from './components/ui/Logo';

// ... imports

// Mock favorites moved here
const initialFavorites = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 64230.50, change: 2.4, isUp: true },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3450.12, change: -1.2, isUp: false },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 145.60, change: 5.8, isUp: true },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.45, change: 0.5, isUp: true },
];

function App() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinSelection>({ name: 'Bitcoin', symbol: 'BTC', price: 64230.50 });
  const [favorites, setFavorites] = useState(initialFavorites);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [data] = await Promise.all([
        fetchMarketData(1),
        new Promise(resolve => setTimeout(resolve, 800))
      ]);
      setCoins(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const toggleFavorite = (coin: any) => {
    if (favorites.some(fav => fav.id === coin.id)) {
      setFavorites(prev => prev.filter(f => f.id !== coin.id));
    } else {
      const newFavorite = {
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change: coin.price_change_percentage_24h,
        isUp: coin.price_change_percentage_24h >= 0
      };
      setFavorites(prev => [...prev, newFavorite]);
    }
  };

  // ...

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white font-sans selection:bg-sedna-accent/30">
      <Background />
      <Sidebar />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full z-40 bg-sedna-glass backdrop-blur-xl border-b border-sedna-glassBorder p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-400">
          <Menu />
        </button>
      </div>

      <main className={`
        relative z-10 transition-all duration-300
        lg:pl-64 min-h-screen
        p-4 lg:p-10
        ${mobileMenuOpen ? 'pt-20' : 'pt-20 lg:pt-10'}
      `}>
        <div className="w-full max-w-[95%] xl:max-w-[90%] 2xl:max-w-[85%] mx-auto">

          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-semibold text-white tracking-tight">Anemoy Liquid Treasury Fund 1</h1>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-sm font-medium hover:bg-white/10 transition-colors">
                <ArrowDownToLine size={16} />
                Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sedna-accent text-white text-sm font-medium shadow-[0_0_15px_rgba(255,0,0,0.4)] hover:shadow-[0_0_25px_rgba(255,0,0,0.6)] hover:scale-105 transition-all">
                Connect Wallet
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-6 border-b border-white/5 mb-8 overflow-x-auto">
            {['Overview', 'Assets', 'Liquidity', 'Reports', 'Data', 'Fees'].map((item, i) => (
              <button
                key={item}
                className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${i === 2 ? 'text-white border-b-2 border-sedna-accent' : 'text-sedna-textMuted hover:text-white'}`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Favorites Bar */}
          <div className="mb-8">
            <FavoritesBar
              onSelect={(coin) => setSelectedCoin(coin)}
              availableCoins={coins}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

            {/* Left Main Column */}
            <div className="xl:col-span-3 space-y-6">
              <MarketSummary selectedCoin={selectedCoin} />
              <SecondaryMetrics />

              {/* ... Header ... */}

              {/* Main List */}
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-sedna-accent">
                  <Loader2 size={32} className="animate-spin mb-3" />
                  <p className="text-gray-500 text-sm">Syncing ledger...</p>
                </div>
              ) : (
                <div className="bg-sedna-glass/30 border border-sedna-glassBorder rounded-xl overflow-hidden backdrop-blur-sm min-h-[500px]">
                  {filteredCoins.length > 0 ? (
                    <CoinList
                      coins={filteredCoins}
                      onSelect={(coin) => setSelectedCoin({
                        name: coin.name,
                        symbol: coin.symbol,
                        price: coin.current_price
                      })}
                      favorites={favorites.map(f => f.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ) : (
                    <div className="p-20 text-center text-gray-500">
                      No assets found.
                    </div>
                  )}
                </div>
              )}
            </div>


            {/* Right Side Column */}
            < div className="xl:col-span-1 space-y-6" >
              <div className="h-auto">
                <BalanceCard />
              </div>
              <div className="h-auto">
                <TradePanel />
              </div>
              <div className="h-[500px]">
                <WhaleWatch />
              </div>
            </div >
          </div >
        </div >
      </main >
    </div >
  );
}


interface CoinSelection {
  name: string;
  symbol: string;
  price: number;
}

export default App;