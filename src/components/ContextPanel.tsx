import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FarmStatus, ColdChainFacility } from '../types';
import {
  BrainCircuit, Droplets, Wind, Thermometer, Fish, Activity, TrendingUp,
  ShieldCheck, Clock, Sparkles, ChevronRight, Eye, Zap, Leaf, DollarSign,
  ShoppingCart, Users, Ship, Gauge, Award, GraduationCap, Target, Lightbulb,
  Cloud, CloudRain, Sun, ArrowRight, X, Radio, Anchor, Snowflake, Beaker
} from 'lucide-react';

interface ContextPanelProps {
  activeTab: string;
  farmStatus: FarmStatus | null;
  sustainabilityScore: number;
  facilities: ColdChainFacility[];
  onAskOI: (prompt: string) => void;
  onNavigate: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ContextPanel({ activeTab, farmStatus, sustainabilityScore, facilities, onAskOI, onNavigate, isOpen, onToggle }: ContextPanelProps) {
  return (
    <motion.aside
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: isOpen ? 320 : 48 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 bottom-0 z-40 glass-strong border-l border-cyan-500/15 flex flex-col"
    >
      {/* Toggle handle */}
      <button
        onClick={onToggle}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full glass-strong rounded-l-xl border-r-0 border border-cyan-500/20 p-1.5 hover:bg-cyan-500/10 transition-colors"
      >
        <motion.div animate={{ rotate: isOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
        </motion.div>
      </button>

      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto scrollbar-none"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              >
                {activeTab === 'mission' && <MissionContext farmStatus={farmStatus} sustainabilityScore={sustainabilityScore} onAskOI={onAskOI} onNavigate={onNavigate} />}
                {activeTab === 'farm' && <FarmContext farmStatus={farmStatus} facilities={facilities} onAskOI={onAskOI} />}
                {activeTab === 'marketplace' && <MarketplaceContext onAskOI={onAskOI} onNavigate={onNavigate} />}
                {activeTab === 'intelligence' && <IntelligenceContext onAskOI={onAskOI} />}
                {activeTab === 'academy' && <AcademyContext onAskOI={onAskOI} />}
                {!['mission', 'farm', 'marketplace', 'intelligence', 'academy'].includes(activeTab) && <GenericContext tab={activeTab} onAskOI={onAskOI} />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center py-4 gap-3"
          >
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="w-px h-8 bg-cyan-500/10" />
            <div className="text-[9px] font-mono text-cyan-400/40 uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>
              Context
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}

/* ============ HEADER ============ */
function PanelHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="px-4 py-3 border-b border-cyan-500/10 flex items-center gap-2.5">
      <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <Icon className="w-4 h-4 text-cyan-400" />
      </div>
      <div>
        <div className="font-display font-bold text-white text-xs">{title}</div>
        <div className="text-[9px] font-mono text-cyan-400/60 uppercase tracking-widest">{subtitle}</div>
      </div>
    </div>
  );
}

function ContextCard({ icon: Icon, label, value, sub, color, onClick }: { icon: React.ElementType; label: string; value: string; sub?: string; color: string; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/40 border border-cyan-500/10 hover:border-cyan-400/30 transition-all text-left"
    >
      <div className="p-1.5 rounded-lg bg-slate-900/60 shrink-0">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] font-mono text-slate-500 uppercase">{label}</div>
        <div className="text-xs font-bold text-white truncate">{value}</div>
        {sub && <div className="text-[9px] font-mono text-slate-500 truncate">{sub}</div>}
      </div>
    </motion.button>
  );
}

/* ============ MISSION CONTEXT ============ */
function MissionContext({ farmStatus, sustainabilityScore, onAskOI, onNavigate }: { farmStatus: FarmStatus | null; sustainabilityScore: number; onAskOI: (p: string) => void; onNavigate: (t: string) => void }) {
  const priorities = useMemo(() => {
    if (!farmStatus) return [];
    const list: { icon: React.ElementType; label: string; detail: string; color: string; action: string; tab?: string }[] = [];
    if (farmStatus.weather === 'storm') list.push({ icon: Cloud, label: 'Storm Protocol', detail: 'All vessels recalled', color: 'text-red-400', action: 'Analyze storm impact and recommend safety measures.' });
    if (farmStatus.dissolvedOxygenMgL < 5.5) list.push({ icon: Droplets, label: 'Low O₂ Alert', detail: `${farmStatus.dissolvedOxygenMgL} mg/L — aeration needed`, color: 'text-orange-400', action: 'What actions should I take for low dissolved oxygen?' });
    if (farmStatus.pendingOrders > 0) list.push({ icon: ShoppingCart, label: `${farmStatus.pendingOrders} Pending Orders`, detail: `Revenue $${farmStatus.todayRevenue.toFixed(0)}`, color: 'text-amber-400', action: 'Review pending orders and prioritize fulfillment.', tab: 'marketplace' });
    list.push({ icon: Fish, label: 'Biomass Check', detail: `${(farmStatus.totalBiomassKg / 1000).toFixed(1)}t across ${farmStatus.activeCages} cages`, color: 'text-emerald-400', action: 'Which cages are ready for partial harvest this week?' });
    return list;
  }, [farmStatus]);

  return (
    <div>
      <PanelHeader icon={Target} title="Mission Context" subtitle="Today's priorities" />
      <div className="p-3 space-y-3">
        {/* Executive briefing */}
        <div className="glass-luminous rounded-2xl p-3 space-y-2 liquid-glow">
          <div className="flex items-center gap-2">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-300" />
            </motion.div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/70">Executive Briefing</div>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {farmStatus ? `Biomass ${(farmStatus.totalBiomassKg / 1000).toFixed(1)}t · O₂ ${farmStatus.dissolvedOxygenMgL} mg/L · Revenue $${farmStatus.todayRevenue.toFixed(0)} · ${farmStatus.pendingOrders} pending` : 'Synthesizing...'}
          </p>
          <button
            onClick={() => onAskOI('Prepare today\'s executive briefing with priorities, risks, and recommendations.')}
            className="liquid-btn w-full py-2 rounded-xl bg-cyan-500 text-slate-950 text-[11px] font-bold hover:bg-cyan-400 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" /> Full briefing
          </button>
        </div>

        {/* Priorities */}
        <div className="space-y-2">
          <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/40 px-1">Priority Actions</div>
          {priorities.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: -2 }}
                onClick={() => p.tab ? onNavigate(p.tab) : onAskOI(p.action)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/40 border border-cyan-500/10 hover:border-cyan-400/30 transition-all text-left"
              >
                <div className="p-1.5 rounded-lg bg-slate-900/60 shrink-0">
                  <Icon className={`w-3.5 h-3.5 ${p.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white">{p.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{p.detail}</div>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-600" />
              </motion.button>
            );
          })}
        </div>

        {/* Risk analysis */}
        <div className="space-y-2">
          <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/40 px-1">Risk Analysis</div>
          <ContextCard icon={ShieldCheck} label="ESG Score" value={`${sustainabilityScore.toFixed(0)}/100`} sub="NEMA compliant" color="text-emerald-400" onClick={() => onAskOI('Generate ESG compliance summary for NEMA and LVBC.')} />
          <ContextCard icon={Activity} label="Mortality" value={farmStatus ? `${farmStatus.todayMortality}` : '—'} sub="Within baseline" color="text-cyan-400" onClick={() => onAskOI('Analyze mortality trends and flag anomalies.')} />
        </div>
      </div>
    </div>
  );
}

/* ============ FARM CONTEXT ============ */
function FarmContext({ farmStatus, facilities, onAskOI }: { farmStatus: FarmStatus | null; facilities: ColdChainFacility[]; onAskOI: (p: string) => void }) {
  if (!farmStatus) return <div className="p-4 text-center text-xs text-slate-500">Syncing telemetry...</div>;
  const isLowO2 = farmStatus.dissolvedOxygenMgL < 5.5;
  const alertFacilities = facilities.filter(f => f.status !== 'optimal');

  return (
    <div>
      <PanelHeader icon={Activity} title="Farm Context" subtitle="Live telemetry" />
      <div className="p-3 space-y-3">
        {/* Water quality */}
        <div className="space-y-2">
          <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/40 px-1">Water Quality</div>
          <ContextCard icon={Droplets} label="Dissolved O₂" value={`${farmStatus.dissolvedOxygenMgL} mg/L`} sub={isLowO2 ? 'Below threshold' : 'Healthy'} color={isLowO2 ? 'text-orange-400' : 'text-cyan-400'} onClick={() => onAskOI('Explain dissolved oxygen levels and recommend actions.')} />
          <ContextCard icon={Beaker} label="pH Level" value={`${farmStatus.ph}`} sub="Optimal range" color="text-teal-400" onClick={() => onAskOI('What does pH indicate for fish health?')} />
          <ContextCard icon={Activity} label="Turbidity" value={`${farmStatus.turbidityNTU} NTU`} sub={farmStatus.turbidityNTU > 3 ? 'Elevated' : 'Clear'} color="text-sky-400" onClick={() => onAskOI('Analyze turbidity and its impact on feeding.')} />
          <ContextCard icon={Thermometer} label="Lake Temp" value={`${farmStatus.lakeTempC}°C`} sub={`Ambient ${farmStatus.ambientTempC}°C`} color="text-orange-400" onClick={() => onAskOI('How does temperature affect fish metabolism?')} />
        </div>

        {/* Weather */}
        <div className="space-y-2">
          <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/40 px-1">Weather</div>
          <ContextCard icon={farmStatus.weather === 'storm' ? Cloud : farmStatus.weather === 'rain' ? CloudRain : Sun} label="Conditions" value={farmStatus.weather} sub={`Wind ${farmStatus.windKnots}kn`} color="text-cyan-400" onClick={() => onAskOI('Weather forecast and operational impact?')} />
        </div>

        {/* OI suggestions */}
        <div className="glass-luminous rounded-2xl p-3 space-y-2 liquid-glow">
          <div className="flex items-center gap-2">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30">
              <Lightbulb className="w-3.5 h-3.5 text-cyan-300" />
            </motion.div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/70">OI Suggestions</div>
          </div>
          <div className="space-y-1.5">
            <button onClick={() => onAskOI('Analyze the digital twin and recommend operational priorities for the next 24 hours.')} className="w-full text-left p-2 rounded-lg bg-slate-950/40 border border-cyan-500/10 hover:border-cyan-400/30 text-[11px] text-slate-300 transition-all">
              Recommend 24h priorities
            </button>
            <button onClick={() => onAskOI('Which cages need inspection today?')} className="w-full text-left p-2 rounded-lg bg-slate-950/40 border border-cyan-500/10 hover:border-cyan-400/30 text-[11px] text-slate-300 transition-all">
              Cage inspection schedule
            </button>
          </div>
        </div>

        {/* Cold chain alerts */}
        {alertFacilities.length > 0 && (
          <div className="space-y-2">
            <div className="text-[9px] font-mono uppercase tracking-widest text-orange-400/60 px-1 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> Cold Chain Alerts
            </div>
            {alertFacilities.map(f => (
              <ContextCard key={f.id} icon={Snowflake} label={f.name} value={`${f.temp}°C`} sub={f.status} color="text-orange-400" onClick={() => onAskOI(`Analyze facility ${f.name}: temp ${f.temp}°C, status ${f.status}.`)} />
            ))}
          </div>
        )}

        {/* Historical trends */}
        <div className="space-y-2">
          <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/40 px-1">Historical Trends</div>
          <ContextCard icon={TrendingUp} label="Biomass Growth" value="+2.4%" sub="vs last week" color="text-emerald-400" onClick={() => onAskOI('Show biomass growth trends over the last 30 days.')} />
          <ContextCard icon={Gauge} label="FCR" value="1.32" sub="Below industry avg" color="text-cyan-400" onClick={() => onAskOI('Explain feed conversion ratio and how we compare to industry benchmarks.')} />
        </div>
      </div>
    </div>
  );
}

/* ============ MARKETPLACE CONTEXT ============ */
function MarketplaceContext({ onAskOI, onNavigate }: { onAskOI: (p: string) => void; onNavigate: (t: string) => void }) {
  return (
    <div>
      <PanelHeader icon={ShoppingCart} title="Market Context" subtitle="Demand & logistics" />
      <div className="p-3 space-y-3">
        <ContextCard icon={TrendingUp} label="Tilapia Demand" value="+3.2%" sub="Kampala wholesale" color="text-emerald-400" onClick={() => onAskOI('Analyze tilapia demand trends in Kampala.')} />
        <ContextCard icon={DollarSign} label="Avg Order Value" value="$839" sub="USD" color="text-cyan-400" onClick={() => onAskOI('Break down average order value by customer segment.')} />
        <ContextCard icon={ShoppingCart} label="Pending Orders" value="12" sub="Awaiting fulfillment" color="text-amber-400" onClick={() => onAskOI('Review pending orders and prioritize fulfillment.')} />
        <ContextCard icon={Ship} label="Logistics" value="Busia → Kampala" sub="Cold chain -24°C" color="text-blue-400" onClick={() => onAskOI('Review logistics and delivery routes.')} />
        <ContextCard icon={Users} label="Active Customers" value="47" sub="Restaurants & retailers" color="text-teal-400" onClick={() => onAskOI('Customer segmentation and top buyers analysis.')} />

        <div className="glass-luminous rounded-2xl p-3 space-y-2 liquid-glow">
          <div className="flex items-center gap-2">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-400/30">
              <BrainCircuit className="w-3.5 h-3.5 text-amber-300" />
            </motion.div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400/70">OI Pricing</div>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Hold inventory 48h to capture premium. Kampala prices rising.
          </p>
          <button onClick={() => onAskOI('Review marketplace pricing and suggest adjustments based on demand.')} className="w-full py-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold hover:bg-amber-500/25 flex items-center justify-center gap-1.5">
            Review pricing <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ INTELLIGENCE CONTEXT ============ */
function IntelligenceContext({ onAskOI }: { onAskOI: (p: string) => void }) {
  return (
    <div>
      <PanelHeader icon={BrainCircuit} title="AI Workforce" subtitle="Agent status" />
      <div className="p-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="glass-panel rounded-xl p-3 text-center">
            <div className="text-2xl font-display font-bold text-cyan-400">6</div>
            <div className="text-[9px] font-mono text-slate-500 uppercase">Active agents</div>
          </div>
          <div className="glass-panel rounded-xl p-3 text-center">
            <div className="text-2xl font-display font-bold text-emerald-400">89%</div>
            <div className="text-[9px] font-mono text-slate-500 uppercase">Avg confidence</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/40 px-1">Agent Collaboration</div>
          {[
            { from: 'Hydrologist', to: 'Feed Optimizer', msg: 'Reduce evening ration 10%', color: 'text-cyan-400' },
            { from: 'Harvest Planner', to: 'Cold Chain', msg: 'Pre-cool Busia hub to 0°C', color: 'text-amber-400' },
            { from: 'Market Analyst', to: 'Harvest Planner', msg: 'Hold harvest 48h for premium', color: 'text-emerald-400' },
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-950/40 rounded-xl p-2.5 border border-cyan-500/10"
            >
              <div className="flex items-center gap-1.5 text-[9px] font-mono mb-1">
                <span className={`font-bold ${m.color}`}>{m.from}</span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                <span className="text-emerald-300 font-bold">{m.to}</span>
              </div>
              <p className="text-[10px] text-slate-300">{m.msg}</p>
            </motion.div>
          ))}
        </div>

        <button onClick={() => onAskOI('Show all agent reasoning and current tasks.')} className="liquid-btn w-full py-2 rounded-xl bg-cyan-500 text-slate-950 text-[11px] font-bold hover:bg-cyan-400 flex items-center justify-center gap-1.5">
          <Eye className="w-3 h-3" /> View all reasoning
        </button>
      </div>
    </div>
  );
}

/* ============ ACADEMY CONTEXT ============ */
function AcademyContext({ onAskOI }: { onAskOI: (p: string) => void }) {
  return (
    <div>
      <PanelHeader icon={GraduationCap} title="Academy Context" subtitle="Progress & tutor" />
      <div className="p-3 space-y-3">
        <div className="glass-panel rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Progress</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-display font-bold text-white">Level 3</div>
          <div className="text-[10px] font-mono text-cyan-400">120 / 150 pts to certify</div>
          <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" style={{ width: '80%' }} />
          </div>
        </div>

        <ContextCard icon={Award} label="Certification" value="In Progress" sub="150 pts required" color="text-amber-400" onClick={() => onAskOI('What do I need to get certified?')} />
        <ContextCard icon={GraduationCap} label="Lessons Mastered" value="2 / 3" sub="67% complete" color="text-emerald-400" onClick={() => onAskOI('Which lessons should I complete next?')} />

        <div className="glass-luminous rounded-2xl p-3 space-y-2 liquid-glow">
          <div className="flex items-center gap-2">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-300" />
            </motion.div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/70">AI Tutor</div>
          </div>
          <div className="space-y-1.5">
            <button onClick={() => onAskOI('Explain cage aquaculture basics')} className="w-full text-left p-2 rounded-lg bg-slate-950/40 border border-cyan-500/10 hover:border-cyan-400/30 text-[11px] text-slate-300 transition-all">
              Explain cage aquaculture
            </button>
            <button onClick={() => onAskOI('How does dissolved oxygen affect fish?')} className="w-full text-left p-2 rounded-lg bg-slate-950/40 border border-cyan-500/10 hover:border-cyan-400/30 text-[11px] text-slate-300 transition-all">
              O₂ and fish health
            </button>
            <button onClick={() => onAskOI('Why is cold chain important?')} className="w-full text-left p-2 rounded-lg bg-slate-950/40 border border-cyan-500/10 hover:border-cyan-400/30 text-[11px] text-slate-300 transition-all">
              Cold chain importance
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/40 px-1">Study Recommendations</div>
          <ContextCard icon={Leaf} label="Next Lesson" value="Sustainable Feed" sub="15 min · 25 pts" color="text-emerald-400" onClick={() => onAskOI('Recommend a study plan for certification.')} />
        </div>
      </div>
    </div>
  );
}

/* ============ GENERIC CONTEXT ============ */
function GenericContext({ tab, onAskOI }: { tab: string; onAskOI: (p: string) => void }) {
  const labels: Record<string, string> = {
    reports: 'Reports & Documents',
    operations: 'Operations Hub',
    customers: 'Customer Relations',
    fleet: 'Fleet Management',
    research: 'R&D Laboratory',
    settings: 'System Settings',
  };
  return (
    <div>
      <PanelHeader icon={Sparkles} title={labels[tab] || 'Workspace'} subtitle="OI Context" />
      <div className="p-3 space-y-3">
        <div className="glass-luminous rounded-2xl p-3 space-y-2 liquid-glow">
          <div className="flex items-center gap-2">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-300" />
            </motion.div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/70">OI Assistant</div>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Ask OI to generate reports, analyze data, or perform tasks for this workspace.
          </p>
          <button
            onClick={() => onAskOI(`Provide an overview of ${labels[tab] || tab} and what I can do here.`)}
            className="liquid-btn w-full py-2 rounded-xl bg-cyan-500 text-slate-950 text-[11px] font-bold hover:bg-cyan-400 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" /> Ask OI for overview
          </button>
        </div>
      </div>
    </div>
  );
}
