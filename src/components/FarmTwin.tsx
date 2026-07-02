import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FarmStatus, CageStatus, Boat, ColdChainFacility } from '../types';
import { Fish, Droplets, Thermometer, Activity, Wind, Users, Ship, Waves, Wrench, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, RefreshCw, Radio, MapPin, Gauge } from 'lucide-react';

interface FarmTwinProps {
  boats: Boat[];
  facilities: ColdChainFacility[];
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

import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';

const todLabel: Record<FarmStatus['timeOfDay'], string> = {
  morning: 'Morning Mist',
  midday: 'Midday Operations',
  afternoon: 'Afternoon Shift',
  golden: 'Golden Hour',
  sunset: 'Sunset Watch',
  night: 'Night Watch',
  midnight: 'Deep Night',
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

export default function FarmTwin({ boats, facilities }: FarmTwinProps) {
  const [status, setStatus] = useState<FarmStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/farm-status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error('farm-status error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 15000);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-display font-bold text-white text-lg sm:text-xl">Digital Twin — Busiime Cage Grid</h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Lake Victoria, Busia District, Uganda · {todLabel[status.timeOfDay]} · {status.weather}, wind {status.windKnots} kn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-bold">
            <Radio className="w-3.5 h-3.5" /> LIVE
          </span>
          <button onClick={fetchStatus} className="p-2 rounded-xl bg-slate-900 border border-cyan-500/15 text-cyan-400 hover:bg-slate-800 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lake vitals strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: Thermometer, label: 'Lake Temp', value: `${status.lakeTempC}°C`, sub: `ambient ${status.ambientTempC}°C`, accent: 'text-orange-400' },
          { icon: Droplets, label: 'Dissolved O₂', value: `${status.dissolvedOxygenMgL}`, sub: 'mg/L', accent: 'text-cyan-400', pulse: status.dissolvedOxygenMgL < 5.5 },
          { icon: Activity, label: 'pH', value: `${status.ph}`, sub: `turbidity ${status.turbidityNTU} NTU`, accent: 'text-teal-400' },
          { icon: Wind, label: 'Wind', value: `${status.windKnots} kn`, sub: status.weather, accent: 'text-sky-400' },
          { icon: Fish, label: 'Biomass', value: `${(status.totalBiomassKg / 1000).toFixed(1)}t`, sub: `${status.totalPopulation.toLocaleString()} fish`, accent: 'text-emerald-400' },
          { icon: Users, label: 'Staff', value: `${status.staffOnDuty}`, sub: `${status.boatsActive} boats active`, accent: 'text-blue-400' },
        ].map((v) => (
          <div key={v.label} className="bg-slate-950/60 border border-cyan-500/10 rounded-2xl p-4 backdrop-blur-md flex flex-col justify-between min-h-[96px]">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{v.label}</span>
              <v.icon className={`w-4 h-4 ${v.accent} ${v.pulse ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="font-display font-extrabold text-white text-lg sm:text-xl leading-tight">{v.value}</div>
              {v.sub && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{v.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cage grid — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl backdrop-blur-md overflow-hidden">
            <div className="border-b border-cyan-500/10 px-5 py-3 flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-semibold text-white text-sm">Cage Grid — Live Vitals</h3>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {status.cages.map((c) => (
                <CageCard key={c.id} cage={c} />
              ))}
            </div>
          </div>

          {/* Fleet */}
          <div className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl backdrop-blur-md overflow-hidden">
            <div className="border-b border-cyan-500/10 px-5 py-3 flex items-center gap-2">
              <Ship className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-semibold text-white text-sm">Vessel Fleet</h3>
            </div>
            <div className="p-4 space-y-2.5">
              {boats.map((b) => (
                <div key={b.id} className="bg-slate-950/50 border border-cyan-500/10 rounded-xl p-3 flex items-center justify-between">
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: facilities + summary */}
        <div className="space-y-4">
          {/* Cold chain facilities */}
          <div className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl backdrop-blur-md overflow-hidden">
            <div className="border-b border-cyan-500/10 px-5 py-3 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-semibold text-white text-sm">Cold Chain & Facilities</h3>
            </div>
            <div className="p-4 space-y-2.5 max-h-[340px] overflow-y-auto">
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

          {/* Daily summary */}
          <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border border-cyan-500/25 rounded-2xl backdrop-blur-md p-5 space-y-3">
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
        </div>
      </div>
    </div>
  );
}

const CageCard: React.FC<{ cage: CageStatus }> = ({ cage }) => {
  return (
    <div className="bg-slate-950/50 border border-cyan-500/10 rounded-xl p-4 hover:border-cyan-400/30 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-semibold text-white">{cage.name}</div>
          <div className="text-[10px] text-slate-500 font-mono">{cage.species}</div>
        </div>
        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${healthColor(cage.healthScore)}`}>
          {cage.healthScore}% health
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-3 text-[10px] font-mono">
        <div>
          <div className="text-slate-500">Biomass</div>
          <div className="text-white">{(cage.biomassKg / 1000).toFixed(1)}t</div>
        </div>
        <div>
          <div className="text-slate-500">Pop.</div>
          <div className="text-white">{cage.population.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-slate-500">O₂</div>
          <div className={cage.dissolvedOxygenMgL < 5.5 ? 'text-orange-400' : 'text-cyan-400'}>{cage.dissolvedOxygenMgL}</div>
        </div>
        <div>
          <div className="text-slate-500">Feed</div>
          <div className="text-emerald-400">{cage.feedTodayKg}kg</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] font-mono">
        <div>
          <div className="text-slate-500">Temp</div>
          <div className="text-orange-400">{cage.waterTempC}°C</div>
        </div>
        <div>
          <div className="text-slate-500">pH</div>
          <div className="text-teal-400">{cage.ph}</div>
        </div>
        <div>
          <div className="text-slate-500">Turb.</div>
          <div className="text-sky-400">{cage.turbidityNTU} NTU</div>
        </div>
      </div>
      {cage.mortalityToday > 0 && (
        <div className="flex items-center gap-1 mt-2 text-[10px] text-orange-400">
          <AlertTriangle className="w-3 h-3" /> {cage.mortalityToday} mortality today
        </div>
      )}
    </div>
  );
}
