import React from 'react';
import { Home, BarChart2, Wallet, CreditCard, Settings, LogOut, ArrowRightLeft } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'Home', onTabChange }) => {
  const navItems = [
    { icon: Home, label: 'Dashboard', id: 'Dashboard' },
    { icon: ArrowRightLeft, label: 'Transactions', id: 'Transactions' },
    { icon: BarChart2, label: 'Market', id: 'Market' },
    { icon: Wallet, label: 'Accounts', id: 'Accounts' },
    { icon: CreditCard, label: 'Cards', id: 'Cards' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen border-r border-sedna-glassBorder bg-sedna-glass backdrop-blur-md flex flex-col z-50 hidden lg:flex transition-all duration-300 ease-in-out w-20 hover:w-64 group overflow-hidden">
      {/* Logo */}
      <div className="h-24 flex items-center pl-6 transition-all">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] shrink-0" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 space-y-1 transition-all">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange?.(item.id)}
            className={`
              w-full flex items-center pl-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer overflow-hidden
              ${activeTab === item.id
                ? 'bg-sedna-accentDim text-sedna-accent shadow-[0_0_10px_rgba(255,0,0,0.1)]'
                : 'text-sedna-textMuted hover:text-white hover:bg-white/5'
              }
            `}
          >
            <item.icon size={20} className="shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-[150px] ml-0 group-hover:ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap text-left">
              {item.label}
            </span>
          </button>
        ))}

        <div className="pt-8 px-0">
          <h3 className="text-[10px] font-semibold text-sedna-textMuted uppercase tracking-wider mb-4 opacity-0 group-hover:opacity-100 transition-opacity pl-6 whitespace-nowrap overflow-hidden h-4 group-hover:h-auto">Workflows</h3>
          <button className="w-full flex items-center pl-4 py-3 rounded-lg text-sm font-medium text-sedna-textMuted hover:text-white hover:bg-white/5 transition-colors overflow-hidden">
            <Settings size={20} className="shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-[150px] ml-0 group-hover:ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap text-left">Settings</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 group-hover:p-6 border-t border-sedna-glassBorder">
        <div className="flex items-center pl-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 border border-white/10 shrink-0" />
          <div className="flex-1 overflow-hidden opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-[150px] ml-0 group-hover:ml-3 transition-all duration-300">
            <p className="text-sm font-medium text-white truncate">Guillermo Pérez</p>
            <p className="text-xs text-gray-500 truncate">Pro Plan</p>
          </div>
          <LogOut size={18} className="text-gray-500 cursor-pointer hover:text-white shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:block ml-2" />
        </div>
      </div>
    </aside>
  );
};
