import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Fish, ShoppingBag, BrainCircuit, GraduationCap, Command, Radio, ChevronRight, Hop as Home, Sparkles, Clock, ArrowRight, Activity, Droplets, Wind, Thermometer, Users, Ship as ShipIcon, Search, X } from 'lucide-react';

interface CommandDockProps {
  activeTab: string;
  onTabChanged: (tab: string) => void;
  onOpenCommand: () => void;
  farmStatus: {
    weather: string;
    dissolvedOxygenMgL: number;
    staffOnDuty: number;
    boatsActive: number;
    timeOfDay: string;
    windKnots: number;
    lakeTempC: number;
  } | null;
  recentSearches: string[];
  onAskOI: (prompt: string) => void;
}

const DOCK_ITEMS = [
  { id: 'mission', label: 'Mission', icon: Waves, hint: 'Command center' },
  { id: 'farm', label: 'Farm', icon: Fish, hint: 'Digital twin' },
  { id: 'marketplace', label: 'Market', icon: ShoppingBag, hint: 'Seafood exchange' },
  { id: 'intelligence', label: 'OI', icon: BrainCircuit, hint: 'AI workforce' },
  { id: 'academy', label: 'Academy', icon: GraduationCap, hint: 'Learning labs' },
];

const BREADCRUMBS: Record<string, string[]> = {
  mission: ['Olayo OS', 'Mission Control'],
  farm: ['Olayo OS', 'Farm Digital Twin', 'Busiime Grid'],
  marketplace: ['Olayo OS', 'Marketplace', 'Seafood Exchange'],
  intelligence: ['Olayo OS', 'Intelligence', 'AI Workforce'],
  academy: ['Olayo OS', 'Academy', 'Learning Labs'],
};

export default function CommandDock({
  activeTab, onTabChanged, onOpenCommand, farmStatus, recentSearches, onAskOI
}: CommandDockProps) {
  const [time, setTime] = useState(new Date());
  const [expanded, setExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const isStorm = farmStatus?.weather === 'storm';
  const isLowO2 = farmStatus && farmStatus.dissolvedOxygenMgL < 5.5;
  const todLabel = farmStatus ? {
    morning: 'Morning Mist', midday: 'Midday', afternoon: 'Afternoon',
    golden: 'Golden Hour', sunset: 'Sunset', night: 'Night Watch', midnight: 'Deep Night',
  }[farmStatus.timeOfDay] || '' : '';

  const crumbs = BREADCRUMBS[activeTab] || ['Olayo OS'];

  return (
    <>
      {/* Top bar — breadcrumbs + ambient status + clock */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 pt-3"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-[10px] font-mono"
          >
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="w-2.5 h-2.5 text-slate-600" />}
                <span
                  className={i === crumbs.length - 1 ? 'text-cyan-300 font-semibold' : 'text-slate-500 hover:text-slate-300 cursor-pointer'}
                  onClick={() => { if (i === 0) onTabChanged('mission'); }}
                >
                  {c}
                </span>
              </React.Fragment>
            ))}
          </motion.div>

          {/* Ambient status chips */}
          {farmStatus && (
            <div className="hidden md:flex items-center gap-2">
              <div className="glass-panel rounded-full px-3 py-1 flex items-center gap-2 text-[10px] font-mono">
                <span className={`w-1.5 h-1.5 rounded-full ${isStorm ? 'bg-red-400 animate-pulse' : isLowO2 ? 'bg-orange-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span className="text-slate-400">O₂</span>
                <span className={`font-bold ${isLowO2 ? 'text-orange-400' : 'text-cyan-300'}`}>{farmStatus.dissolvedOxygenMgL}</span>
                <span className="text-slate-600">·</span>
                <Thermometer className="w-2.5 h-2.5 text-orange-400" />
                <span className="font-bold text-orange-300">{farmStatus.lakeTempC}°</span>
                <span className="text-slate-600">·</span>
                <Wind className="w-2.5 h-2.5 text-sky-400" />
                <span className="font-bold text-sky-300">{farmStatus.windKnots}kn</span>
              </div>
              <div className="glass-panel rounded-full px-3 py-1 flex items-center gap-1.5 text-[10px] font-mono">
                <ShipIcon className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-slate-400">{farmStatus.boatsActive} boats</span>
                <span className="text-slate-600">·</span>
                <Users className="w-2.5 h-2.5 text-cyan-400" />
                <span className="text-slate-400">{farmStatus.staffOnDuty} staff</span>
              </div>
            </div>
          )}

          {/* Clock */}
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-slate-500 hidden sm:inline">{todLabel}</span>
            <span className="text-cyan-300 font-bold">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className="text-slate-600">EAT</span>
          </div>
        </div>
      </motion.div>

      {/* Floating command dock — bottom center */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 28, delay: 0.2 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
      >
        <div
          className="glass-strong rounded-3xl px-2 py-2 flex items-center gap-1 shadow-2xl border border-cyan-500/20"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => { setExpanded(false); setHoveredItem(null); }}
        >
          {/* Brand */}
          <button
            onClick={() => onTabChanged('mission')}
            className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 flex items-center justify-center shrink-0 group"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-transparent"
            />
            <Waves className="w-5 h-5 text-slate-950 relative z-10" strokeWidth={2.5} />
          </button>

          {/* Divider */}
          <div className="w-px h-7 bg-cyan-500/15" />

          {/* Nav items */}
          <div className="flex items-center gap-0.5">
            {DOCK_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isHovered = hoveredItem === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative"
                >
                  <motion.button
                    onClick={() => onTabChanged(item.id)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className={`relative flex items-center gap-2 px-3 py-2.5 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/30'
                        : 'hover:bg-slate-800/40 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-white'}`} />
                    <AnimatePresence>
                      {(expanded || isActive) && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className={`text-xs font-semibold whitespace-nowrap overflow-hidden ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="dock-active"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-cyan-400"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.button>

                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {isHovered && !isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.9 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                      >
                        <div className="glass-strong rounded-xl px-3 py-1.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/20">
                          {item.hint}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-7 bg-cyan-500/15" />

          {/* Command palette trigger */}
          <button
            onClick={onOpenCommand}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl hover:bg-cyan-500/10 transition-all group"
          >
            <Command className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] font-mono text-slate-500 group-hover:text-cyan-300">⌘K</kbd>
          </button>
        </div>

        {/* Recent searches — appears above dock when expanded */}
        <AnimatePresence>
          {expanded && recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2"
            >
              <div className="glass-strong rounded-2xl p-2 min-w-[280px] border border-cyan-500/15">
                <div className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-cyan-400/60 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Recent
                </div>
                {recentSearches.slice(0, 3).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => onAskOI(s)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-all text-left"
                  >
                    <Search className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="text-[11px] text-slate-300 truncate flex-1">{s}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Live ticker — top right under clock */}
      <div className="fixed top-12 right-4 sm:right-6 z-30 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 text-[10px] font-mono text-slate-500"
        >
          <span className="flex items-center gap-1.5 text-emerald-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-cyan-400/70">Busiime Cage Grid</span>
        </motion.div>
      </div>
    </>
  );
}
