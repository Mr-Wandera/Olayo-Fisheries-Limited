import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FarmStatus } from '../types';
import { BrainCircuit, Leaf, Activity, TrendingUp, ShieldCheck, Fish, Droplets, Wrench, ShoppingCart, GraduationCap, Users, DollarSign, Sparkles, Zap, Eye, ChevronRight, Cpu, Network, Clock, CircleCheck as CheckCircle2, ArrowRight, MessageSquare, GitBranch, Layers, Target, TriangleAlert as AlertTriangle, Lightbulb, Database, Send, X, Radio } from 'lucide-react';
import AiAssistant from './AiAssistant';

interface IntelligenceProps {
  sustainabilityScore: number;
  initialQuery?: string;
  onQueryConsumed?: () => void;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  status: 'thinking' | 'monitoring' | 'idle' | 'alert';
  currentTask: string;
  confidence: number;
  recentActions: string[];
  specialty: string;
}

const AGENTS: Agent[] = [
  {
    id: 'hydro',
    name: 'Hydrologist AI',
    role: 'Water Quality Specialist',
    icon: Droplets,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15 border-cyan-400/30',
    status: 'monitoring',
    currentTask: 'Sampling dissolved oxygen across 6 cages',
    confidence: 94,
    recentActions: ['Flagged Cage Alpha-2 O₂ trending low', 'Triggered aeration standby', 'Logged 24h water quality report'],
    specialty: 'Monitors DO, pH, and turbidity in real-time across all cages',
  },
  {
    id: 'feed',
    name: 'Feed Optimizer AI',
    role: 'Nutrition Engineer',
    icon: Fish,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15 border-emerald-400/30',
    status: 'thinking',
    currentTask: 'Calculating optimal ration for Cage Beta-2',
    confidence: 87,
    recentActions: ['Adjusted evening feed window +15%', 'Projected FCR improvement to 1.28', 'Auto-reorder draft prepared'],
    specialty: 'Optimizes feed rations based on biomass, temperature, and growth variance',
  },
  {
    id: 'harvest',
    name: 'Harvest Planner AI',
    role: 'Production Strategist',
    icon: TrendingUp,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15 border-amber-400/30',
    status: 'monitoring',
    currentTask: 'Predicting market-size readiness for Cage Alpha-1',
    confidence: 91,
    recentActions: ['Identified 480kg tilapia ready for harvest', 'Scheduled partial harvest for Thursday', 'Coordinated with Busia Processing Hub'],
    specialty: 'Predicts harvest timing and schedules partial harvests to maximize revenue',
  },
  {
    id: 'coldchain',
    name: 'Cold Chain AI',
    role: 'Logistics Guardian',
    icon: ShieldCheck,
    color: 'text-teal-400',
    bg: 'bg-teal-500/15 border-teal-400/30',
    status: 'alert',
    currentTask: 'Investigating Kampala chiller temperature breach',
    confidence: 78,
    recentActions: ['Detected 6.5°C reading (threshold 4°C)', 'Dispatched maintenance ticket', 'Notified shift supervisor'],
    specialty: 'Tracks temperature telemetry from Busia hub to Kampala distribution',
  },
  {
    id: 'market',
    name: 'Market Analyst AI',
    role: 'Pricing Strategist',
    icon: DollarSign,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15 border-emerald-400/30',
    status: 'thinking',
    currentTask: 'Analyzing Kampala wholesale price trends',
    confidence: 89,
    recentActions: ['Detected 3.2% price increase in tilapia', 'Recommended +5% price adjustment', 'Forecasted holiday demand spike'],
    specialty: 'Analyzes market prices, export demand, and seasonal trends',
  },
  {
    id: 'compliance',
    name: 'Compliance AI',
    role: 'Regulatory Auditor',
    icon: Leaf,
    color: 'text-teal-400',
    bg: 'bg-teal-500/15 border-teal-400/30',
    status: 'monitoring',
    currentTask: 'Generating NEMA quarterly compliance report',
    confidence: 96,
    recentActions: ['Verified all 6 cages within NEMA bands', 'Auto-generated ESG scorecard', 'Submitted LVBC audit package'],
    specialty: 'Ensures NEMA and LVBC regulatory compliance with auto-generated audits',
  },
];

const REASONING_STEPS = [
  { icon: Database, label: 'Data Collection', desc: 'Aggregating telemetry from 6 cages, 4 vessels, 4 facilities' },
  { icon: Network, label: 'Pattern Recognition', desc: 'Cross-referencing biomass, water quality, and feed metrics' },
  { icon: GitBranch, label: 'Trade-off Analysis', desc: 'Weighing harvest revenue vs. growth potential' },
  { icon: Target, label: 'Decision', desc: 'Recommending partial harvest of Cage Alpha-1' },
];

