import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FarmStatus, CageStatus, Boat, ColdChainFacility } from '../types';
import {
  Fish, Droplets, Thermometer, Activity, Wind, Users, Ship, Waves, Wrench,
  TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, RefreshCw, Radio,
  MapPin, Gauge, Compass, Eye, Sparkles, BrainCircuit, ChevronRight, X, Anchor,
  Navigation as NavIcon, Sun, Cloud, CloudRain, CloudLightning
} from 'lucide-react';

interface FarmTwinProps {
  boats: Boat[];
  facilities: ColdChainFacility[];
  onAskOI?: (prompt: string) => void;
}

const todLabel: Record<FarmStatus['timeOfDay'], string> = {
  morning: 'Morning Mist', midday: 'Midday Operations', afternoon: 'Afternoon Shift',
  golden: 'Golden Hour', sunset: 'Sunset Watch', night: 'Night Watch', midnight: 'Deep Night',
};

function healthColor(score: number): string {
  if (score >= 90) return 'text-emerald-400 bg-emerald-950';
  if (score >= 80) return 'text-cyan-400 bg-cyan-950';
  return 'text-orange-400 bg-orange-950';
}

function facilityStatusColor(status: string): string {
  if (status === 'optimal') return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
  if (status === 'warning') return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
  return 'text-red-400 border-red-500/30 bg-red-950/40';
}

function WeatherIcon({ weather, className }: { weather: FarmStatus['weather']; className?: string }) {
  const map = { clear: Sun, cloudy: Cloud, rain: CloudRain, storm: CloudLightning };
  const Icon = map[weather] || Cloud;
  return <Icon className={className} />;
}

