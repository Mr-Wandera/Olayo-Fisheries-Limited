import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BrainCircuit, Search, Command, Sparkles, ChevronRight, Clock,
  Activity, Droplets, Wind, Thermometer, Users, Ship as ShipIcon,
  Radio, ArrowRight, Zap, X
} from 'lucide-react';

interface TopCommandBarProps {
  activeTab: string;
  onOpenCommand: () => void;
  onAskOI: (prompt: string) => void;
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
}

const TAB_LABELS: Record<string, string> = {
  mission: 'Mission Control',
  farm: 'Farm Digital Twin',
  marketplace: 'Marketplace',
  intelligence: 'OI Agents',
  academy: 'Academy',
  reports: 'Reports',
  operations: 'Operations',
  customers: 'Customers',
  fleet: 'Fleet',
  research: 'Research',
  settings: 'Settings',
};

const QUICK_PROMPTS = [
  'Prepare today\'s executive briefing',
  'Compare Cage 3 and Cage 6',
  'Predict harvest readiness',
  'Find all oxygen alerts',
  'Generate monthly report',
  'Plan feed purchases',
];

export default function TopCommandBar({ activeTab, onOpenCommand, onAskOI, farmStatus, recentSearches }: TopCommandBarProps) {
  const [time, setTime] = useState(new Date());
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const [hoveredPrompt, setHoveredPrompt] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-40 px-4 pt-3"
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-[10px] font-mono shrink-0"
        >
          <span className="text-slate-500">Olayo OS</span>
          <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
          <span className="text-cyan-300 font-semibold">{TAB_LABELS[activeTab] || 'Workspace'}</span>
        </motion.div>

        {/* AI Command Bar — center */}
        <div className="flex-1 max-w-2xl relative">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="glass-strong rounded-2xl border border-cyan-500/20 flex items-center gap-2 px-3 py-2 cursor-text"
            onClick={() => { inputRef.current?.focus(); setShowQuickPrompts(true); }}
          >
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shrink-0">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask Olayo Intelligence anything..."
              onFocus={() => setShowQuickPrompts(true)}
              onBlur={() => setTimeout(() => setShowQuickPrompts(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                  onAskOI((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className="flex-1 bg-transparent border-0 outline-none text-xs text-white placeholder-slate-500 font-sans"
            />
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-950/60 border border-cyan-500/10 text-[9px] font-mono text-slate-500">
              ⌘K
            </kbd>
            <button
              onClick={(e) => { e.stopPropagation(); onOpenCommand(); }}
              className="p-1 rounded-lg text-slate-500 hover:text-cyan-300 transition-colors"
            >
              <Command className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Quick prompts dropdown */}
          <AnimatePresence>
            {showQuickPrompts && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                className="absolute top-full mt-2 left-0 right-0 glass-strong rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl z-50"
              >
                <div className="px-3 py-2 text-[9px] font-mono uppercase tracking-widest text-cyan-400/60 border-b border-cyan-500/10 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Suggested prompts
                </div>
                {QUICK_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onMouseEnter={() => setHoveredPrompt(i)}
                    onMouseLeave={() => setHoveredPrompt(null)}
                    onClick={() => { onAskOI(p); setShowQuickPrompts(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all ${hoveredPrompt === i ? 'bg-cyan-500/10' : ''}`}
                  >
                    <div className={`p-1.5 rounded-lg ${hoveredPrompt === i ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800/60 text-slate-400'}`}>
                      <BrainCircuit className="w-3 h-3" />
                    </div>
                    <span className={`text-xs flex-1 ${hoveredPrompt === i ? 'text-white' : 'text-slate-300'}`}>{p}</span>
                    {hoveredPrompt === i && <ArrowRight className="w-3 h-3 text-cyan-400" />}
                  </button>
                ))}
                {recentSearches.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-[9px] font-mono uppercase tracking-widest text-cyan-400/60 border-t border-cyan-500/10 border-b border-cyan-500/10 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Recent
                    </div>
                    {recentSearches.slice(0, 2).map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { onAskOI(s); setShowQuickPrompts(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-cyan-500/5 transition-all"
                      >
                        <Search className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-400 truncate flex-1">{s}</span>
                      </button>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ambient status + clock */}
        <div className="flex items-center gap-2 shrink-0">
          {farmStatus && (
            <div className="hidden lg:flex items-center gap-2">
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
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-slate-500 hidden sm:inline">{todLabel}</span>
            <span className="text-cyan-300 font-bold">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-slate-600">EAT</span>
          </div>
        </div>
      </div>

      {/* Live ticker */}
      <div className="max-w-[1600px] mx-auto mt-1.5 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 text-[9px] font-mono text-slate-500"
        >
          <span className="flex items-center gap-1.5 text-emerald-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-cyan-400/70">Busiime Cage Grid · Lake Victoria</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
