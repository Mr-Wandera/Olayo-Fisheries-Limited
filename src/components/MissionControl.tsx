import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FarmEvent, FarmStatus } from '../types';
import {
  Activity, Droplets, Waves, Wind, Thermometer, Fish, Users, Ship, ShoppingCart,
  DollarSign, Leaf, BrainCircuit, Wrench, GraduationCap, Heart, TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle2, Info, Cloud, CloudRain, CloudLightning, Sun, Clock, RefreshCw,
  Radio, TrendingUp, TrendingDown, ArrowUpRight, Sparkles, Gauge, Zap, Eye, ChevronRight, Compass,
  ShieldCheck
} from 'lucide-react';

const CATEGORY_META: Record<string, { icon: React.ElementType; color: string; label: string; bg: string }> = {
  feeding: { icon: Fish, color: 'text-emerald-400', label: 'Feeding', bg: 'bg-emerald-500/10' },
  water: { icon: Droplets, color: 'text-cyan-400', label: 'Water', bg: 'bg-cyan-500/10' },
  harvest: { icon: Leaf, color: 'text-teal-400', label: 'Harvest', bg: 'bg-teal-500/10' },
  fleet: { icon: Ship, color: 'text-blue-400', label: 'Fleet', bg: 'bg-blue-500/10' },
  marketplace: { icon: ShoppingCart, color: 'text-amber-400', label: 'Marketplace', bg: 'bg-amber-500/10' },
  quality: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Quality', bg: 'bg-emerald-500/10' },
  finance: { icon: DollarSign, color: 'text-emerald-400', label: 'Finance', bg: 'bg-emerald-500/10' },
  research: { icon: GraduationCap, color: 'text-violet-400', label: 'Research', bg: 'bg-violet-500/10' },
  community: { icon: Heart, color: 'text-rose-400', label: 'Community', bg: 'bg-rose-500/10' },
  maintenance: { icon: Wrench, color: 'text-orange-400', label: 'Maintenance', bg: 'bg-orange-500/10' },
  weather: { icon: Cloud, color: 'text-sky-400', label: 'Weather', bg: 'bg-sky-500/10' },
  ai: { icon: BrainCircuit, color: 'text-cyan-400', label: 'OI', bg: 'bg-cyan-500/10' },
};

const SEVERITY_RING: Record<string, string> = {
  info: 'border-cyan-500/15',
  success: 'border-emerald-500/25',
  warning: 'border-orange-500/40',
  critical: 'border-red-500/50',
};

function timeAgo(iso: string, now: number): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return hrs < 24 ? `${hrs}h ${rem}m ago` : `${Math.floor(hrs / 24)}d ago`;
}

function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface MissionControlProps {
  sustainabilityScore: number;
  onAskOI?: (prompt: string) => void;
}