export default function FarmTwin({ boats, facilities, onAskOI }: FarmTwinProps) {
  const [status, setStatus] = useState<FarmStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCage, setSelectedCage] = useState<CageStatus | null>(null);
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [timeShift, setTimeShift] = useState(0); // 0 = now, -1 = yesterday, etc.

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/farm-status');
      const data = await res.json();
      setStatus(data);
    } catch (e) { console.error('farm-status error', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 12000);
    return () => clearInterval(timer);
  }, [fetchStatus]);

  if (loading || !status) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute w-12 h-12 rounded-full border-t-2 border-cyan-400 animate-spin" />
            <Fish className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="text-xs font-mono text-slate-500">Syncing cage telemetry...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h2 className="font-display font-bold text-white text-lg sm:text-xl">Digital Twin — Busiime Cage Grid</h2>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Lake Victoria, Busia District, Uganda · {todLabel[status.timeOfDay]} · {status.weather}, wind {status.windKnots} kn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TimeShift value={timeShift} onChange={setTimeShift} />
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-bold">
            <Radio className="w-3.5 h-3.5" /> LIVE
          </span>
          <button onClick={fetchStatus} className="p-2 rounded-xl bg-slate-900 border border-cyan-500/15 text-cyan-400 hover:bg-slate-800 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* The Living Lake — centerpiece interactive digital twin */}
      <LivingLake
        status={status}
        boats={boats}
        onSelectCage={setSelectedCage}
        onSelectBoat={setSelectedBoat}
        onAskOI={onAskOI}
      />

      {/* Lake vitals strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: Thermometer, label: 'Lake Temp', value: `${status.lakeTempC}°C`, sub: `ambient ${status.ambientTempC}°C`, accent: 'text-orange-400' },
          { icon: Droplets, label: 'Dissolved O₂', value: `${status.dissolvedOxygenMgL}`, sub: 'mg/L', accent: 'text-cyan-400', pulse: status.dissolvedOxygenMgL < 5.5 },
          { icon: Activity, label: 'pH', value: `${status.ph}`, sub: `turbidity ${status.turbidityNTU} NTU`, accent: 'text-teal-400' },
          { icon: Wind, label: 'Wind', value: `${status.windKnots} kn`, sub: status.weather, accent: 'text-sky-400' },
          { icon: Fish, label: 'Biomass', value: `${(status.totalBiomassKg / 1000).toFixed(1)}t`, sub: `${status.totalPopulation.toLocaleString()} fish`, accent: 'text-emerald-400' },
          { icon: Users, label: 'Staff', value: `${status.staffOnDuty}`, sub: `${status.boatsActive} boats active`, accent: 'text-blue-400' },
        ].map((v, i) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel rounded-2xl p-4 flex flex-col justify-between min-h-[96px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{v.label}</span>
              <v.icon className={`w-4 h-4 ${v.accent} ${v.pulse ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="font-display font-extrabold text-white text-lg sm:text-xl leading-tight">{v.value}</div>
              {v.sub && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{v.sub}</div>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cage grid + Fleet */}
        <div className="lg:col-span-2 space-y-4">
          <CageGridPanel status={status} onSelectCage={setSelectedCage} />
          <FleetPanel boats={boats} onSelectBoat={setSelectedBoat} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <ColdChainPanel facilities={facilities} />
          <DailySummary status={status} />
        </div>
      </div>

      {/* Cage detail modal */}
      <AnimatePresence>
        {selectedCage && (
          <CageDetailModal cage={selectedCage} onClose={() => setSelectedCage(null)} onAskOI={onAskOI} />
        )}
      </AnimatePresence>

      {/* Boat detail modal */}
      <AnimatePresence>
        {selectedBoat && (
          <BoatDetailModal boat={selectedBoat} onClose={() => setSelectedBoat(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ TIME SHIFT ============ */
function TimeShift({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const options = [
    { v: -1, label: '-1d' },
    { v: 0, label: 'Now' },
    { v: 1, label: '+1d' },
    { v: 7, label: '+1w' },
  ];
  return (
    <div className="hidden sm:flex items-center bg-slate-950/60 border border-cyan-500/10 p-1 rounded-xl">
      {options.map(o => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${value === o.v ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ============ THE LIVING LAKE — interactive digital twin ============ */
function LivingLake({ status, boats, onSelectCage, onSelectBoat, onAskOI }: {
  status: FarmStatus;
  boats: Boat[];
  onSelectCage: (c: CageStatus) => void;
  onSelectBoat: (b: Boat) => void;
  onAskOI?: (p: string) => void;
}) {
  const isStorm = status.weather === 'storm';
  const isRain = status.weather === 'rain';
  const isNight = status.timeOfDay === 'night' || status.timeOfDay === 'midnight';

  // Cage positions on the lake (relative %)
  const cagePositions = [
    { x: 22, y: 35 }, { x: 38, y: 55 }, { x: 30, y: 72 },
    { x: 58, y: 40 }, { x: 70, y: 60 }, { x: 52, y: 78 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      className="relative rounded-3xl overflow-hidden border border-cyan-500/20"
      style={{ height: '420px' }}
    >
      {/* Sky / atmosphere gradient */}
      <div className={`absolute inset-0 ${isNight ? 'bg-gradient-to-b from-slate-950 via-indigo-950/40 to-cyan-950/30' : isStorm ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-blue-950' : 'bg-gradient-to-b from-cyan-950/40 via-teal-950/30 to-slate-950'}`} />

      {/* Sun/Moon glow */}
      {!isStorm && (
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
          className={`absolute top-6 right-12 w-32 h-32 rounded-full blur-3xl ${isNight ? 'bg-indigo-300/20' : 'bg-amber-300/20'}`}
        />
      )}

      {/* Lightning flash */}
      {isStorm && (
        <motion.div
          animate={{ opacity: [0, 0, 0, 0.6, 0, 0.3, 0] }}
          transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 4 }}
          className="absolute inset-0 bg-white pointer-events-none mix-blend-screen"
        />
      )}

      {/* Water surface — animated SVG waves */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isNight ? '#082f49' : isStorm ? '#0c4a6e' : '#0e7490'} stopOpacity="0.6" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
          </linearGradient>
          <pattern id="ripples" x="0" y="0" width="20" height="6" patternUnits="userSpaceOnUse">
            <path d="M0,3 Q5,0 10,3 T20,3" stroke="rgba(34,211,238,0.15)" fill="none" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#waterGrad)" />
        <rect width="100" height="100" fill="url(#ripples)" />
        {/* Animated wave surface */}
        <motion.path
          d="M0,30 Q25,28 50,30 T100,30 L100,100 L0,100 Z"
          fill="rgba(34,211,238,0.05)"
          animate={{ d: [
            "M0,30 Q25,28 50,30 T100,30 L100,100 L0,100 Z",
            "M0,30 Q25,32 50,30 T100,30 L100,100 L0,100 Z",
            "M0,30 Q25,28 50,30 T100,30 L100,100 L0,100 Z",
          ]}}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {/* Current flow particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-300/40"
            style={{ top: `${30 + Math.random() * 60}%` }}
            initial={{ x: '-5%' }}
            animate={{ x: '105%' }}
            transition={{ duration: 8 + Math.random() * 6, repeat: Infinity, delay: i * 0.8, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Rain effect */}
      {isRain && !isStorm && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-4 bg-cyan-200/30"
              style={{ left: `${Math.random() * 100}%`, top: '-5%' }}
              animate={{ y: '110%' }}
              transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      )}

      {/* Cages on the lake */}
      {status.cages.map((cage, i) => {
        const pos = cagePositions[i % cagePositions.length];
        return (
          <motion.button
            key={cage.id}
            onClick={() => onSelectCage(cage)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 18 }}
            whileHover={{ scale: 1.15, zIndex: 20 }}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
          >
            {/* Cage ring */}
            <div className={`relative w-10 h-10 rounded-full border-2 ${cage.healthScore >= 90 ? 'border-emerald-400/60 bg-emerald-500/10' : cage.healthScore >= 80 ? 'border-cyan-400/60 bg-cyan-500/10' : 'border-orange-400/60 bg-orange-500/10'} backdrop-blur-sm flex items-center justify-center`}>
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className={`absolute inset-0 rounded-full border ${cage.healthScore >= 90 ? 'border-emerald-400' : 'border-cyan-400'}`}
              />
              <Fish className={`w-4 h-4 ${cage.healthScore >= 90 ? 'text-emerald-400' : 'text-cyan-400'}`} />
            </div>
            {/* Label */}
            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-cyan-500/30 text-[9px] font-mono text-cyan-300">
                {cage.name}
              </div>
            </div>
          </motion.button>
        );
      })}

      {/* Boats moving on the lake */}
      {boats.filter(b => b.status === 'active').slice(0, 3).map((boat, i) => (
        <motion.div
          key={boat.id}
          onClick={() => onSelectBoat(boat)}
          initial={{ x: '-10%' }}
          animate={{ x: '110%' }}
          transition={{ duration: 25 + i * 5, repeat: Infinity, delay: i * 3, ease: 'linear' }}
          style={{ top: `${20 + i * 18}%` }}
          className="absolute cursor-pointer group"
        >
          <motion.div
            animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <div className="p-1.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 backdrop-blur-sm">
              <Ship className="w-4 h-4 text-cyan-300" />
            </div>
            {/* Wake trail */}
            <div className="absolute top-1/2 -left-6 w-6 h-px bg-gradient-to-r from-transparent to-cyan-400/40" />
          </motion.div>
          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-cyan-500/30 text-[9px] font-mono text-cyan-300">
              {boat.name}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Birds (when clear weather) */}
      {status.weather === 'clear' && !isNight && (
        <>
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-8 left-1/4 opacity-40"
          >
            <svg width="24" height="10" viewBox="0 0 24 10" fill="none" className="text-slate-400">
              <path d="M0 8 Q6 0 12 8 Q18 0 24 8" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          </motion.div>
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, -3, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-12 right-1/3 opacity-30"
          >
            <svg width="20" height="8" viewBox="0 0 20 8" fill="none" className="text-slate-400">
              <path d="M0 6 Q5 0 10 6 Q15 0 20 6" stroke="currentColor" strokeWidth="0.8" fill="none" />
            </svg>
          </motion.div>
        </>
      )}

      {/* Stars at night */}
      {isNight && (
        <>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full bg-white"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 25}%` }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </>
      )}

      {/* HUD overlay — top left */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="glass-panel rounded-xl px-3 py-2 flex items-center gap-2">
          <WeatherIcon weather={status.weather} className="w-4 h-4 text-cyan-300" />
          <div>
            <div className="text-[9px] font-mono text-slate-500 uppercase">Conditions</div>
            <div className="text-xs font-semibold text-white capitalize">{status.weather} · {todLabel[status.timeOfDay]}</div>
          </div>
        </div>
      </div>

      {/* HUD overlay — top right */}
      <div className="absolute top-4 right-4 z-10">
        <div className="glass-panel rounded-xl px-3 py-2 flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-400">O₂</span>
            <span className={`font-bold ${status.dissolvedOxygenMgL < 5.5 ? 'text-orange-400' : 'text-cyan-300'}`}>{status.dissolvedOxygenMgL}</span>
          </div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3 h-3 text-orange-400" />
            <span className="text-slate-400">H₂O</span>
            <span className="font-bold text-orange-300">{status.lakeTempC}°</span>
          </div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <Wind className="w-3 h-3 text-sky-400" />
            <span className="font-bold text-sky-300">{status.windKnots}kn</span>
          </div>
        </div>
      </div>

      {/* Bottom legend */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3">
        <div className="glass-panel rounded-xl px-3 py-2 flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Healthy cage
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Active vessel
          </span>
        </div>
        <button
          onClick={() => onAskOI?.('Analyze the digital twin and recommend operational priorities for the next 24 hours.')}
          className="glass-panel rounded-xl px-3 py-2 flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 hover:bg-cyan-500/10 transition-all"
        >
          <BrainCircuit className="w-3 h-3" /> OI Analyze
        </button>
      </div>
    </motion.div>
  );
}

/* ============ CAGE GRID PANEL ============ */
function CageGridPanel({ status, onSelectCage }: { status: FarmStatus; onSelectCage: (c: CageStatus) => void }) {
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="border-b border-cyan-500/10 px-5 py-3 flex items-center gap-2">
        <Waves className="w-4 h-4 text-cyan-400" />
        <h3 className="font-display font-semibold text-white text-sm">Cage Grid — Live Vitals</h3>
        <span className="ml-auto text-[10px] font-mono text-slate-500">{status.activeCages} cages</span>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {status.cages.map((c, i) => (
          <motion.button
            key={c.id}
            onClick={() => onSelectCage(c)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2, scale: 1.01 }}
            className="bg-slate-950/50 border border-cyan-500/10 rounded-xl p-4 hover:border-cyan-400/30 transition-all text-left"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-semibold text-white">{c.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{c.species}</div>
              </div>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${healthColor(c.healthScore)}`}>
                {c.healthScore}%
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3 text-[10px] font-mono">
              <div>
                <div className="text-slate-500">Biomass</div>
                <div className="text-white">{(c.biomassKg / 1000).toFixed(1)}t</div>
              </div>
              <div>
                <div className="text-slate-500">Pop.</div>
                <div className="text-white">{c.population.toLocaleString()}</div>
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
            <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] font-mono">
              <div>
                <div className="text-slate-500">Temp</div>
                <div className="text-orange-400">{c.waterTempC}°C</div>
              </div>
              <div>
                <div className="text-slate-500">pH</div>
                <div className="text-teal-400">{c.ph}</div>
              </div>
              <div>
                <div className="text-slate-500">Turb.</div>
                <div className="text-sky-400">{c.turbidityNTU} NTU</div>
              </div>
            </div>
            {c.mortalityToday > 0 && (
              <div className="flex items-center gap-1 mt-2 text-[10px] text-orange-400">
                <AlertTriangle className="w-3 h-3" /> {c.mortalityToday} mortality today
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ============ FLEET PANEL ============ */
function FleetPanel({ boats, onSelectBoat }: { boats: Boat[]; onSelectBoat: (b: Boat) => void }) {
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="border-b border-cyan-500/10 px-5 py-3 flex items-center gap-2">
        <Ship className="w-4 h-4 text-cyan-400" />
        <h3 className="font-display font-semibold text-white text-sm">Vessel Fleet</h3>
      </div>
      <div className="p-4 space-y-2.5">
        {boats.map((b, i) => (
          <motion.button
            key={b.id}
            onClick={() => onSelectBoat(b)}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ x: 2 }}
            className="w-full bg-slate-950/50 border border-cyan-500/10 rounded-xl p-3 flex items-center justify-between hover:border-cyan-400/30 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${b.status === 'active' ? 'bg-emerald-950 text-emerald-400' : b.status === 'maintenance' ? 'bg-orange-950 text-orange-400' : 'bg-slate-800 text-slate-400'}`}>
                <Ship className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{b.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">Capt. {b.captain} · {b.crewCount} crew</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-[10px] font-mono font-bold uppercase ${b.status === 'active' ? 'text-emerald-400' : b.status === 'maintenance' ? 'text-orange-400' : 'text-slate-400'}`}>
                {b.status}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">fuel {b.fuelLevel}%</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ============ COLD CHAIN PANEL ============ */
function ColdChainPanel({ facilities }: { facilities: ColdChainFacility[] }) {
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="border-b border-cyan-500/10 px-5 py-3 flex items-center gap-2">
        <Thermometer className="w-4 h-4 text-cyan-400" />
        <h3 className="font-display font-semibold text-white text-sm">Cold Chain & Facilities</h3>
      </div>
      <div className="p-4 space-y-2.5 max-h-[340px] overflow-y-auto scrollbar-none">
        {facilities.map((f) => (
          <div key={f.id} className="bg-slate-950/50 border border-cyan-500/10 rounded-xl p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-white">{f.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{f.type} · {f.capacity}</div>
              </div>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${facilityStatusColor(f.status)}`}>
                {f.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-[10px] font-mono">
              <span className={f.temp < f.minAllowedTemp || f.temp > f.maxAllowedTemp ? 'text-red-400' : 'text-cyan-400'}>
                <Thermometer className="w-3 h-3 inline" /> {f.temp}°C
              </span>
              <span className="text-slate-500">range {f.minAllowedTemp} to {f.maxAllowedTemp}°C</span>
              <span className="text-slate-400 ml-auto">{f.usage}% used</span>
            </div>
            {f.alerts.length > 0 && (
              <div className="flex items-center gap-1 mt-1.5 text-[10px] text-orange-400">
                <AlertTriangle className="w-3 h-3" /> {f.alerts[0]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ DAILY SUMMARY ============ */
function DailySummary({ status }: { status: FarmStatus }) {
  return (
    <div className="glass-luminous rounded-3xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Gauge className="w-5 h-5 text-cyan-400" />
        <h3 className="font-display font-semibold text-white text-sm">Daily Operations Summary</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/10">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Revenue Today</div>
          <div className="font-display font-bold text-emerald-400 text-lg">${status.todayRevenue.toFixed(0)}</div>
        </div>
        <div className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/10">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Pending Orders</div>
          <div className="font-display font-bold text-white text-lg">{status.pendingOrders}</div>
        </div>
        <div className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/10">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Feed Today</div>
          <div className="font-display font-bold text-cyan-400 text-lg">{status.todayFeedKg} kg</div>
        </div>
        <div className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/10">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Mortality</div>
          <div className="font-display font-bold text-white text-lg">{status.todayMortality}</div>
        </div>
      </div>
    </div>
  );
}

/* ============ CAGE DETAIL MODAL ============ */
function CageDetailModal({ cage, onClose, onAskOI }: { cage: CageStatus; onClose: () => void; onAskOI?: (p: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="relative glass-strong rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="absolute top-3 right-3 z-10">
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-950/60 border border-white/10 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-2xl ${cage.healthScore >= 90 ? 'bg-emerald-500/15 border border-emerald-400/30' : 'bg-cyan-500/15 border border-cyan-400/30'}`}>
              <Fish className={`w-6 h-6 ${cage.healthScore >= 90 ? 'text-emerald-400' : 'text-cyan-400'}`} />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-lg">{cage.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{cage.species}</p>
            </div>
            <span className={`ml-auto text-xs font-mono font-bold px-2 py-1 rounded ${healthColor(cage.healthScore)}`}>
              {cage.healthScore}% health
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Metric label="Biomass" value={`${(cage.biomassKg / 1000).toFixed(1)}t`} icon={Fish} />
            <Metric label="Population" value={cage.population.toLocaleString()} icon={Users} />
            <Metric label="Avg Weight" value={`${cage.avgWeightG}g`} icon={Gauge} />
            <Metric label="Feed Today" value={`${cage.feedTodayKg}kg`} icon={Activity} />
            <Metric label="Water Temp" value={`${cage.waterTempC}°C`} icon={Thermometer} />
            <Metric label="Dissolved O₂" value={`${cage.dissolvedOxygenMgL} mg/L`} icon={Droplets} />
            <Metric label="pH" value={`${cage.ph}`} icon={Activity} />
            <Metric label="Turbidity" value={`${cage.turbidityNTU} NTU`} icon={Waves} />
          </div>

          {cage.mortalityToday > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 mb-4">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-orange-200">{cage.mortalityToday} mortality recorded today — within natural baseline</span>
            </div>
          )}

          <button
            onClick={() => onAskOI?.(`Analyze cage ${cage.name}: health score ${cage.healthScore}, O₂ ${cage.dissolvedOxygenMgL}, pH ${cage.ph}, biomass ${(cage.biomassKg / 1000).toFixed(1)}t. Recommend actions.`)}
            className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all flex items-center justify-center gap-1.5"
          >
            <BrainCircuit className="w-4 h-4" /> Ask OI to analyze this cage
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ============ BOAT DETAIL MODAL ============ */
function BoatDetailModal({ boat, onClose }: { boat: Boat; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="relative glass-strong rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="absolute top-3 right-3 z-10">
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-950/60 border border-white/10 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-2xl ${boat.status === 'active' ? 'bg-emerald-500/15 border border-emerald-400/30' : boat.status === 'maintenance' ? 'bg-orange-500/15 border border-orange-400/30' : 'bg-slate-700/40 border border-slate-600/30'}`}>
              <Ship className={`w-6 h-6 ${boat.status === 'active' ? 'text-emerald-400' : boat.status === 'maintenance' ? 'text-orange-400' : 'text-slate-400'}`} />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-lg">{boat.name}</h3>
              <p className="text-xs text-slate-400 font-mono">Capt. {boat.captain}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Status" value={boat.status} icon={Activity} />
            <Metric label="Crew" value={`${boat.crewCount}`} icon={Users} />
            <Metric label="Fuel Level" value={`${boat.fuelLevel}%`} icon={Gauge} />
            <Metric label="Trips" value={`${boat.tripCount}`} icon={NavIcon} />
            <Metric label="Recent Catch" value={`${boat.recentCatchKg || 0}kg`} icon={Fish} />
            <Metric label="Maintenance" value={boat.maintenanceDate} icon={Wrench} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/10">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono text-slate-500 uppercase">{label}</span>
        <Icon className="w-3.5 h-3.5 text-cyan-400" />
      </div>
      <div className="font-display font-bold text-white text-sm">{value}</div>
    </div>
  );
}
