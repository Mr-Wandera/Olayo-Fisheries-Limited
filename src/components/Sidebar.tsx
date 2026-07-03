import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Waves, Fish, ShoppingBag, BrainCircuit, GraduationCap, FileText, Settings,
  Ship, Users, FlaskConical, ChevronLeft, ChevronRight, Star, Clock,
  Activity, Sparkles, Radio, X, Anchor, Leaf, DollarSign, ShieldCheck,
  TrendingUp, Zap, Pin, History
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChanged: (tab: string) => void;
  onAskOI: (prompt: string) => void;
  recentSearches: string[];
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  hint: string;
  badge?: string;
  group: 'workspace' | 'operations' | 'system';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'mission', label: 'Mission Control', icon: Waves, hint: 'Command center', group: 'workspace' },
  { id: 'farm', label: 'Farm', icon: Fish, hint: 'Digital twin', group: 'workspace' },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, hint: 'Seafood exchange', group: 'workspace' },
  { id: 'academy', label: 'Academy', icon: GraduationCap, hint: 'Learning labs', group: 'workspace' },
  { id: 'intelligence', label: 'OI Agents', icon: BrainCircuit, hint: 'AI workforce', badge: '6', group: 'workspace' },
  { id: 'reports', label: 'Reports', icon: FileText, hint: 'Documents & exports', group: 'operations' },
  { id: 'operations', label: 'Operations', icon: Activity, hint: 'Daily operations', group: 'operations' },
  { id: 'customers', label: 'Customers', icon: Users, hint: 'Buyer relationships', group: 'operations' },
  { id: 'fleet', label: 'Fleet', icon: Ship, hint: 'Vessel management', group: 'operations' },
  { id: 'research', label: 'Research', icon: FlaskConical, hint: 'R&D lab', group: 'operations' },
  { id: 'settings', label: 'Settings', icon: Settings, hint: 'System config', group: 'system' },
];

const PINNED_ITEMS = [
  { id: 'pin-cage3', label: 'Cage Alpha-3', icon: Anchor, tab: 'farm' },
  { id: 'pin-tilapia', label: 'Tilapia Pricing', icon: DollarSign, tab: 'marketplace' },
  { id: 'pin-water', label: 'Water Quality', icon: Leaf, tab: 'farm' },
];

const FAVORITES = [
  { id: 'fav-harvest', label: 'Harvest Planner', icon: TrendingUp, tab: 'intelligence' },
  { id: 'fav-coldchain', label: 'Cold Chain', icon: ShieldCheck, tab: 'farm' },
];

export default function Sidebar({ activeTab, onTabChanged, onAskOI, recentSearches, collapsed, onToggleCollapse }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isCollapsed = collapsed;

  const workspaceItems = NAV_ITEMS.filter(n => n.group === 'workspace');
  const operationsItems = NAV_ITEMS.filter(n => n.group === 'operations');
  const systemItems = NAV_ITEMS.filter(n => n.group === 'system');

  const handleNavClick = (id: string) => {
    if (['reports', 'operations', 'customers', 'fleet', 'research', 'settings'].includes(id)) {
      onAskOI(`Open the ${NAV_ITEMS.find(n => n.id === id)?.label} workspace and provide an overview.`);
    } else {
      onTabChanged(id);
    }
  };

  return (
    <>
      <motion.aside
        initial={{ x: -280, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: isCollapsed ? 64 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 bottom-0 z-40 glass-strong border-r border-cyan-500/15 flex flex-col"
      >
        {/* Brand header */}
        <div className="flex items-center gap-2.5 px-3 py-4 border-b border-cyan-500/10">
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
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 min-w-0"
              >
                <div className="font-display font-bold text-white text-sm leading-tight">Olayo OS</div>
                <div className="text-[9px] font-mono text-cyan-400/60 uppercase tracking-widest">Living Enterprise</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-none py-3 px-2 space-y-4">
          {/* Workspace group */}
          <NavGroup label="Workspace" items={workspaceItems} activeTab={activeTab} onNav={handleNavClick} isCollapsed={isCollapsed} hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} />

          {/* Operations group */}
          <NavGroup label="Operations" items={operationsItems} activeTab={activeTab} onNav={handleNavClick} isCollapsed={isCollapsed} hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} />

          {/* Pinned workspaces */}
          {!isCollapsed && (
            <div className="space-y-1">
              <div className="px-3 text-[9px] font-mono uppercase tracking-widest text-cyan-400/40 flex items-center gap-1.5">
                <Pin className="w-2.5 h-2.5" /> Pinned
              </div>
              {PINNED_ITEMS.map(p => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => onTabChanged(p.tab)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/5 transition-all text-left group"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-cyan-400/60 group-hover:text-cyan-300" />
                    <span className="text-[11px] font-sans truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Favorites */}
          {!isCollapsed && (
            <div className="space-y-1">
              <div className="px-3 text-[9px] font-mono uppercase tracking-widest text-cyan-400/40 flex items-center gap-1.5">
                <Star className="w-2.5 h-2.5" /> Favorites
              </div>
              {FAVORITES.map(f => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => onTabChanged(f.tab)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/5 transition-all text-left group"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-amber-400/60 group-hover:text-amber-300" />
                    <span className="text-[11px] font-sans truncate">{f.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Recent activity */}
          {!isCollapsed && recentSearches.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 text-[9px] font-mono uppercase tracking-widest text-cyan-400/40 flex items-center gap-1.5">
                <History className="w-2.5 h-2.5" /> Recent
              </div>
              {recentSearches.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => onAskOI(s)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-cyan-500/5 transition-all text-left"
                >
                  <Clock className="w-3 h-3 shrink-0 text-slate-600" />
                  <span className="text-[10px] font-mono truncate">{s}</span>
                </button>
              ))}
            </div>
          )}

          {/* System group */}
          <NavGroup label="System" items={systemItems} activeTab={activeTab} onNav={handleNavClick} isCollapsed={isCollapsed} hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} />
        </div>

        {/* Collapse toggle */}
        <div className="border-t border-cyan-500/10 p-2">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-cyan-500/5 transition-all"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /> <span className="text-[10px] font-mono">Collapse</span></>}
          </button>
        </div>

        {/* Live status indicator */}
        {!isCollapsed && (
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-emerald-400">6 agents active</span>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}

/* ============ NAV GROUP ============ */
function NavGroup({ label, items, activeTab, onNav, isCollapsed, hoveredItem, setHoveredItem }: {
  label: string;
  items: NavItem[];
  activeTab: string;
  onNav: (id: string) => void;
  isCollapsed: boolean;
  hoveredItem: string | null;
  setHoveredItem: (id: string | null) => void;
}) {
  return (
    <div className="space-y-0.5">
      {!isCollapsed && (
        <div className="px-3 text-[9px] font-mono uppercase tracking-widest text-cyan-400/40 mb-1">{label}</div>
      )}
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isHovered = hoveredItem === item.id;
        return (
          <div key={item.id} className="relative">
            <motion.button
              onClick={() => onNav(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all relative ${isActive ? 'bg-gradient-to-r from-cyan-500/15 to-teal-500/10 border border-cyan-400/25' : 'border border-transparent hover:bg-slate-800/40'}`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
              <AnimatePresence>
                {!isCollapsed && (
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
              {!isCollapsed && item.badge && (
                <span className="ml-auto text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-cyan-400"
                />
              )}
            </motion.button>

            {/* Tooltip when collapsed */}
            <AnimatePresence>
              {isCollapsed && isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
                >
                  <div className="glass-strong rounded-xl px-3 py-1.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/20 whitespace-nowrap">
                    {item.label}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
