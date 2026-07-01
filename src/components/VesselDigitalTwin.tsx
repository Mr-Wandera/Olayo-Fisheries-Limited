import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Boat } from '../types';
import { Ship, Radio, AlertTriangle, Battery, Navigation, Compass, Wind, Eye, RotateCw, Activity, Play, Square, Settings, Wrench } from 'lucide-react';

interface VesselDigitalTwinProps {
  boats: Boat[];
  onBoatMaintenanceSubmitted: (id: string, date: string, status: Boat['status']) => void;
}

export default function VesselDigitalTwin({ boats, onBoatMaintenanceSubmitted }: VesselDigitalTwinProps) {
  const [selectedBoatId, setSelectedBoatId] = useState<string>(boats[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'blueprint' | 'diagnostics' | 'voyage'>('blueprint');

  // Select active boat
  const selectedBoat = useMemo(() => {
    return boats.find(b => b.id === selectedBoatId) || boats[0];
  }, [boats, selectedBoatId]);

  // Compartment highlight states
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  // Simulated live telemetry
  const [rpm, setRpm] = useState(1200);
  const [engineTemp, setEngineTemp] = useState(78.5);
  const [holdTemp, setHoldTemp] = useState(-2.1);
  const [hullStress, setHullStress] = useState(12.4);

  // Simulated voyage animation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [voyageIndex, setVoyageIndex] = useState(0);
  const simTimer = useRef<NodeJS.Timeout | null>(null);

  // Simulated vessel coordinates trace
  const coordinatesTrace = useMemo(() => [
    { lat: 42.235, lng: -8.727, desc: 'Harbor Departure Vigo' },
    { lat: 42.450, lng: -9.100, desc: 'Continental Shelf Transition' },
    { lat: 42.820, lng: -9.560, desc: 'FAO Zone 27 Deep Water' },
    { lat: 42.950, lng: -9.800, desc: 'Longline Deploy Coordinates' },
    { lat: 42.710, lng: -9.320, desc: 'Bycatch sweep corridor' },
    { lat: 42.240, lng: -8.730, desc: 'Docking Vigo Port' },
  ], []);

  // Sync state fluctuations on interval to feel "alive"
  useEffect(() => {
    const interval = setInterval(() => {
      setRpm(prev => {
        const delta = (Math.random() - 0.5) * 40;
        return Math.max(800, Math.min(1800, Math.floor(prev + delta)));
      });
      setEngineTemp(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        return Math.max(65, Math.min(95, prev + delta));
      });
      setHoldTemp(prev => {
        const delta = (Math.random() - 0.5) * 0.15;
        return Math.max(-5, Math.min(-0.5, prev + delta));
      });
      setHullStress(prev => {
        const delta = (Math.random() - 0.5) * 0.8;
        return Math.max(5, Math.min(25, prev + delta));
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Voyage simulation stepper
  useEffect(() => {
    if (isSimulating) {
      simTimer.current = setInterval(() => {
        setVoyageIndex(prev => {
          if (prev >= coordinatesTrace.length - 1) {
            return 0; // Loop or stop
          }
          return prev + 1;
        });
      }, 4000);
    } else {
      if (simTimer.current) clearInterval(simTimer.current);
    }

    return () => {
      if (simTimer.current) clearInterval(simTimer.current);
    };
  }, [isSimulating, coordinatesTrace]);

  const activePosition = coordinatesTrace[voyageIndex];

  return (
    <div className="bg-slate-900/60 border border-cyan-500/15 p-5 sm:p-6 rounded-3xl backdrop-blur-md space-y-6">
      {/* Selector & status summary */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-cyan-500/10 pb-4">
        <div>
          <h3 className="font-display font-black text-white text-base sm:text-lg flex items-center gap-2">
            <Ship className="w-5 h-5 text-cyan-400" />
            Vessel Digital Twin Analytics
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Live IoT sensor metrics & mechanical schematics</p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-cyan-400">SELECT SHIP:</span>
          <select
            value={selectedBoatId}
            onChange={(e) => {
              setSelectedBoatId(e.target.value);
              setVoyageIndex(0);
              setIsSimulating(false);
            }}
            className="bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
          >
            {boats.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.status.toUpperCase()})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Top dashboard status cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950/40 border border-cyan-500/5 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-500 block">SATELLITE SYNC</span>
            <span className="text-xs font-bold text-white font-mono flex items-center gap-1 mt-0.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> SAT-LINK-V4
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/40 border border-emerald-500/10 px-1.5 py-0.5 rounded">99.8%</span>
        </div>
        <div className="bg-slate-950/40 border border-cyan-500/5 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-500 block">FUEL CAPACITY</span>
            <span className="text-xs font-bold text-white font-mono block mt-0.5">{selectedBoat.fuelLevel}%</span>
          </div>
          <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div className={`h-full ${selectedBoat.fuelLevel <= 25 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${selectedBoat.fuelLevel}%` }} />
          </div>
        </div>
        <div className="bg-slate-950/40 border border-cyan-500/5 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-500 block">CREW TELEMETRY</span>
            <span className="text-xs font-bold text-white font-mono block mt-0.5">{selectedBoat.crewCount} personnel</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">BioLocked</span>
        </div>
        <div className="bg-slate-950/40 border border-cyan-500/5 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-500 block">TRIP RECORD</span>
            <span className="text-xs font-bold text-white font-mono block mt-0.5">{selectedBoat.tripCount} logs</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Cumulative</span>
        </div>
      </div>

      {/* Compartment Selection Sub-tabs */}
      <div className="flex gap-2 border-b border-cyan-500/10 pb-0.5">
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'blueprint' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          <Ship className="w-3.5 h-3.5" /> Compartment Blueprint
        </button>
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'diagnostics' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          <Activity className="w-3.5 h-3.5" /> Sensor Diagnostics
        </button>
        <button
          onClick={() => setActiveTab('voyage')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'voyage' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          <Compass className="w-3.5 h-3.5" /> Voyage Replay
        </button>
      </div>

      {/* Core Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'blueprint' && (
          <motion.div
            key="blueprint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Interactive SVG Diagram */}
            <div className="lg:col-span-2 bg-slate-950/60 rounded-2xl border border-cyan-500/10 p-6 flex flex-col justify-center items-center relative min-h-[260px]">
              <span className="absolute top-3 left-3 text-[9px] font-mono text-cyan-400/50 uppercase">INTERACTIVE CAD BLOCKS — HOVER COMPARTMENTS</span>

              {/* Vessel SVG */}
              <svg viewBox="0 0 500 160" className="w-full max-w-md h-auto">
                {/* Ocean waves reference line */}
                <line x1="10" y1="130" x2="490" y2="130" stroke="#0891b2" strokeWidth="2" strokeDasharray="4" opacity="0.3" />

                {/* Main Hull */}
                <path
                  d="M50,80 L400,80 L450,110 L430,130 L100,130 L50,80"
                  fill="none"
                  stroke={hoveredZone === 'hull' ? '#22d3ee' : '#0891b2'}
                  strokeWidth="3.5"
                  className="cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredZone('hull')}
                  onMouseLeave={() => setHoveredZone(null)}
                />

                {/* Superstructure (Bridge/Cabin) */}
                <rect
                  x="280"
                  y="40"
                  width="110"
                  height="40"
                  fill="none"
                  stroke={hoveredZone === 'bridge' ? '#22d3ee' : '#0e7490'}
                  strokeWidth="3"
                  className="cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredZone('bridge')}
                  onMouseLeave={() => setHoveredZone(null)}
                />
                <polygon points="390,40 405,65 390,65" fill="#22d3ee" opacity="0.4" />

                {/* Cold Hold Storage Block */}
                <rect
                  x="140"
                  y="88"
                  width="100"
                  height="36"
                  fill={hoveredZone === 'hold' ? 'rgba(34, 211, 238, 0.15)' : 'none'}
                  stroke={hoveredZone === 'hold' ? '#22d3ee' : '#0e7490'}
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredZone('hold')}
                  onMouseLeave={() => setHoveredZone(null)}
                />
                <text x="190" y="110" fill="#22d3ee" fontSize="8" textAnchor="middle" opacity="0.8" fontFamily="monospace">COLD HOLD</text>

                {/* Fuel Tank Hold */}
                <rect
                  x="70"
                  y="88"
                  width="60"
                  height="36"
                  fill={hoveredZone === 'fuel' ? 'rgba(236, 72, 153, 0.15)' : 'none'}
                  stroke={hoveredZone === 'fuel' ? '#ec4899' : '#0e7490'}
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredZone('fuel')}
                  onMouseLeave={() => setHoveredZone(null)}
                />
                <text x="100" y="110" fill="#ec4899" fontSize="8" textAnchor="middle" opacity="0.8" fontFamily="monospace">FUEL</text>

                {/* Propulsion / Engine Block */}
                <rect
                  x="250"
                  y="88"
                  width="90"
                  height="36"
                  fill={hoveredZone === 'engine' ? 'rgba(245, 158, 11, 0.15)' : 'none'}
                  stroke={hoveredZone === 'engine' ? '#f59e0b' : '#0e7490'}
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredZone('engine')}
                  onMouseLeave={() => setHoveredZone(null)}
                />
                <text x="295" y="110" fill="#f59e0b" fontSize="8" textAnchor="middle" opacity="0.8" fontFamily="monospace">ENGINE</text>

                {/* Radar Rotating Sweep animation */}
                <line x1="335" y1="40" x2="335" y2="20" stroke="#0891b2" strokeWidth="2" />
                <motion.ellipse
                  cx="335"
                  cy="20"
                  rx="12"
                  ry="4"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </svg>
            </div>

            {/* Compartment Information Side-card */}
            <div className="bg-slate-950/40 border border-cyan-500/10 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/10 pb-2 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-cyan-400" /> Compartment Telemetry
                </h4>

                <div className="mt-4 space-y-4 text-xs font-mono">
                  {hoveredZone === 'engine' && (
                    <div className="space-y-2">
                      <span className="text-amber-400 block font-bold">[ENGINE COMPARTMENT]</span>
                      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                        Caterpillar Marine C18 Propulsion Engine. Operates at optimized fuel efficiency curve.
                      </p>
                      <div className="bg-slate-950 p-2.5 rounded border border-amber-500/20 text-[10px] space-y-1">
                        <div className="flex justify-between"><span>RPM:</span><span className="text-white">{rpm} rev/m</span></div>
                        <div className="flex justify-between"><span>Core Temp:</span><span className="text-white">{engineTemp.toFixed(1)}°C</span></div>
                        <div className="flex justify-between"><span>Oil Pressure:</span><span className="text-emerald-400">Normal</span></div>
                      </div>
                    </div>
                  )}

                  {hoveredZone === 'hold' && (
                    <div className="space-y-2">
                      <span className="text-cyan-400 block font-bold">[SUPER-CHILLED HOLD]</span>
                      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                        Polyurethane insulated sub-zero hold utilizing continuous nitrogen cooling. Keeps Sashimi products at peak sensory clarity.
                      </p>
                      <div className="bg-slate-950 p-2.5 rounded border border-cyan-500/20 text-[10px] space-y-1">
                        <div className="flex justify-between"><span>Hold Temp:</span><span className="text-white">{holdTemp.toFixed(1)}°C</span></div>
                        <div className="flex justify-between"><span>Seals:</span><span className="text-emerald-400">Locked</span></div>
                        <div className="flex justify-between"><span>Freshness:</span><span className="text-cyan-400">Optimal</span></div>
                      </div>
                    </div>
                  )}

                  {hoveredZone === 'fuel' && (
                    <div className="space-y-2">
                      <span className="text-pink-400 block font-bold">[FUEL STORAGE]</span>
                      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                        Reinforced titanium double-hull fuel tank buffer.
                      </p>
                      <div className="bg-slate-950 p-2.5 rounded border border-pink-500/20 text-[10px] space-y-1">
                        <div className="flex justify-between"><span>Current:</span><span className="text-white">{selectedBoat.fuelLevel}%</span></div>
                        <div className="flex justify-between"><span>Leak Sensor:</span><span className="text-emerald-400">Active - Secure</span></div>
                      </div>
                    </div>
                  )}

                  {hoveredZone === 'bridge' && (
                    <div className="space-y-2">
                      <span className="text-cyan-400 block font-bold">[BRIDGE CABIN]</span>
                      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                        Navigational core. Contains satellite telemetry, auto-pilot guidance, and marine radio modules.
                      </p>
                      <div className="bg-slate-950 p-2.5 rounded border border-cyan-500/20 text-[10px] space-y-1">
                        <div className="flex justify-between"><span>Captain:</span><span className="text-white">{selectedBoat.captain}</span></div>
                        <div className="flex justify-between"><span>Radio:</span><span className="text-white">UHF-Ch-16</span></div>
                      </div>
                    </div>
                  )}

                  {!hoveredZone && (
                    <div className="text-slate-500 text-[11px] font-sans text-center py-6">
                      Hover over any highlighted compartment block on the vessel blueprint diagram to inspect direct IoT streams.
                    </div>
                  )}
                </div>
              </div>

              <div className="p-2.5 bg-cyan-950/20 border border-cyan-500/10 rounded-xl text-[9px] text-cyan-400 font-mono mt-3">
                🤖 Hover compartments to audit mechanical safety cores.
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'diagnostics' && (
          <motion.div
            key="diagnostics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Real gauges */}
            <div className="bg-slate-950/60 rounded-2xl border border-cyan-500/10 p-5 space-y-4">
              <div className="font-mono text-xs text-amber-400 font-bold flex justify-between">
                <span>[ENGINE RPM GAUGE]</span>
                <span>{rpm} RPM</span>
              </div>
              <div className="h-28 flex items-end justify-center pb-2 relative">
                <div className="w-24 h-24 rounded-full border-t-4 border-amber-500 animate-spin opacity-20" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xl font-display font-black text-white">{rpm}</span>
                  <span className="text-[9px] text-slate-400">rev/min</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-sans leading-normal">
                RPM correlates directly with speed and carbon footprint. Recommended green corridor is 1000 - 1300 rev/min.
              </div>
            </div>

            <div className="bg-slate-950/60 rounded-2xl border border-cyan-500/10 p-5 space-y-4">
              <div className="font-mono text-xs text-cyan-400 font-bold flex justify-between">
                <span>[HOLD TEMPERATURE]</span>
                <span>{holdTemp.toFixed(1)}°C</span>
              </div>
              <div className="h-28 flex items-center justify-center">
                <div className="w-full bg-slate-900 h-6 rounded-full overflow-hidden border border-cyan-500/20 relative flex items-center justify-center">
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 bg-cyan-500/25"
                    animate={{ width: `${Math.max(10, Math.min(100, (holdTemp + 10) * 10))}%` }}
                  />
                  <span className="z-10 font-mono text-xs font-bold text-white">{holdTemp.toFixed(2)}°C</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-sans leading-normal">
                Sub-zero temperature must remain below -1.5°C at all times during fishing trips to preserve seafood lipid scores.
              </p>
            </div>

            <div className="bg-slate-950/60 rounded-2xl border border-cyan-500/10 p-5 space-y-4">
              <div className="font-mono text-xs text-pink-400 font-bold flex justify-between">
                <span>[HULL STRESS VECTOR]</span>
                <span>{hullStress.toFixed(1)} MPa</span>
              </div>
              <div className="h-28 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                  <div className="absolute inset-0.5 rounded-full border border-dashed border-pink-500/30 animate-spin" />
                  <span className="text-sm font-mono font-bold text-pink-400">{hullStress.toFixed(1)} MPa</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-sans leading-normal">
                Hull stress is calculated from physical bow sensors. Safe limits are under 40 MPa.
              </p>
            </div>

            {/* Predictive Maintenance list */}
            <div className="md:col-span-3 bg-slate-950/40 border border-cyan-500/10 p-5 rounded-2xl">
              <h4 className="font-display font-bold text-white text-xs mb-3 flex items-center gap-1.5 uppercase">
                <Wrench className="w-4 h-4 text-cyan-400" /> ML-Driven Prognostics & Maintenance Forecasting
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-cyan-500/5 p-3 rounded-xl text-xs flex gap-2.5 items-start">
                  <Battery className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Battery Bank Charge Cycle</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Health score: 94% optimal</span>
                    <span className="text-[9px] font-mono text-emerald-400 block mt-1">Replace predicted: Oct 2026</span>
                  </div>
                </div>
                <div className="bg-slate-950 border border-cyan-500/5 p-3 rounded-xl text-xs flex gap-2.5 items-start">
                  <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Main Fuel Separator Filter</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Clogging coefficient warning threshold</span>
                    <span className="text-[9px] font-mono text-orange-400 block mt-1">Maintenance target: 12 days</span>
                  </div>
                </div>
                <div className="bg-slate-950 border border-cyan-500/5 p-3 rounded-xl text-xs flex gap-2.5 items-start">
                  <Settings className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Propeller Cavitation Score</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Acoustic signature telemetry analysis</span>
                    <span className="text-[9px] font-mono text-cyan-400 block mt-1">Status: Stable (Next audit Nov)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'voyage' && (
          <motion.div
            key="voyage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* GPS Voyager replay pane */}
            <div className="lg:col-span-2 bg-slate-950/60 rounded-2xl border border-cyan-500/10 p-5 flex flex-col justify-between relative min-h-[280px]">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-cyan-400 uppercase">GPS voyage replay log simulator</span>
                <span className="text-[10px] font-mono text-slate-400">{activePosition.desc}</span>
              </div>

              {/* Simplified navigation path SVG */}
              <div className="h-44 w-full flex items-center justify-center relative">
                <svg viewBox="0 0 400 150" className="w-full h-full max-w-sm opacity-80">
                  {/* Vigo coast silhouette representation */}
                  <path d="M10,130 Q80,100 120,80 T300,50 L400,10 L400,150 L0,150 Z" fill="rgba(8,145,178,0.05)" />
                  <path d="M10,130 Q80,100 120,80 T300,50" fill="none" stroke="#0891b2" strokeWidth="1" strokeDasharray="3" />

                  {/* Complete track route */}
                  <polyline
                    points="60,110 110,85 200,60 260,35 220,70 60,110"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Anchor / Vigo Port */}
                  <circle cx="60" cy="110" r="4" fill="#ec4899" />
                  <text x="60" y="125" fill="#ec4899" fontSize="8" fontFamily="monospace" textAnchor="middle">Vigo Port</text>

                  {/* Moving ship position mapping */}
                  {isSimulating && (
                    <motion.circle
                      cx={
                        voyageIndex === 0 ? 60 :
                        voyageIndex === 1 ? 110 :
                        voyageIndex === 2 ? 200 :
                        voyageIndex === 3 ? 260 :
                        voyageIndex === 4 ? 220 : 60
                      }
                      cy={
                        voyageIndex === 0 ? 110 :
                        voyageIndex === 1 ? 85 :
                        voyageIndex === 2 ? 60 :
                        voyageIndex === 3 ? 35 :
                        voyageIndex === 4 ? 70 : 110
                      }
                      r="6"
                      fill="#22d3ee"
                      className="shadow-[0_0_8px_#22d3ee]"
                    />
                  )}
                </svg>

                {/* Overlaid lat lng coordinates boxes */}
                <div className="absolute bottom-2 left-2 bg-slate-950/80 border border-cyan-500/20 px-3 py-1.5 rounded-xl font-mono text-[10px] text-cyan-400">
                  LAT: {activePosition.lat.toFixed(4)}°N
                </div>
                <div className="absolute bottom-2 right-2 bg-slate-950/80 border border-cyan-500/20 px-3 py-1.5 rounded-xl font-mono text-[10px] text-cyan-400">
                  LNG: {activePosition.lng.toFixed(4)}°W
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="flex items-center gap-3 pt-3 border-t border-cyan-500/10">
                {isSimulating ? (
                  <button
                    onClick={() => setIsSimulating(false)}
                    className="px-3 py-1.5 rounded-xl bg-red-500 text-slate-950 text-[10px] font-bold flex items-center gap-1 hover:bg-red-400 transition-all cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5" /> PAUSE SIMULATOR
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSimulating(true)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center gap-1 hover:bg-cyan-400 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> INITIATE VOYAGE REPLAY
                  </button>
                )}

                <button
                  onClick={() => {
                    setVoyageIndex(0);
                    setIsSimulating(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-cyan-500/15 text-cyan-400 text-[10px] font-bold flex items-center gap-1 hover:border-cyan-400 transition-all cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" /> RESET STEP
                </button>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="bg-slate-950/40 border border-cyan-500/10 p-5 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/10 pb-2 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-cyan-400" /> Simulated Sea Conditions
                </h4>

                <div className="space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between items-center p-2 bg-slate-950 rounded">
                    <span className="text-slate-500">WAVE SWELL:</span>
                    <span className="text-white font-bold">1.8 meters (Slight)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-950 rounded">
                    <span className="text-slate-500">SWELL PERIOD:</span>
                    <span className="text-white font-bold">8.5 seconds</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-950 rounded">
                    <span className="text-slate-500">WIND VECTOR:</span>
                    <span className="text-white font-bold">NNE at 14 knots</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-950 rounded">
                    <span className="text-slate-500">SEA TEMPERATURE:</span>
                    <span className="text-cyan-400 font-bold">14.2°C</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-xl text-[10px] text-cyan-400 font-mono mt-4">
                🛡️ Live ocean weather indices are retrieved via NOAA Copernicus satellites.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
