import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { FarmStatus } from '../types';
import { BrainCircuit, Leaf, Activity, TrendingUp, ShieldCheck, Fish, Droplets, Wrench, ShoppingCart, GraduationCap, Users, DollarSign } from 'lucide-react';
import AiAssistant from './AiAssistant';

interface IntelligenceProps {
  sustainabilityScore: number;
}

const OI_AGENTS = [
  { name: 'Hydrologist AI', icon: Droplets, color: 'text-cyan-400', desc: 'Monitors dissolved oxygen, pH, and turbidity across all 6 cages. Flags water quality deviations in real-time.' },
  { name: 'Feed Optimizer AI', icon: Fish, color: 'text-emerald-400', desc: 'Calculates optimal feed rations based on biomass, water temperature, and growth variance. FCR target: 1.2-1.5.' },
  { name: 'Harvest Planner AI', icon: TrendingUp, color: 'text-amber-400', desc: 'Predicts market-size readiness and schedules partial harvests to maximize revenue and minimize waste.' },
  { name: 'Cold Chain AI', icon: ShieldCheck, color: 'text-teal-400', desc: 'Tracks temperature telemetry from Busia Processing Hub to Kampala distribution. Alerts on cold chain breaches.' },
  { name: 'Market Analyst AI', icon: DollarSign, color: 'text-emerald-400', desc: 'Analyzes Kampala wholesale prices, export demand, and seasonal trends to recommend pricing strategy.' },
  { name: 'Compliance AI', icon: Leaf, color: 'text-teal-400', desc: 'Ensures NEMA and LVBC regulatory compliance. Auto-generates audit reports and sustainability scorecards.' },
];

export default function Intelligence({ sustainabilityScore }: IntelligenceProps) {
  const [status, setStatus] = useState<FarmStatus | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/farm-status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error('farm-status error', e);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 15000);
    return () => clearInterval(timer);
  }, [fetchStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <BrainCircuit className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
        <div>
          <h2 className="font-display font-bold text-white text-lg sm:text-xl">Olayo Intelligence (OI)</h2>
          <p className="text-xs text-slate-400 font-sans">Your digital executive team — 24/7 AI agents monitoring and optimizing the farm</p>
        </div>
      </div>

      {/* OI Briefing */}
      <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border border-cyan-500/25 rounded-2xl backdrop-blur-md p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="font-display font-semibold text-white text-sm">Live Operational Briefing</h3>
        </div>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {status ? (
            <>
              Farm operating within nominal parameters across {status.activeCages} cages. Total biomass {(status.totalBiomassKg / 1000).toFixed(1)}t with {status.totalPopulation.toLocaleString()} fish.
              Dissolved oxygen at {status.dissolvedOxygenMgL} mg/L is {status.dissolvedOxygenMgL < 5.5 ? 'trending low — aeration standby recommended' : 'healthy'}.
              Today's revenue ${status.todayRevenue.toFixed(0)} with {status.pendingOrders} pending orders. Feed distributed: {status.todayFeedKg} kg.
              Sustainability index {sustainabilityScore.toFixed(0)}/100.
            </>
          ) : 'Synthesizing operational state...'}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-cyan-400/80">
          <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5" /> NEMA compliant</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> LVBC accredited</span>
          <span className="flex items-center gap-1"><Fish className="w-3.5 h-3.5" /> FCR 1.32</span>
        </div>
      </div>

      {/* AI Workforce Grid */}
      <div>
        <h3 className="font-display font-semibold text-white text-sm mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" /> AI Workforce
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OI_AGENTS.map((agent, idx) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl p-4 backdrop-blur-md hover:border-cyan-400/30 transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`p-2 rounded-lg bg-slate-950/60 border border-cyan-500/10 ${agent.color}`}>
                  <agent.icon className="w-4 h-4" />
                </div>
                <h4 className="font-display font-semibold text-white text-xs">{agent.name}</h4>
                <span className="ml-auto flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{agent.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Assistant */}
      <div>
        <h3 className="font-display font-semibold text-white text-sm mb-3 flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-cyan-400" /> Ask Olayo Intelligence
        </h3>
        <AiAssistant />
      </div>
    </div>
  );
}
