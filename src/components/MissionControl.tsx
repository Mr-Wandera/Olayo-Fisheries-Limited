import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FarmEvent, FarmStatus } from '../types';
import { Activity, Droplets, Waves, Wind, Thermometer, Fish, Users, Ship, ShoppingCart, DollarSign, Leaf, BrainCircuit, Wrench, GraduationCap, Heart, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Info, Cloud, CloudRain, CloudLightning, Sun, Clock, RefreshCw, Radio } from 'lucide-react';

const CATEGORY_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  feeding: { icon: Fish, color: 'text-emerald-400', label: 'Feeding' },
  water: { icon: Droplets, color: 'text-cyan-400', label: 'Water' },
  harvest: { icon: Leaf, color: 'text-teal-400', label: 'Harvest' },
  fleet: { icon: Ship, color: 'text-blue-400', label: 'Fleet' },
  marketplace: { icon: ShoppingCart, color: 'text-amber-400', label: 'Marketplace' },
  quality: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Quality' },
  finance: { icon: DollarSign, color: 'text-emerald-400', label: 'Finance' },
  research: { icon: GraduationCap, color: 'text-violet-400', label: 'Research' },
  community: { icon: Heart, color: 'text-rose-400', label: 'Community' },
  maintenance: { icon: Wrench, color: 'text-orange-400', label: 'Maintenance' },
  weather: { icon: Cloud, color: 'text-sky-400', label: 'Weather' },
  ai: { icon: BrainCircuit, color: 'text-cyan-400', label: 'OI' },
};

const SEVERITY_RING: Record<string, string> = {
  info: 'border-cyan-500/20',
  success: 'border-emerald-500/30',
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

function WeatherIcon({ weather, className }: { weather: FarmStatus['weather']; className?: string }) {
  const map = {
    clear: Sun,
    cloudy: Cloud,
    rain: CloudRain,
    storm: CloudLightning,
  };
  const Icon = map[weather] || Cloud;
  return <Icon className={className} />;
}

interface VitalCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent: string;
  pulse?: boolean;
}

