import React from 'react';
import { Waves, Fish, ShoppingBag, BrainCircuit, GraduationCap } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChanged: (tabId: string) => void;
  cartCount: number;
}

export default function Navigation({ activeTab, onTabChanged, cartCount }: NavigationProps) {
  const navItems = [
    { id: 'mission', label: 'Mission Control', icon: Waves },
    { id: 'farm', label: 'Farm', icon: Fish },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'intelligence', label: 'Intelligence', icon: BrainCircuit },
    { id: 'academy', label: 'Academy', icon: GraduationCap },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/75 border-b border-cyan-500/20 backdrop-blur-md px-4 sm:px-6 py-3 flex justify-between items-center transition-all">
      <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => onTabChanged('mission')}>
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Waves className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <span className="font-display font-bold text-white text-sm sm:text-base tracking-tight block">OLAYO FISHERIES</span>
          <span className="text-[9px] font-mono text-cyan-400 block tracking-widest leading-none font-bold">LIMITED</span>
        </div>
      </div>

      <div className="hidden lg:flex items-center bg-slate-900/60 border border-cyan-500/10 p-1 rounded-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChanged(item.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 relative ${isActive ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-400/20 shadow-md' : 'text-slate-400 hover:text-white border border-transparent'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
              {item.id === 'marketplace' && cartCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      <div className="lg:hidden flex items-center gap-3">
        <select
          value={activeTab}
          onChange={(e) => onTabChanged(e.target.value)}
          className="bg-slate-900 border border-cyan-500/20 rounded-xl px-3 py-1.5 text-xs text-cyan-300 outline-none"
        >
          {navItems.map(item => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </div>
    </nav>
  );
}
