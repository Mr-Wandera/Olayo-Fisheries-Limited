import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Boat, CatchReport } from '../types';
import { MapPin, Anchor, Navigation, Shield, Thermometer, Compass } from 'lucide-react';

interface OceanMapProps {
  boats: Boat[];
  catchReports: CatchReport[];
}

interface MapLocation {
  id: string;
  name: string;
  type: 'zone' | 'port' | 'hub';
  lat: number; // For visualization mapping on our clean grid
  lng: number;
  x: number; // % position on the customized SVG canvas
  y: number; // % position
  details: string;
  depth?: string;
  avgTemp?: string;
}

const locations: MapLocation[] = [
  {
    id: 'loc_atlantic',
    name: 'Atlantic FAO Zone 27',
    type: 'zone',
    lat: 42.14,
    lng: -9.82,
    x: 42,
    y: 54,
    depth: '180m - 4000m',
    avgTemp: '12.4°C',
    details: 'Primary fishing grounds for Premium Bluefin Tuna. High swell conditions with strict TAC quota controls.',
  },
  {
    id: 'loc_north_sea',
    name: 'North Sea Zone FAO 27.IV',
    type: 'zone',
    lat: 56.45,
    lng: 5.21,
    x: 48,
    y: 35,
    depth: '90m - 120m',
    avgTemp: '8.2°C',
    details: 'Abundant grounds for Atlantic Cod and Haddock. Co-managed by European Maritime Conservation councils.',
  },
  {
    id: 'loc_barents',
    name: 'Barents Sea Zone FAO 27.I',
    type: 'zone',
    lat: 72.10,
    lng: 30.12,
    x: 58,
    y: 18,
    depth: '200m - 350m',
    avgTemp: '2.1°C',
    details: 'Sub-zero arctic waters. Primary habitat of massive Red King Crabs. Challenging ice-breaker navigation.',
  },
  {
    id: 'loc_vigo',
    name: 'Vigo Port HQ & Cold Storage',
    type: 'port',
    lat: 42.23,
    lng: -8.72,
    x: 41,
    y: 62,
    details: 'Olayo European Landing Dock. Includes blast-freezers (-60°C) and custom customs checking portals.',
  },
  {
    id: 'loc_paris',
    name: 'Paris Cold Logistics Hub',
    type: 'hub',
    lat: 48.85,
    lng: 2.35,
    x: 47,
    y: 52,
    details: 'High-speed inland temperature monitoring hub supplying central European dining rooms.',
  }
];