function VitalCard({ icon: Icon, label, value, sub, accent, pulse }: VitalCardProps) {
  return (
    <div className="bg-slate-950/60 border border-cyan-500/10 rounded-2xl p-4 backdrop-blur-md flex flex-col justify-between min-h-[96px]">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{label}</span>
        <Icon className={`w-4 h-4 ${accent} ${pulse ? 'animate-pulse' : ''}`} />
      </div>
      <div>
        <div className="font-display font-extrabold text-white text-lg sm:text-xl leading-tight">{value}</div>
        {sub && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

interface MissionControlProps {
  sustainabilityScore: number;
}

export default function MissionControl({ sustainabilityScore }: MissionControlProps) {
  const [status, setStatus] = useState<FarmStatus | null>(null);
  const [events, setEvents] = useState<FarmEvent[]>([]);
  const [now, setNow] = useState<number>(Date.now());
  const [isLive, setIsLive] = useState<boolean>(true);
  const [lastTickAt, setLastTickAt] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/farm-status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error('farm-status error', e);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/timeline?limit=24');
      const data = await res.json();
      setEvents(data);
    } catch (e) {
      console.error('timeline error', e);
    } finally {
      setLoading(false);
    }
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
    } catch (e) {
      console.error('tick error', e);
    }
  }, [fetchEvents, fetchStatus]);

  useEffect(() => {
    fetchStatus();
    fetchEvents();
  }, [fetchStatus, fetchEvents]);

  // Live clock + periodic simulation ticks
  useEffect(() => {
    const clock = setInterval(() => setNow(Date.now()), 1000);
    let tickTimer: ReturnType<typeof setInterval> | null = null;
    if (isLive) {
      tickTimer = setInterval(() => {
        tick();
      }, 15000);
    }
    return () => {
      clearInterval(clock);
      if (tickTimer) clearInterval(tickTimer);
    };
  }, [isLive, tick]);

  const todLabel = status ? {
    morning: 'Morning Mist', midday: 'Midday Operations', afternoon: 'Afternoon Shift',
    golden: 'Golden Hour', sunset: 'Sunset Watch', night: 'Night Watch', midnight: 'Deep Night',
  }[status.timeOfDay] : '';

  return (
    <section className="space-y-6">
      {/* Header strip */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <h3 className="font-display font-bold text-white text-base sm:text-lg">Mission Control — Live Farm Operations</h3>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Busiime Cage Grid, Lake Victoria · {todLabel} · {status ? `${status.weather} · wind ${status.windKnots} kn` : 'syncing…'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${isLive ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-400' : 'bg-slate-950 border-cyan-500/15 text-slate-400'}`}
          >
            <Radio className="w-3.5 h-3.5" />
            {isLive ? 'LIVE' : 'PAUSED'}
          </button>
          <button
            onClick={tick}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Advance
          </button>
        </div>
      </div>

      {/* Vital signs grid */}
      {status && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <VitalCard icon={Thermometer} label="Lake Temp" value={`${status.lakeTempC}°C`} sub={`ambient ${status.ambientTempC}°C`} accent="text-orange-400" />
          <VitalCard icon={Droplets} label="Dissolved O₂" value={`${status.dissolvedOxygenMgL}`} sub="mg/L" accent="text-cyan-400" pulse={status.dissolvedOxygenMgL < 5.5} />
          <VitalCard icon={Activity} label="pH" value={`${status.ph}`} sub={`turbidity ${status.turbidityNTU} NTU`} accent="text-teal-400" />
          <VitalCard icon={Wind} label="Wind" value={`${status.windKnots} kn`} sub={status.weather} accent="text-sky-400" />
          <VitalCard icon={Fish} label="Total Biomass" value={`${(status.totalBiomassKg / 1000).toFixed(1)}t`} sub={`${status.totalPopulation.toLocaleString()} fish`} accent="text-emerald-400" />
          <VitalCard icon={Users} label="Staff On Duty" value={`${status.staffOnDuty}`} sub={`${status.boatsActive} boats active`} accent="text-blue-400" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Living timeline — 2 cols */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-cyan-500/15 rounded-2xl backdrop-blur-md overflow-hidden">
          <div className="flex justify-between items-center border-b border-cyan-500/10 px-5 py-3">
            <h4 className="font-display font-semibold text-white text-xs sm:text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" /> Operational Timeline
            </h4>
            <span className="text-[10px] font-mono text-slate-500">
              {lastTickAt ? `last tick ${timeAgo(lastTickAt, now)}` : 'awaiting first tick'}
            </span>
          </div>
          <div className="max-h-[460px] overflow-y-auto px-5 py-4 space-y-3">
            <AnimatePresence initial={false}>
              {loading ? (
                <div className="text-center py-12 text-slate-500 text-xs font-mono">Loading operational history…</div>
              ) : events.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-mono">No events recorded yet.</div>
              ) : events.map((evt) => {
                const meta = CATEGORY_META[evt.category] || CATEGORY_META.water;
                const Icon = meta.icon;
                const sevIcon = evt.severity === 'critical' ? AlertTriangle : evt.severity === 'warning' ? AlertTriangle : evt.severity === 'success' ? CheckCircle2 : Info;
                const SevIcon = sevIcon;
                return (
                  <motion.div
                    key={evt.id}
                    layout
                    initial={{ opacity: 0, x: -16, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    className={`flex gap-3 bg-slate-950/50 border ${SEVERITY_RING[evt.severity]} rounded-xl p-3`}
                  >
                    <div className={`shrink-0 w-9 h-9 rounded-lg bg-slate-900 border border-cyan-500/10 flex items-center justify-center ${meta.color}`}>
                      <Icon className="w-4.5 h-4.5" />
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
                        {evt.location && <span className="truncate">· {evt.location}</span>}
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

        {/* Cage grid + OI briefing — 1 col */}
        <div className="space-y-6">
          {/* Cage vitals */}
          <div className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl backdrop-blur-md overflow-hidden">
            <div className="border-b border-cyan-500/10 px-5 py-3">
              <h4 className="font-display font-semibold text-white text-xs sm:text-sm flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-cyan-400" /> Cage Grid Vitals
              </h4>
            </div>
            <div className="p-4 space-y-2.5 max-h-[260px] overflow-y-auto">
              {status?.cages.map((c) => (
                <div key={c.id} className="bg-slate-950/50 border border-cyan-500/10 rounded-xl p-3">
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
                </div>
              ))}
            </div>
          </div>

          {/* OI briefing */}
          <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border border-cyan-500/25 rounded-2xl backdrop-blur-md p-5 space-y-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h4 className="font-display font-semibold text-white text-xs sm:text-sm">Olayo Intelligence Briefing</h4>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {status ? (
                <>
                  Farm is operating within nominal parameters. Biomass across {status.activeCages} cages totals {(status.totalBiomassKg / 1000).toFixed(1)}t. Dissolved oxygen at {status.dissolvedOxygenMgL} mg/L is {status.dissolvedOxygenMgL < 5.5 ? 'trending low — recommend aeration standby' : 'healthy'}. Today's revenue ${status.todayRevenue.toFixed(0)} with {status.pendingOrders} pending orders. Sustainability index {sustainabilityScore.toFixed(0)}/100.
                </>
              ) : 'Synthesizing operational state…'}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/80">
              <Leaf className="w-3.5 h-3.5" />
              ESG compliance: NEMA audited · LVBC accredited
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
