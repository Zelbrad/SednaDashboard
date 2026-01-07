import React from 'react';
import { Layers, Activity, Settings, Bell } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-sedna-dark/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow duration-300">
              <Layers className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              SEDNA
            </span>
          </div>

          {/* Nav Items (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {['Dashboard', 'Market', 'Portfolio', 'News'].map((item, idx) => (
              <button 
                key={item}
                className={`text-sm font-medium transition-colors hover:text-cyan-400 ${idx === 0 ? 'text-white' : 'text-gray-400'}`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
              <Activity size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/10 ring-2 ring-transparent hover:ring-cyan-500/50 transition-all cursor-pointer" />
          </div>

        </div>
      </div>
    </nav>
  );
};