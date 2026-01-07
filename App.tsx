import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Background } from './components/layout/Background';
import { MarketSummary } from './components/dashboard/MarketSummary';
import { SecondaryMetrics } from './components/dashboard/SecondaryMetrics';
import { CoinList } from './components/dashboard/CoinList';
import { fetchMarketData } from './services/api';
import { CoinData } from './types';
import { Loader2, Search, Filter, SlidersHorizontal, ArrowDownToLine, Menu } from 'lucide-react';
import { Logo } from './components/ui/Logo';

function App() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          <MarketSummary />
          <SecondaryMetrics />

          {/* Asset List Section Header */}
          <div className="sticky top-0 z-30 bg-sedna-dark/80 backdrop-blur-xl py-4 mb-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-white/5 md:border-none md:bg-transparent md:backdrop-blur-none mt-12">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold mr-4">Market Assets</h2>
              <div className="relative group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-sedna-accent transition-colors" size={16} />
                 <input 
                   type="text" 
                   placeholder="Search assets..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-9 pr-4 py-2 bg-sedna-glass border border-sedna-glassBorder rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sedna-accent/50 w-full sm:w-64 transition-all"
                 />
              </div>

              <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block"></div>

              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-sedna-glassBorder bg-sedna-glass hover:bg-white/5 text-sm text-gray-300 transition-colors">
                <SlidersHorizontal size={14} />
                View
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-sedna-glassBorder bg-sedna-glass hover:bg-white/5 text-sm text-gray-300 transition-colors">
                <Filter size={14} />
                Filter
              </button>
            </div>
          </div>

          {/* Main List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-sedna-accent">
              <Loader2 size={32} className="animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Syncing ledger...</p>
            </div>
          ) : (
            <div className="bg-sedna-glass/30 border border-sedna-glassBorder rounded-xl overflow-hidden backdrop-blur-sm min-h-[500px]">
              {filteredCoins.length > 0 ? (
                <CoinList coins={filteredCoins} />
              ) : (
                <div className="p-20 text-center text-gray-500">
                  No assets found.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;