export default function Intelligence({ sustainabilityScore, initialQuery, onQueryConsumed }: IntelligenceProps) {
  const [status, setStatus] = useState<FarmStatus | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/farm-status');
      const data = await res.json();
      setStatus(data);
    } catch (e) { console.error('farm-status error', e); }
  }, []);

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 15000);
    return () => clearInterval(timer);
  }, [fetchStatus]);

  // Reasoning animation
  useEffect(() => {
    if (!showReasoning) return;
    const t = setInterval(() => {
      setActiveStep(s => (s + 1) % REASONING_STEPS.length);
    }, 1500);
    return () => clearInterval(t);
  }, [showReasoning]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <BrainCircuit className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
        <div>
          <h2 className="font-display font-bold text-white text-lg sm:text-xl">Olayo Intelligence (OI)</h2>
          <p className="text-xs text-slate-400 font-sans">Your digital executive team — 24/7 AI agents monitoring and optimizing the farm</p>
        </div>
      </motion.div>

      {/* OI Briefing */}
      <div className="glass-luminous rounded-3xl p-5 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-breathe" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30"
            >
              <Activity className="w-4 h-4 text-cyan-300" />
            </motion.div>
            <h3 className="font-display font-semibold text-white text-sm">Live Operational Briefing</h3>
            <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <Radio className="w-3 h-3" /> 6 agents active
            </span>
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
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] font-mono text-cyan-400/80">
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><Leaf className="w-3 h-3" /> NEMA compliant</span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"><ShieldCheck className="w-3 h-3" /> LVBC accredited</span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/60 border border-cyan-500/10 text-slate-400"><Fish className="w-3 h-3" /> FCR 1.32</span>
          </div>
        </div>
      </div>

      {/* AI Workforce Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-white text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" /> AI Workforce
          </h3>
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> {showReasoning ? 'Hide' : 'Show'} Reasoning
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AGENTS.map((agent, idx) => (
            <AgentCard key={agent.id} agent={agent} idx={idx} onClick={() => setSelectedAgent(agent)} />
          ))}
        </div>
      </div>

      {/* Reasoning visualization */}
      <AnimatePresence>
        {showReasoning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ReasoningVisualization activeStep={activeStep} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Memory & Collaboration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MemoryPanel />
        <CollaborationPanel />
      </div>

      {/* AI Assistant */}
      <div>
        <h3 className="font-display font-semibold text-white text-sm mb-3 flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-cyan-400" /> Ask Olayo Intelligence
        </h3>
        <AiAssistant initialQuery={initialQuery} onQueryConsumed={onQueryConsumed} />
      </div>

      {/* Agent detail modal */}
      <AnimatePresence>
        {selectedAgent && (
          <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ AGENT CARD ============ */
function AgentCard({ agent, idx, onClick }: { agent: Agent; idx: number; onClick: () => void }) {
  const statusColor = agent.status === 'alert' ? 'bg-orange-400' : agent.status === 'thinking' ? 'bg-cyan-400' : agent.status === 'monitoring' ? 'bg-emerald-400' : 'bg-slate-500';
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, type: 'spring', stiffness: 200, damping: 25 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="glass rounded-2xl p-4 text-left hover:border-cyan-400/30 transition-all relative overflow-hidden group"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`p-2 rounded-lg ${agent.bg}`}>
          <agent.icon className={`w-4 h-4 ${agent.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-white text-xs truncate">{agent.name}</h4>
          <p className="text-[10px] text-slate-500 font-mono">{agent.role}</p>
        </div>
        <span className="flex h-2 w-2 shrink-0">
          <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full ${statusColor} opacity-75`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${statusColor}`} />
        </span>
      </div>
      <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-3 line-clamp-2">{agent.specialty}</p>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span className="truncate">{agent.currentTask}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-500">Confidence</span>
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${agent.confidence}%` }}
                transition={{ delay: idx * 0.1 + 0.3, duration: 0.8 }}
                className={`h-full ${agent.confidence >= 90 ? 'bg-emerald-400' : agent.confidence >= 80 ? 'bg-cyan-400' : 'bg-orange-400'}`}
              />
            </div>
            <span className={`font-bold ${agent.confidence >= 90 ? 'text-emerald-400' : agent.confidence >= 80 ? 'text-cyan-400' : 'text-orange-400'}`}>{agent.confidence}%</span>
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-3 h-3 text-cyan-400" />
      </div>
    </motion.button>
  );
}

