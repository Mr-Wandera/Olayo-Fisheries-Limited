import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Sparkles, ChevronRight, X, Lightbulb, Activity, TrendingUp, Droplets, Fish, DollarSign, ShieldCheck, Clock, Zap, ArrowRight } from 'lucide-react';
import { FarmStatus } from '../types';

interface AmbientOIProps {
  activeTab: string;
  farmStatus: FarmStatus | null;
  sustainabilityScore: number;
  onAskOI: (prompt: string) => void;
  onNavigate: (tab: string) => void;
}

interface Insight {
  id: string;
  icon: React.ElementType;
  color: string;
  title: string;
  detail: string;
  action?: { label: string; prompt?: string; navigate?: string };
  urgency: 'info' | 'advisory' | 'priority';
}

export default function AmbientOI({ activeTab, farmStatus, sustainabilityScore, onAskOI, onNavigate }: AmbientOIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentInsightIdx, setCurrentInsightIdx] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);

  // Generate contextual insights based on current page and farm state
  const insights = useMemo<Insight[]>(() => {
    const list: Insight[] = [];

    if (!farmStatus) return list;

    // Weather-based insights
    if (farmStatus.weather === 'storm') {
      list.push({
        id: 'storm-alert',
        icon: Zap,
        color: 'text-red-400',
        title: 'Storm protocol active',
        detail: `All vessels recalled. ${farmStatus.staffOnDuty} staff on duty. Turbidity at ${farmStatus.turbidityNTU} NTU.`,
        action: { label: 'View farm', navigate: 'farm' },
        urgency: 'priority',
      });
    }

    // Low O2 insight
    if (farmStatus.dissolvedOxygenMgL < 5.5) {
      list.push({
        id: 'low-o2',
        icon: Droplets,
        color: 'text-orange-400',
        title: 'Dissolved oxygen trending low',
        detail: `O₂ at ${farmStatus.dissolvedOxygenMgL} mg/L across the grid. Aeration standby recommended for tonight.`,
        action: { label: 'Ask OI', prompt: 'What actions should I take for low dissolved oxygen?' },
        urgency: 'priority',
      });
    }

    // Page-specific insights
    if (activeTab === 'mission') {
      list.push({
        id: 'mission-biomass',
        icon: Fish,
        color: 'text-emerald-400',
        title: `Biomass at ${(farmStatus.totalBiomassKg / 1000).toFixed(1)}t`,
        detail: `${farmStatus.totalPopulation.toLocaleString()} fish across ${farmStatus.activeCages} cages. Growth rate +2.4% this week.`,
        action: { label: 'Harvest review', prompt: 'Which cages are ready for partial harvest this week?' },
        urgency: 'info',
      });
      if (farmStatus.pendingOrders > 0) {
        list.push({
          id: 'mission-orders',
          icon: DollarSign,
          color: 'text-amber-400',
          title: `${farmStatus.pendingOrders} pending orders`,
          detail: `Today's revenue $${farmStatus.todayRevenue.toFixed(0)}. Kampala wholesale prices up 3.2%.`,
          action: { label: 'Marketplace', navigate: 'marketplace' },
          urgency: 'advisory',
        });
      }
    }

    if (activeTab === 'farm') {
      list.push({
        id: 'farm-twin',
        icon: Activity,
        color: 'text-cyan-400',
        title: 'Digital twin synchronized',
        detail: `Live telemetry from ${farmStatus.activeCages} cages, ${farmStatus.boatsActive} vessels. Wind ${farmStatus.windKnots}kn, ${farmStatus.weather}.`,
        action: { label: 'Ask OI', prompt: 'Analyze the digital twin and recommend operational priorities for the next 24 hours.' },
        urgency: 'info',
      });
    }

    if (activeTab === 'marketplace') {
      list.push({
        id: 'market-demand',
        icon: TrendingUp,
        color: 'text-emerald-400',
        title: 'Tilapia demand rising',
        detail: 'Kampala wholesale price up 3.2% this week. OI recommends holding inventory for 48h to capture premium.',
        action: { label: 'Review pricing', prompt: 'Review marketplace pricing and suggest adjustments based on demand.' },
        urgency: 'advisory',
      });
    }

    if (activeTab === 'intelligence') {
      list.push({
        id: 'oi-workforce',
        icon: BrainCircuit,
        color: 'text-cyan-400',
        title: '6 AI agents active',
        detail: 'Hydrologist, Feed Optimizer, Harvest Planner, Cold Chain, Market Analyst, and Compliance agents all monitoring.',
        action: { label: 'View reasoning', navigate: 'intelligence' },
        urgency: 'info',
      });
    }

    if (activeTab === 'academy') {
      list.push({
        id: 'academy-labs',
        icon: Sparkles,
        color: 'text-teal-400',
        title: 'Interactive labs available',
        detail: 'Explore fish anatomy, simulate water chemistry, or diagnose diseases in the virtual lab.',
        action: { label: 'Open labs', navigate: 'academy' },
        urgency: 'info',
      });
    }

    // Sustainability insight
    if (sustainabilityScore >= 85) {
      list.push({
        id: 'sustainability-good',
        icon: ShieldCheck,
        color: 'text-emerald-400',
        title: `ESG score ${sustainabilityScore.toFixed(0)}/100`,
        detail: 'NEMA compliance verified. LVBC audit package submitted. Reef growth detected at lake bottom.',
        urgency: 'info',
      });
    }

    return list;
  }, [activeTab, farmStatus, sustainabilityScore]);

  // Filter out dismissed
  const visibleInsights = insights.filter(i => !dismissed.includes(i.id));
  const currentInsight = visibleInsights[currentInsightIdx % Math.max(1, visibleInsights.length)];

  // Auto-rotate insights
  useEffect(() => {
    if (visibleInsights.length <= 1) return;
    const t = setInterval(() => {
      setCurrentInsightIdx(prev => (prev + 1) % visibleInsights.length);
    }, 6000);
    return () => clearInterval(t);
  }, [visibleInsights.length]);

  // Reset index when insights change
  useEffect(() => {
    setCurrentInsightIdx(0);
  }, [activeTab]);

  const handleAction = useCallback((insight: Insight) => {
    if (insight.action?.navigate) {
      onNavigate(insight.action.navigate);
    } else if (insight.action?.prompt) {
      onAskOI(insight.action.prompt);
    }
  }, [onNavigate, onAskOI]);

  const dismiss = useCallback((id: string) => {
    setDismissed(prev => [...prev, id]);
  }, []);

  if (!farmStatus || visibleInsights.length === 0) return null;

  return (
    <>
      {/* Ambient insight orb — fixed left side */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 28, delay: 0.5 }}
        className="fixed left-4 bottom-24 z-30"
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          {/* Pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-cyan-400/40"
          />
          <div className="relative w-12 h-12 rounded-full glass-strong border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BrainCircuit className="w-5 h-5 text-cyan-300" />
            </motion.div>
          </div>
          {/* Notification dot */}
          {visibleInsights.length > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 border-2 border-slate-950 text-[9px] font-mono font-bold text-slate-950 flex items-center justify-center">
              {visibleInsights.length}
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* Expanded insight panel */}
      <AnimatePresence>
        {isOpen && currentInsight && (
          <motion.div
            initial={{ x: -30, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -30, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed left-4 bottom-44 z-30 w-80 max-w-[calc(100vw-2rem)]"
          >
            <div className="glass-strong rounded-2xl p-4 border border-cyan-500/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30`}
                  >
                    <BrainCircuit className="w-3.5 h-3.5 text-cyan-300" />
                  </motion.div>
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/60">OI Ambient</div>
                    <div className="text-[10px] font-mono text-slate-500">{visibleInsights.length} insights</div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Current insight */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentInsight.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`p-2 rounded-xl bg-slate-950/60 border border-cyan-500/10 shrink-0`}>
                      <currentInsight.icon className={`w-4 h-4 ${currentInsight.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-white">{currentInsight.title}</h4>
                        {currentInsight.urgency === 'priority' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed mt-1">{currentInsight.detail}</p>
                    </div>
                  </div>

                  {/* Action button */}
                  {currentInsight.action && (
                    <button
                      onClick={() => handleAction(currentInsight)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-semibold hover:bg-cyan-500/20 transition-all group"
                    >
                      <span className="flex items-center gap-1.5">
                        <Lightbulb className="w-3 h-3" />
                        {currentInsight.action.label}
                      </span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Footer — rotation indicators + dismiss */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-cyan-500/10">
                <div className="flex items-center gap-1.5">
                  {visibleInsights.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentInsightIdx(i)}
                      className={`h-1 rounded-full transition-all ${i === currentInsightIdx ? 'w-4 bg-cyan-400' : 'w-1 bg-slate-700'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => dismiss(currentInsight.id)}
                  className="text-[9px] font-mono text-slate-500 hover:text-slate-300 uppercase tracking-wider"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