export default function OceanMap({ boats, catchReports }: OceanMapProps) {
  const [selectedLoc, setSelectedLoc] = useState<MapLocation | null>(locations[0]);
  const [hoveredLoc, setHoveredLoc] = useState<MapLocation | null>(null);

  // Find active vessels in currently selected region
  const regionalBoats = boats.filter(b => {
    if (!selectedLoc) return false;
    if (selectedLoc.type !== 'zone') return false;
    // Map boats loosely to zones
    if (selectedLoc.id === 'loc_atlantic' && b.id === 'boat_01') return true;
    if (selectedLoc.id === 'loc_north_sea' && b.id === 'boat_02') return true;
    if (selectedLoc.id === 'loc_barents' && b.id === 'boat_04') return true;
    return false;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Interactive Vector Map Grid */}
      <div className="lg:col-span-2 relative bg-slate-900/80 border border-cyan-500/30 rounded-2xl overflow-hidden p-4 h-[500px] flex flex-col justify-between backdrop-blur-md shadow-2xl">
        {/* Map Header */}
        <div className="flex justify-between items-center z-10">
          <div>
            <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
              Olayo Global Vessel & Outpost Map
            </h3>
            <p className="text-xs text-cyan-200/60 font-sans">Live telemetry, FAO fishing grids, and shipping channels</p>
          </div>
          <div className="flex gap-4 text-[10px] font-mono text-cyan-300">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" /> Active Vessels
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full" /> Landing Ports
            </span>
          </div>
        </div>

        {/* Customized Grid World Map Overlay */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Draw elegant vector land outlines (Abstract representations of Europe/Atlantic) */}
            <path d="M 50,0 Q 55,20 48,35 T 45,55 T 39,62 T 35,70 T 38,90 T 40,100" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="5,5" />
            <path d="M 0,40 Q 15,45 10,60 T 5,85" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3,3" />
          </svg>
        </div>

        {/* Animated Shipping Route Lines */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full">
            {/* Barents Sea -> Vigo Port */}
            <motion.path
              d="M 444,110 Q 320,180 328,310"
              fill="none"
              stroke="rgba(34, 211, 238, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="6,6"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -100 }}
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
            />
            {/* North Sea -> Vigo Port */}
            <motion.path
              d="M 384,180 Q 330,220 328,310"
              fill="none"
              stroke="rgba(34, 211, 238, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="6,6"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -100 }}
              transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
            />
            {/* Vigo Port -> Paris Logistics */}
            <motion.path
              d="M 328,310 L 376,260"
              fill="none"
              stroke="rgba(249, 115, 22, 0.4)"
              strokeWidth="2"
              strokeDasharray="4,4"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 100 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            />
          </svg>
        </div>

        {/* Map Interactive Nodes Canvas */}
        <div className="relative w-full h-[360px] z-10 mt-4">
          {locations.map((loc) => {
            const isSelected = selectedLoc?.id === loc.id;
            const isHovered = hoveredLoc?.id === loc.id;
            const isPort = loc.type === 'port';
            const isHub = loc.type === 'hub';

            return (
              <div
                key={loc.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110"
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                onClick={() => setSelectedLoc(loc)}
                onMouseEnter={() => setHoveredLoc(loc)}
                onMouseLeave={() => setHoveredLoc(null)}
              >
                {/* Visual pulse for ports/zones */}
                <div className="relative flex items-center justify-center">
                  {isSelected && (
                    <span className="absolute w-8 h-8 rounded-full bg-cyan-400/20 animate-ping" />
                  )}
                  
                  {isPort ? (
                    <div className={`p-2 rounded-lg border ${isSelected ? 'bg-cyan-500 border-cyan-300 text-slate-950' : 'bg-slate-900 border-cyan-400/60 text-cyan-300'} shadow-md shadow-cyan-500/20`}>
                      <Anchor className="w-4 h-4" />
                    </div>
                  ) : isHub ? (
                    <div className={`p-2 rounded-lg border ${isSelected ? 'bg-orange-500 border-orange-300 text-slate-950' : 'bg-slate-900 border-orange-400/60 text-orange-400'} shadow-md shadow-orange-500/20`}>
                      <Navigation className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className={`p-2 rounded-full border ${isSelected ? 'bg-emerald-500 border-emerald-300 text-slate-950 animate-pulse' : 'bg-slate-900 border-emerald-400/60 text-emerald-400'}`}>
                      <Shield className="w-4 h-4" />
                    </div>
                  )}

                  {/* Little Tooltip overlay on hover */}
                  <AnimatePresence>
                    {(isHovered || isSelected) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -45, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute whitespace-nowrap bg-slate-950/95 border border-cyan-400/40 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl font-display flex items-center gap-1.5 z-50 pointer-events-none"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isPort ? 'bg-cyan-400' : isHub ? 'bg-orange-400' : 'bg-emerald-400'}`} />
                        {loc.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Footer showing selected details */}
        <div className="z-10 bg-slate-950/80 border-t border-cyan-500/20 p-3 rounded-b-xl flex justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-cyan-200">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-semibold">{selectedLoc ? selectedLoc.name : 'Select a node on the grid'}</span>
          </div>
          <div className="text-[11px] text-cyan-100/60 font-sans line-clamp-1 flex-1 max-w-lg">
            {selectedLoc ? selectedLoc.details : 'Click on fishing grids or harbor markers to fetch satellite telemetry, active catch reports, and ocean temperature readings.'}
          </div>
        </div>
      </div>

      {/* Satellite Telemetry Detail Panel */}
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-md shadow-2xl">
        <h4 className="font-display font-semibold text-white border-b border-cyan-500/20 pb-3 flex items-center gap-2">
          <Shield className="w-4.5 h-4.5 text-cyan-400" />
          Satellite Regional Report
        </h4>

        {selectedLoc ? (
          <div className="space-y-4 my-4 flex-1">
            <div className="bg-slate-950/60 rounded-xl p-3 border border-cyan-500/10">
              <div className="text-[10px] font-mono text-cyan-400/60 uppercase">Telemetry Metadata</div>
              <div className="font-mono text-sm text-white mt-1 font-semibold">{selectedLoc.name}</div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <div className="text-[9px] font-mono text-cyan-300/40 uppercase">Latitude</div>
                  <div className="font-mono text-xs text-cyan-100 font-semibold">{selectedLoc.lat.toFixed(4)}° N</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-cyan-300/40 uppercase">Longitude</div>
                  <div className="font-mono text-xs text-cyan-100 font-semibold">{selectedLoc.lng.toFixed(4)}° E</div>
                </div>
              </div>
            </div>

            {selectedLoc.depth && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300/60 uppercase">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    Sea Bed Depth
                  </div>
                  <div className="font-mono text-sm text-white mt-1 font-semibold">{selectedLoc.depth}</div>
                </div>
                <div className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300/60 uppercase">
                    <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                    Water Temp
                  </div>
                  <div className="font-mono text-sm text-white mt-1 font-semibold">{selectedLoc.avgTemp}</div>
                </div>
              </div>
            )}

            <div>
              <div className="text-[10px] font-mono text-cyan-300/60 uppercase mb-2">Deployments & Vessels</div>
              {selectedLoc.type === 'zone' ? (
                regionalBoats.length > 0 ? (
                  <div className="space-y-2">
                    {regionalBoats.map(b => (
                      <div key={b.id} className="flex items-center justify-between bg-slate-950/60 border border-emerald-500/20 p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <div>
                            <div className="text-xs font-semibold text-white">{b.name}</div>
                            <div className="text-[10px] text-cyan-300/40">Captain: {b.captain}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono text-cyan-300 font-semibold">{b.recentCatchKg} kg logged</div>
                          <div className="text-[9px] font-mono text-emerald-400">Fuel: {b.fuelLevel}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-cyan-100/40 bg-slate-950/30 p-4 rounded-xl text-center border border-cyan-500/5">
                    No Olayo vessels registered in this basin today. Fishing quotas are preserved.
                  </div>
                )
              ) : (
                <div className="bg-slate-950/60 border border-cyan-500/10 p-3 rounded-xl">
                  <div className="text-xs text-cyan-200">
                    {selectedLoc.type === 'port' 
                      ? '⚓ This harbor houses active deep-freezer warehouses. Direct railway routes feed the inland culinary hubs.' 
                      : '🚛 Central logistics hub manages cold transport vehicles with RFID sensor relays.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-xs text-cyan-200/50 py-12 flex-1 flex flex-col justify-center">
            Click any coordinates on the map grid to stream satellite ocean data.
          </div>
        )}

        <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-xl p-3 text-[10px] font-mono text-cyan-300/80">
          📍 SatLink Terminal Active: Encrypted data stream secured via Olayo Network.
        </div>
      </div>
    </div>
  );
}