export default function MissionControl({ sustainabilityScore, onAskOI }: MissionControlProps) {
  const [status, setStatus] = useState<FarmStatus | null>(null);
  const [events, setEvents] = useState<FarmEvent[]>([]);
  const [now, setNow] = useState<number>(Date.now());
  const [isLive, setIsLive] = useState<boolean>(true);
  const [lastTickAt, setLastTickAt] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [focusPanel, setFocusPanel] = useState<'auto' | 'weather' | 'production' | 'market' | 'quality'>('auto');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/farm-status');
      const data = await res.json();
      setStatus(data);
    } catch (e) { console.error('farm-status error', e); }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/timeline?limit=24');
      const data = await res.json();
      setEvents(data);
    } catch (e) { console.error('timeline error', e); }
    finally { setLoading(false); }
  }, []);

  const tick = useCallback(async () => {
    try {
      const res = await fetch('/api/timeline/tick', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLastTickAt(new Date().toISOString());
        await fetchEvents();
        await fetchStatus();
      }
    } catch (e) { console.error('tick error', e); }
  }, [fetchEvents, fetchStatus]);

  useEffect(() => {
    fetchStatus();
    fetchEvents();
  }, [fetchStatus, fetchEvents]);

  useEffect(() => {
    const clock = setInterval(() => setNow(Date.now()), 1000);
    let tickTimer: ReturnType<typeof setInterval> | null = null;
    if (isLive) {
      tickTimer = setInterval(() => { tick(); }, 20000);
    }
    return () => {
      clearInterval(clock);
      if (tickTimer) clearInterval(tickTimer);
    };
  }, [isLive, tick]);

  const detectedFocus = useMemo(() => {
    if (!status) return 'auto';
    if (status.weather === 'storm' || status.weather === 'rain') return 'weather';
    if (status.dissolvedOxygenMgL < 5.5) return 'quality';
    if (status.pendingOrders > 6) return 'market';
    return 'production';
  }, [status]);

  const activeFocus = focusPanel === 'auto' ? detectedFocus : focusPanel;

  const todLabel = status ? {
    morning: 'Morning Mist', midday: 'Midday Operations', afternoon: 'Afternoon Shift',
    golden: 'Golden Hour', sunset: 'Sunset Watch', night: 'Night Watch', midnight: 'Deep Night',
  }[status.timeOfDay] : '';

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <h3 className="font-display font-bold text-white text-lg sm:text-xl">Mission Control</h3>
            <span className="text-[10px] font-mono text-cyan-400/60 hidden sm:inline">· Living Workspace</span>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Busiime Cage Grid · {todLabel} · {status ? `${status.weather} · wind ${status.windKnots} kn` : 'syncing…'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FocusSelector focus={focusPanel} onChange={setFocusPanel} detected={detectedFocus} />
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${isLive ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-400' : 'bg-slate-950 border-cyan-500/15 text-slate-400'}`}
          >
            <Radio className="w-3.5 h-3.5" />
            {isLive ? 'LIVE' : 'PAUSED'}
          </button>
          <button
            onClick={tick}
            className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all"
            title="Advance simulation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFocus}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        >
          <FocusPanel focus={activeFocus} status={status} sustainabilityScore={sustainabilityScore} onAskOI={onAskOI} />
        </motion.div>
      </AnimatePresence>

      {status && <VitalFlow status={status} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LivingTimeline events={events} loading={loading} now={now} lastTickAt={lastTickAt} />
        </div>
        <div className="space-y-6">
          <CageVitals status={status} />
          <OIBriefing status={status} sustainabilityScore={sustainabilityScore} onAskOI={onAskOI} />
        </div>
      </div>
    </section>
  );
}

function FocusSelector({ focus, onChange, detected }: { focus: string; onChange: (f: any) => void; detected: string }) {
  const options = [
    { id: 'auto', label: 'Auto', icon: Sparkles },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'production', label: 'Production', icon: Fish },
    { id: 'market', label: 'Market', icon: ShoppingCart },
    { id: 'quality', label: 'Quality', icon: ShieldCheck },
  ];
  return (
    <div className="hidden sm:flex items-center bg-slate-950/60 border border-cyan-500/10 p-1 rounded-xl">
      {options.map(o => {
        const Icon = o.icon;
        const isActive = focus === o.id;
        const isDetected = focus === 'auto' && detected === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`relative flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${isActive || isDetected ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Icon className="w-3 h-3" />
            {o.label}
            {isDetected && <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />}
          </button>
        );
      })}
    </div>
  );
}

function FocusPanel({ focus, status, sustainabilityScore, onAskOI }: { focus: string; status: FarmStatus | null; sustainabilityScore: number; onAskOI?: (p: string) => void }) {
  if (!status) return null;

  if (focus === 'weather') {
    const isStorm = status.weather === 'storm';
    const isRain = status.weather === 'rain';
    return (
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 ${isStorm ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 border border-blue-500/30' : isRain ? 'bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-950 border border-cyan-500/25' : 'glass-luminous'}`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-breathe" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, 4, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className={`p-4 rounded-2xl ${isStorm ? 'bg-blue-500/20 border border-blue-400/40' : isRain ? 'bg-cyan-500/20 border border-cyan-400/40' : 'bg-amber-500/20 border border-amber-400/40'}`}
            >
              {isStorm ? <CloudLightning className="w-8 h-8 text-blue-300" /> : isRain ? <CloudRain className="w-8 h-8 text-cyan-300" /> : <Sun className="w-8 h-8 text-amber-300" />}
            </motion.div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/70 mb-1">Weather Intelligence · Active</div>
              <h4 className="font-display font-bold text-white text-xl sm:text-2xl capitalize">{status.weather} conditions</h4>
              <p className="text-xs text-slate-400 mt-1">
                Wind {status.windKnots} knots · Lake temp {status.lakeTempC}°C · Ambient {status.ambientTempC}°C
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-cyan-500/15">
              <Ship className={`w-4 h-4 ${isStorm ? 'text-red-400' : 'text-emerald-400'}`} />
              <span className="text-slate-300">{isStorm ? 'All vessels recalled to dock' : `${status.boatsActive} vessels operating`}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-cyan-500/15">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">{status.staffOnDuty} staff on duty</span>
            </div>
          </div>
        </div>
        {(isStorm || isRain) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-xs text-orange-200">
              <span className="font-bold">OI Advisory:</span> Feeding adjusted for runoff dilution. Cage inspections deferred. Turbidity monitoring active at {status.turbidityNTU} NTU.
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  if (focus === 'production') {
    return (
      <div className="glass-luminous rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-breathe" />
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70 mb-2">Total Biomass</div>
            <div className="font-display font-extrabold text-white text-3xl sm:text-4xl">{(status.totalBiomassKg / 1000).toFixed(1)}t</div>
            <div className="text-xs text-slate-400 mt-1">{status.totalPopulation.toLocaleString()} fish across {status.activeCages} cages</div>
            <div className="flex items-center gap-1 mt-2 text-[10px] font-mono text-emerald-400">
              <TrendingUp className="w-3 h-3" /> +2.4% vs last week
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/70 mb-2">Feed Today</div>
            <div className="font-display font-extrabold text-white text-3xl sm:text-4xl">{status.todayFeedKg}<span className="text-base text-slate-400">kg</span></div>
            <div className="text-xs text-slate-400 mt-1">FCR holding at 1.32</div>
            <div className="flex items-center gap-1 mt-2 text-[10px] font-mono text-cyan-400">
              <Activity className="w-3 h-3" /> Optimal distribution
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-rose-400/70 mb-2">Mortality Today</div>
            <div className="font-display font-extrabold text-white text-3xl sm:text-4xl">{status.todayMortality}</div>
            <div className="text-xs text-slate-400 mt-1">Within natural baseline</div>
            <div className="flex items-center gap-1 mt-2 text-[10px] font-mono text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> No anomalies
            </div>
          </div>
        </div>
        <button
          onClick={() => onAskOI?.('Which cages are ready for partial harvest this week?')}
          className="relative z-10 mt-5 flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200 font-semibold group"
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          Ask OI for harvest recommendations
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  if (focus === 'market') {
    return (
      <div className="glass-luminous rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-breathe" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400/70 mb-2">Marketplace Intelligence</div>
            <h4 className="font-display font-bold text-white text-xl">{status.pendingOrders} pending orders</h4>
            <p className="text-xs text-slate-400 mt-1">Today's confirmed revenue</p>
            <div className="font-display font-extrabold text-emerald-400 text-3xl mt-1">${status.todayRevenue.toFixed(0)}<span className="text-base text-slate-500"> USD</span></div>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-cyan-500/15">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Demand: <span className="font-bold text-emerald-400">HIGH</span></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-cyan-500/15">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">Kampala wholesale ↑ 3.2%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (focus === 'quality') {
    const isLowO2 = status.dissolvedOxygenMgL < 5.5;
    return (
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 ${isLowO2 ? 'bg-gradient-to-br from-slate-900 via-orange-950/40 to-slate-950 border border-orange-500/30' : 'glass-luminous'}`}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-breathe" />
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QualityMetric icon={Droplets} label="Dissolved O₂" value={`${status.dissolvedOxygenMgL}`} unit="mg/L" status={isLowO2 ? 'warning' : 'good'} />
          <QualityMetric icon={Activity} label="pH" value={`${status.ph}`} unit="" status="good" />
          <QualityMetric icon={Waves} label="Turbidity" value={`${status.turbidityNTU}`} unit="NTU" status={status.turbidityNTU > 3 ? 'warning' : 'good'} />
          <QualityMetric icon={Thermometer} label="Lake Temp" value={`${status.lakeTempC}`} unit="°C" status="good" />
        </div>
        {isLowO2 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-start gap-2"
          >
            <Zap className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-xs text-orange-200">
              <span className="font-bold">OI Action:</span> Aeration standby engaged. Night watch rotation confirmed.
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-luminous rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-breathe" />
      <div className="relative z-10 flex items-start gap-4">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-400/30"
        >
          <BrainCircuit className="w-6 h-6 text-cyan-300" />
        </motion.div>
        <div className="flex-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/70 mb-1">Olayo Intelligence · Live Briefing</div>
          <p className="text-sm text-slate-200 leading-relaxed">
            Farm operating within nominal parameters. Biomass {(status.totalBiomassKg / 1000).toFixed(1)}t across {status.activeCages} cages.
            Dissolved oxygen at {status.dissolvedOxygenMgL} mg/L is {status.dissolvedOxygenMgL < 5.5 ? 'trending low — aeration standby recommended' : 'healthy'}.
            Today's revenue ${status.todayRevenue.toFixed(0)} with {status.pendingOrders} pending orders. Sustainability index {sustainabilityScore.toFixed(0)}/100.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px] font-mono">
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><Leaf className="w-3 h-3" /> NEMA</span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"><ShieldCheck className="w-3 h-3" /> LVBC</span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/60 border border-cyan-500/10 text-slate-400"><Fish className="w-3 h-3" /> FCR 1.32</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QualityMetric({ icon: Icon, label, value, unit, status }: { icon: any; label: string; value: string; unit: string; status: 'good' | 'warning' | 'critical' }) {
  const color = status === 'good' ? 'text-emerald-400' : status === 'warning' ? 'text-orange-400' : 'text-red-400';
  return (
    <div className="bg-slate-950/40 rounded-2xl p-3 border border-cyan-500/10">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-mono text-slate-500 uppercase">{label}</span>
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>
      <div className={`font-display font-bold text-lg ${color}`}>{value}<span className="text-xs text-slate-500 ml-1">{unit}</span></div>
    </div>
  );
}

function VitalFlow({ status }: { status: FarmStatus }) {
  const vitals = [
    { icon: Thermometer, label: 'Lake Temp', value: `${status.lakeTempC}°C`, sub: `ambient ${status.ambientTempC}°C`, accent: 'text-orange-400', trend: '+0.2' },
    { icon: Droplets, label: 'Dissolved O₂', value: `${status.dissolvedOxygenMgL}`, sub: 'mg/L', accent: 'text-cyan-400', pulse: status.dissolvedOxygenMgL < 5.5, trend: status.dissolvedOxygenMgL < 5.5 ? '↓' : '→' },
    { icon: Activity, label: 'pH', value: `${status.ph}`, sub: `turbidity ${status.turbidityNTU}`, accent: 'text-teal-400', trend: '→' },
    { icon: Wind, label: 'Wind', value: `${status.windKnots}kn`, sub: status.weather, accent: 'text-sky-400', trend: '→' },
    { icon: Fish, label: 'Biomass', value: `${(status.totalBiomassKg / 1000).toFixed(1)}t`, sub: `${status.totalPopulation.toLocaleString()} fish`, accent: 'text-emerald-400', trend: '↑' },
    { icon: Users, label: 'Staff', value: `${status.staffOnDuty}`, sub: `${status.boatsActive} boats`, accent: 'text-blue-400', trend: '→' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {vitals.map((v, i) => (
        <motion.div
          key={v.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 25 }}
          whileHover={{ y: -3, scale: 1.02 }}
          className="glass-panel rounded-2xl p-4 flex flex-col justify-between min-h-[100px] relative overflow-hidden group cursor-default"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{v.label}</span>
            <v.icon className={`w-4 h-4 ${v.accent} ${v.pulse ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="font-display font-extrabold text-white text-lg sm:text-xl leading-tight">{v.value}</div>
            {v.sub && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{v.sub}</div>}
          </div>
          <div className={`absolute top-2 right-2 text-[9px] font-mono ${v.trend === '↑' ? 'text-emerald-400' : v.trend === '↓' ? 'text-orange-400' : 'text-slate-600'}`}>
            {v.trend}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function LivingTimeline({ events, loading, now, lastTickAt }: { events: FarmEvent[]; loading: boolean; now: number; lastTickAt: string | null }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="flex justify-between items-center border-b border-cyan-500/10 px-5 py-3">
        <h4 className="font-display font-semibold text-white text-sm flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-cyan-400" /> Operational Timeline
        </h4>
        <span className="text-[10px] font-mono text-slate-500">
          {lastTickAt ? `last tick ${timeAgo(lastTickAt, now)}` : 'awaiting first tick'}
        </span>
      </div>
      <div className="max-h-[480px] overflow-y-auto px-4 py-3 space-y-2.5 scrollbar-none">
        <AnimatePresence initial={false}>
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">Loading operational history…</div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">No events recorded yet.</div>
          ) : events.map((evt) => {
            const meta = CATEGORY_META[evt.category] || CATEGORY_META.water;
            const Icon = meta.icon;
            const SevIcon = evt.severity === 'critical' || evt.severity === 'warning' ? AlertTriangle : evt.severity === 'success' ? CheckCircle2 : Info;
            const isHovered = hovered === evt.id;
            return (
              <motion.div
                key={evt.id}
                layout
                initial={{ opacity: 0, x: -16, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                onMouseEnter={() => setHovered(evt.id)}
                onMouseLeave={() => setHovered(null)}
                className={`flex gap-3 bg-slate-950/40 border ${SEVERITY_RING[evt.severity]} rounded-xl p-3 transition-all ${isHovered ? 'scale-[1.01] bg-slate-950/70' : ''}`}
              >
                <div className={`shrink-0 w-9 h-9 rounded-lg ${meta.bg} border border-cyan-500/10 flex items-center justify-center ${meta.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-semibold text-white leading-snug">{evt.title}</span>
                    <span className="text-[9px] font-mono text-slate-500 shrink-0">{clockTime(evt.timestamp)}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed mt-1">{evt.description}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono text-slate-500">
                    <span className={`px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-500/10 ${meta.color}`}>{meta.label}</span>
                    <span>· {evt.actor}</span>
                    {evt.location && <span className="truncate hidden sm:inline">· {evt.location}</span>}
                    <span className="ml-auto flex items-center gap-1">
                      <SevIcon className={`w-3 h-3 ${evt.severity === 'critical' || evt.severity === 'warning' ? 'text-orange-400' : 'text-slate-500'}`} />
                      {timeAgo(evt.timestamp, now)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CageVitals({ status }: { status: FarmStatus | null }) {
  if (!status) return null;
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="border-b border-cyan-500/10 px-5 py-3">
        <h4 className="font-display font-semibold text-white text-sm flex items-center gap-1.5">
          <Waves className="w-4 h-4 text-cyan-400" /> Cage Grid Vitals
        </h4>
      </div>
      <div className="p-4 space-y-2.5 max-h-[300px] overflow-y-auto scrollbar-none">
        {status.cages.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-950/40 border border-cyan-500/10 rounded-xl p-3 hover:border-cyan-400/30 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-white">{c.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{c.species}</div>
              </div>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${c.healthScore >= 90 ? 'bg-emerald-950 text-emerald-400' : c.healthScore >= 80 ? 'bg-cyan-950 text-cyan-400' : 'bg-orange-950 text-orange-400'}`}>
                {c.healthScore}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-[9px] font-mono">
              <div>
                <div className="text-slate-500">Biomass</div>
                <div className="text-white">{(c.biomassKg / 1000).toFixed(1)}t</div>
              </div>
              <div>
                <div className="text-slate-500">O₂</div>
                <div className={c.dissolvedOxygenMgL < 5.5 ? 'text-orange-400' : 'text-cyan-400'}>{c.dissolvedOxygenMgL}</div>
              </div>
              <div>
                <div className="text-slate-500">Feed</div>
                <div className="text-emerald-400">{c.feedTodayKg}kg</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OIBriefing({ status, sustainabilityScore, onAskOI }: { status: FarmStatus | null; sustainabilityScore: number; onAskOI?: (p: string) => void }) {
  const [thinking, setThinking] = useState(false);
  return (
    <div className="glass-luminous rounded-3xl p-5 space-y-3 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30"
          >
            <BrainCircuit className="w-4 h-4 text-cyan-300" />
          </motion.div>
          <h4 className="font-display font-semibold text-white text-sm">OI Briefing</h4>
          <span className="ml-auto text-[9px] font-mono text-cyan-400/60">v3.5 · Gemini</span>
        </div>
        <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
          {status ? (
            <>
              Biomass {(status.totalBiomassKg / 1000).toFixed(1)}t across {status.activeCages} cages. O₂ {status.dissolvedOxygenMgL} mg/L is {status.dissolvedOxygenMgL < 5.5 ? 'low — aeration standby' : 'healthy'}. Revenue ${status.todayRevenue.toFixed(0)} · {status.pendingOrders} pending. ESG {sustainabilityScore.toFixed(0)}/100.
            </>
          ) : 'Synthesizing operational state…'}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {['Water quality?', 'Harvest ready?', 'Pricing review?'].map(q => (
            <button
              key={q}
              onClick={() => { setThinking(true); onAskOI?.(q); setTimeout(() => setThinking(false), 800); }}
              className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-cyan-500/15 text-[10px] font-mono text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/30 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
        {thinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/70"
          >
            <Sparkles className="w-3 h-3 animate-pulse" /> OI is analyzing...
          </motion.div>
        )}
      </div>
    </div>
  );
}
