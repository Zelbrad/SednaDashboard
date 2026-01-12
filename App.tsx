import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Background } from './components/layout/Background';
import { MarketSummary } from './components/dashboard/MarketSummary';
import { CoinList } from './components/dashboard/CoinList';
import { FavoritesBar } from './components/dashboard/FavoritesBar';
import { TradePanel } from './components/dashboard/TradePanel';
import { WhaleWatch } from './components/dashboard/WhaleWatch';
import { fetchMarketData } from './services/api';
import { CoinData } from './types';
import { Accounts } from './components/dashboard/Accounts';
import { Transactions } from './components/dashboard/Transactions';
import { Loader2, Search, Filter, SlidersHorizontal, ArrowDownToLine, Menu } from 'lucide-react';
import { Logo } from './components/ui/Logo';

// Mock favorites moved here
const initialFavorites = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 64230.50, change: 2.4, isUp: true, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3450.12, change: -1.2, isUp: false, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 145.60, change: 5.8, isUp: true, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.45, change: 0.5, isUp: true, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
];

interface CoinSelection {
  name: string;
  symbol: string;
  price: number;
  image?: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinSelection>({ name: 'Bitcoin', symbol: 'BTC', price: 64230.50, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' });
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
        isUp: coin.price_change_percentage_24h >= 0,
        image: coin.image
      };
      setFavorites(prev => [...prev, newFavorite]);
    }
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white font-sans selection:bg-sedna-accent/30">
      <Background />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

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
        lg:pl-20 min-h-screen
        p-4 lg:p-6
        ${mobileMenuOpen ? 'pt-20' : 'pt-20 lg:pt-10'}
      `}>
        <div className="w-full max-w-[98%] xl:max-w-[98%] 2xl:max-w-[98%] mx-auto">


          {activeTab === 'Accounts' ? (
            <Accounts />
          ) : activeTab === 'Transactions' ? (
            <Transactions />
          ) : (
            <>
              {/* Dashboard Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h1 className="text-3xl font-semibold text-white tracking-tight ml-[3px]">Dashboard</h1>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer">
                    <ArrowDownToLine size={16} />
                    Report
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sedna-accent text-white text-sm font-medium shadow-[0_0_15px_rgba(255,0,0,0.4)] hover:shadow-[0_0_25px_rgba(255,0,0,0.6)] hover:scale-105 transition-all cursor-pointer">
                    Connect Wallet
                  </button>
                </div>
              </div>

              {/* Favorites Bar */}
              <div className="">
                <FavoritesBar
                  onSelect={(coin) => setSelectedCoin(coin)}
                  availableCoins={coins}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

                {/* Left Main Column */}
                <div className="xl:col-span-3 space-y-4">
                  <MarketSummary selectedCoin={selectedCoin} />

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
                            price: coin.current_price,
                            image: coin.image
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
                <div className="xl:col-span-1 flex flex-col gap-4">
                  <div className="h-auto hidden min-[2800px]:block shrink-0">
                    <TradePanel />
                  </div>
                  <div className="flex-1 min-h-[500px]">
                    <WhaleWatch />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}


interface CoinSelection {
  name: string;
  symbol: string;
  price: number;
  image?: string;
}

export default App;