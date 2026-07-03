import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Fish, ShoppingBag, BrainCircuit, GraduationCap, Command, Radio, ChevronRight, Activity } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChanged: (tabId: string) => void;
  onOpenCommand: () => void;
  farmStatus?: { weather: string; dissolvedOxygenMgL: number; staffOnDuty: number; boatsActive: number } | null;
}

const NAV_ITEMS = [
  { id: 'mission', label: 'Mission Control', short: 'Mission', icon: Waves },
  { id: 'farm', label: 'Farm Digital Twin', short: 'Farm', icon: Fish },
  { id: 'marketplace', label: 'Marketplace', short: 'Market', icon: ShoppingBag },
  { id: 'intelligence', label: 'Intelligence', short: 'OI', icon: BrainCircuit },
  { id: 'academy', label: 'Academy', short: 'Academy', icon: GraduationCap },
];

export default function Navigation({ activeTab, onTabChanged, onOpenCommand, farmStatus }: NavigationProps) {
  const [time, setTime] = useState(new Date());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearInterval(t); window.removeEventListener('scroll', onScroll); };
  }, []);

  const activeItem = NAV_ITEMS.find(n => n.id === activeTab);
  const isStorm = farmStatus?.weather === 'storm';
  const isLowO2 = farmStatus && farmStatus.dissolvedOxygenMgL < 5.5;

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'py-2' : 'py-3'}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className={`glass-strong rounded-2xl px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 transition-all duration-500 ${scrolled ? 'shadow-2xl' : ''}`}>
            {/* Brand */}
            <button onClick={() => onTabChanged('mission')} className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                />
                <Waves className="w-5 h-5 text-slate-950 relative z-10" strokeWidth={2.5} />
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-display font-bold text-white text-sm leading-none tracking-tight">OLAYO</div>
                <div className="text-[8px] font-mono text-cyan-400/80 tracking-[0.2em] leading-none mt-0.5">FISHERIES · OS</div>
              </div>
            </button>

            {/* Center nav - pill style */}
            <div className="hidden md:flex items-center bg-slate-950/60 border border-cyan-500/10 p-1 rounded-xl relative">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChanged(item.id)}
                    className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${isActive ? 'text-slate-950' : 'text-slate-400 hover:text-white'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg shadow-lg shadow-cyan-500/30"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10 hidden lg:inline">{item.label}</span>
                    <span className="relative z-10 lg:hidden">{item.short}</span>
                  </button>
                );
              })}
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Ambient status chip */}
              {farmStatus && (
                <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/60 border border-cyan-500/10">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isStorm ? 'bg-red-400 animate-pulse' : isLowO2 ? 'bg-orange-400 animate-pulse' : 'bg-emerald-400'}`} />
                    <span className="text-[10px] font-mono text-slate-400">O₂</span>
                    <span className={`text-[10px] font-mono font-bold ${isLowO2 ? 'text-orange-400' : 'text-cyan-300'}`}>{farmStatus.dissolvedOxygenMgL}</span>
                  </div>
                  <div className="w-px h-3 bg-slate-700" />
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-mono text-slate-400">{farmStatus.boatsActive} boats</span>
                  </div>
                </div>
              )}

              {/* Command palette trigger */}
              <button
                onClick={onOpenCommand}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-cyan-500/15 hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all"
              >
                <Command className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">Search · Ask OI</span>
                <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] font-mono text-slate-500">⌘K</kbd>
              </button>

              {/* Mobile nav */}
              <select
                value={activeTab}
                onChange={(e) => onTabChanged(e.target.value)}
                className="md:hidden bg-slate-950 border border-cyan-500/20 rounded-xl px-2 py-1.5 text-xs text-cyan-300 outline-none"
              >
                {NAV_ITEMS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active tab indicator strip - mobile only */}
          <div className="md:hidden mt-2 flex items-center justify-center gap-1.5 text-[10px] font-mono text-cyan-400/70">
            <Activity className="w-3 h-3" />
            <span>{activeItem?.label}</span>
          </div>
        </div>
      </motion.nav>

      {/* Live ticker strip */}
      <div className="relative z-30 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 py-1.5 text-[10px] font-mono text-slate-500"
          >
            <span className="flex items-center gap-1.5 text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
            </span>
            <span className="text-slate-600">·</span>
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} EAT</span>
            <span className="text-slate-600">·</span>
            <span className="text-cyan-400/70">Busiime Cage Grid</span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="hidden sm:inline text-slate-500">Lake Victoria, Uganda</span>
          </motion.div>
        </div>
      </div>
    </>
  );
}