/* ============ REASONING VISUALIZATION ============ */
function ReasoningVisualization({ activeStep }: { activeStep: number }) {
  return (
    <div className="glass-luminous rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit className="w-5 h-5 text-cyan-400" />
          <h3 className="font-display font-semibold text-white text-sm">AI Reasoning Process — Harvest Planner</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {REASONING_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === activeStep;
            const isPast = i < activeStep;
            return (
              <motion.div
                key={i}
                animate={isActive ? { scale: 1.03 } : { scale: 1 }}
                className={`p-4 rounded-2xl border transition-all ${isActive ? 'bg-cyan-500/15 border-cyan-400/40' : isPast ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-950/40 border-cyan-500/10'}`}
              >
                <div className={`p-2 rounded-lg inline-block mb-2 ${isActive ? 'bg-cyan-500/20' : isPast ? 'bg-emerald-500/15' : 'bg-slate-800/60'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : isPast ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
                <div className={`text-xs font-semibold mb-1 ${isActive ? 'text-white' : isPast ? 'text-emerald-300' : 'text-slate-400'}`}>{step.label}</div>
                <div className="text-[10px] text-slate-500 font-mono leading-relaxed">{step.desc}</div>
                {isPast && <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-2" />}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-cyan-200">
            <span className="font-bold">Recommendation:</span> Schedule partial harvest of Cage Alpha-1 on Thursday. Expected yield: 480kg Nile Tilapia. Projected revenue: $2,784. Confidence: 91%.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ MEMORY PANEL ============ */
function MemoryPanel() {
  const memories = [
    { icon: Fish, label: 'Preferred harvest size', value: '400-500g tilapia' },
    { icon: TrendingUp, label: 'Top-performing cage', value: 'Cage Alpha-1' },
    { icon: Clock, label: 'Most active hour', value: '10:00 EAT' },
    { icon: ShoppingCart, label: 'Frequent search', value: 'fresh tilapia fillet' },
    { icon: GraduationCap, label: 'Lessons completed', value: '2 of 3' },
    { icon: DollarSign, label: 'Avg order value', value: '$839 USD' },
  ];
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-4 h-4 text-cyan-400" />
        <h3 className="font-display font-semibold text-white text-sm">OI Memory</h3>
        <span className="ml-auto text-[10px] font-mono text-slate-500">Personalized</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {memories.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/10"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <m.icon className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-mono text-slate-500 uppercase">{m.label}</span>
            </div>
            <div className="text-xs font-semibold text-white">{m.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============ COLLABORATION PANEL ============ */
function CollaborationPanel() {
  const messages = [
    { from: 'Hydrologist', to: 'Feed Optimizer', text: 'O₂ dropping in Alpha-2. Reduce evening ration by 10%.', time: '2m' },
    { from: 'Harvest Planner', to: 'Cold Chain', text: 'Thursday harvest 480kg. Pre-cool Busia hub to 0°C.', time: '8m' },
    { from: 'Market Analyst', to: 'Harvest Planner', text: 'Kampala tilapia price ↑ 3.2%. Hold harvest for 48h?', time: '15m' },
    { from: 'Compliance', to: 'Hydrologist', text: 'NEMA audit Friday. Generate water quality report.', time: '32m' },
  ];
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Network className="w-4 h-4 text-cyan-400" />
        <h3 className="font-display font-semibold text-white text-sm">Agent Collaboration</h3>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
        </span>
      </div>
      <div className="space-y-2.5 max-h-[280px] overflow-y-auto scrollbar-none">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/10"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono mb-1">
              <span className="text-cyan-300 font-bold">{m.from}</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
              <span className="text-emerald-300 font-bold">{m.to}</span>
              <span className="ml-auto text-slate-500">{m.time} ago</span>
            </div>
            <p className="text-xs text-slate-300 font-sans">{m.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============ AGENT DETAIL MODAL ============ */
function AgentDetailModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="relative glass-strong rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="absolute top-3 right-3 z-10">
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-950/60 border border-white/10 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-2xl ${agent.bg}`}>
              <agent.icon className={`w-6 h-6 ${agent.color}`} />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-lg">{agent.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{agent.role}</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">{agent.specialty}</p>

          <div className="space-y-3">
            <div className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/10">
              <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Current Task</div>
              <div className="text-xs text-white flex items-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                />
                {agent.currentTask}
              </div>
            </div>

            <div className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Confidence Score</div>
                <div className={`text-sm font-bold ${agent.confidence >= 90 ? 'text-emerald-400' : agent.confidence >= 80 ? 'text-cyan-400' : 'text-orange-400'}`}>{agent.confidence}%</div>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${agent.confidence}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full ${agent.confidence >= 90 ? 'bg-emerald-400' : agent.confidence >= 80 ? 'bg-cyan-400' : 'bg-orange-400'}`}
                />
              </div>
            </div>

            <div className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/10">
              <div className="text-[10px] font-mono text-slate-500 uppercase mb-2">Recent Actions</div>
              <div className="space-y-2">
                {agent.recentActions.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    {a}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
