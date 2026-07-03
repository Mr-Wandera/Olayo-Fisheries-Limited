import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, ArrowRight, CornerDownLeft, Waves, Fish, ShoppingBag, BrainCircuit, GraduationCap, Sparkles, TrendingUp, Droplets, Activity, Ship, ShoppingCart, Leaf, Clock } from 'lucide-react';

export interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon: React.ElementType;
  category: 'navigation' | 'action' | 'intelligence' | 'recent';
  keywords?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onAskOI: (prompt: string) => void;
  recentSearches: string[];
}

export default function CommandPalette({ isOpen, onClose, onNavigate, onAskOI, recentSearches }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = useMemo(() => {
    const nav: CommandItem[] = [
      { id: 'nav-mission', label: 'Mission Control', hint: 'Living operations workspace', icon: Waves, category: 'navigation', keywords: 'dashboard home operations', action: () => onNavigate('mission') },
      { id: 'nav-farm', label: 'Farm Digital Twin', hint: 'Lake Victoria cage grid', icon: Fish, category: 'navigation', keywords: 'lake cages boats vessels', action: () => onNavigate('farm') },
      { id: 'nav-market', label: 'Marketplace', hint: 'Aquaculture exchange', icon: ShoppingBag, category: 'navigation', keywords: 'products buy sell order', action: () => onNavigate('marketplace') },
      { id: 'nav-intel', label: 'Olayo Intelligence', hint: 'AI workforce & reasoning', icon: BrainCircuit, category: 'navigation', keywords: 'ai agents intelligence', action: () => onNavigate('intelligence') },
      { id: 'nav-academy', label: 'Academy', hint: 'Immersive learning', icon: GraduationCap, category: 'navigation', keywords: 'lessons learn training certification', action: () => onNavigate('academy') },
    ];

    const actions: CommandItem[] = [
      { id: 'act-ask-biomass', label: 'Ask OI: Current biomass status?', icon: Activity, category: 'action', action: () => onAskOI('What is the current biomass status across all cages?') },
      { id: 'act-ask-water', label: 'Ask OI: Water quality summary', icon: Droplets, category: 'action', action: () => onAskOI('Summarize water quality across all cages and flag any concerns.') },
      { id: 'act-ask-harvest', label: 'Ask OI: Harvest recommendations', icon: TrendingUp, category: 'action', action: () => onAskOI('Which cages are ready for partial harvest this week?') },
      { id: 'act-ask-fleet', label: 'Ask OI: Fleet deployment plan', icon: Ship, category: 'action', action: () => onAskOI('Recommend vessel deployment for tomorrow\'s operations.') },
      { id: 'act-ask-pricing', label: 'Ask OI: Dynamic pricing review', icon: ShoppingCart, category: 'action', action: () => onAskOI('Review marketplace pricing and suggest adjustments based on demand.') },
      { id: 'act-ask-sustainability', label: 'Ask OI: ESG compliance report', icon: Leaf, category: 'action', action: () => onAskOI('Generate ESG compliance summary for NEMA and LVBC.') },
    ];

    const recent: CommandItem[] = recentSearches.slice(0, 4).map((q, i) => ({
      id: `recent-${i}`,
      label: q,
      icon: Clock,
      category: 'recent',
      action: () => onAskOI(q),
    }));

    return [...nav, ...actions, ...recent];
  }, [onNavigate, onAskOI, recentSearches]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.hint?.toLowerCase().includes(q) ||
      c.keywords?.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && filtered[activeIdx]) {
        e.preventDefault();
        filtered[activeIdx].action();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, filtered, activeIdx, onClose]);

  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.children[activeIdx] as HTMLElement;
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filtered.forEach(c => {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    });
    return groups;
  }, [filtered]);

  const categoryLabels: Record<string, string> = {
    navigation: 'Navigate',
    action: 'Ask Olayo Intelligence',
    recent: 'Recent',
    intelligence: 'Intelligence',
  };

  let flatIdx = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-2xl glass-strong rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-cyan-500/10">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <Search className="w-4 h-4 text-cyan-400" />
              </div>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything, or search the operation..."
                className="flex-1 bg-transparent border-0 outline-none text-sm text-white placeholder-slate-500"
              />
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/60 border border-cyan-500/10 text-[10px] font-mono text-slate-400">
                <CornerDownLeft className="w-3 h-3" /> to select
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-cyan-400/60 flex items-center gap-1.5">
                    {cat === 'intelligence' && <Sparkles className="w-3 h-3" />}
                    {categoryLabels[cat] || cat}
                  </div>
                  {items.map((item) => {
                    const idx = flatIdx++;
                    const isActive = idx === activeIdx;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => { item.action(); onClose(); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${isActive ? 'bg-cyan-500/10 border border-cyan-400/30' : 'border border-transparent hover:bg-slate-800/40'}`}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800/60 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>{item.label}</div>
                          {item.hint && <div className="text-[10px] text-slate-500 truncate">{item.hint}</div>}
                        </div>
                        {isActive && <ArrowRight className="w-4 h-4 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-xs text-slate-500 font-mono">No matches for "{query}"</div>
                  <button
                    onClick={() => { onAskOI(query); onClose(); }}
                    className="mt-3 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20"
                  >
                    Ask OI: "{query}"
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-cyan-500/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">esc</kbd> close</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400/80">
                <Command className="w-3 h-3" /> Olayo Intelligence OS
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
