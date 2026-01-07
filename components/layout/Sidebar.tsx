import React from 'react';
import { Home, BarChart2, Wallet, CreditCard, Settings, LogOut, ArrowRightLeft } from 'lucide-react';
import { Logo } from '../ui/Logo';

export const Sidebar: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: ArrowRightLeft, label: 'Transactions', active: true },
    { icon: BarChart2, label: 'Market', active: false },
    { icon: Wallet, label: 'Accounts', active: false },
    { icon: CreditCard, label: 'Cards', active: false },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-sedna-glassBorder bg-sedna-glass backdrop-blur-md flex flex-col z-50 hidden lg:flex">
      {/* Logo */}
      <div className="p-8 pb-8">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${item.active 
                ? 'bg-sedna-accentDim text-sedna-accent shadow-[0_0_10px_rgba(255,0,0,0.1)]' 
                : 'text-sedna-textMuted hover:text-white hover:bg-white/5'
              }
            `}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}

        <div className="pt-8 px-4">
          <h3 className="text-xs font-semibold text-sedna-textMuted uppercase tracking-wider mb-4">Workflows</h3>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sedna-textMuted hover:text-white hover:bg-white/5 transition-colors">
             <Settings size={18} />
             <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-sedna-glassBorder">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 border border-white/10" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Mercury Design</p>
            <p className="text-xs text-gray-500 truncate">Pro Plan</p>
          </div>
          <LogOut size={16} className="text-gray-500 cursor-pointer hover:text-white" />
        </div>
      </div>
    </aside>
  );
};