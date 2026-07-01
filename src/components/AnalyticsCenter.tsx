import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, BarChart2, Leaf, ShieldAlert, Sparkles, ChevronDown, Award, Percent } from 'lucide-react';

export default function AnalyticsCenter() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Line chart data: Quarterly Revenue & Profit ($'000)
  const financialData = [
    { label: 'Q1 2026', revenue: 145, profit: 85, carbonSaved: 120 },
    { label: 'Q2 2026', revenue: 210, profit: 130, carbonSaved: 180 },
    { label: 'Q3 2026', revenue: 195, profit: 110, carbonSaved: 220 },
    { label: 'Q4 2026', revenue: 280, profit: 185, carbonSaved: 310 },
  ];

  // Bar chart data: Species performance
  const speciesData = [
    { species: 'Bluefin Tuna', volume: 8.5, val: 125, bycatch: 0.2 },
    { species: 'Atlantic Cod', volume: 15.2, val: 95, bycatch: 0.8 },
    { species: 'Red King Crab', volume: 4.8, val: 110, bycatch: 0.1 },
    { species: 'Sea Scallops', volume: 12.0, val: 80, bycatch: 0.3 },
  ];

  return (
    <div className="bg-slate-900/60 border border-cyan-500/15 p-5 sm:p-6 rounded-3xl backdrop-blur-md space-y-6">
      <div className="border-b border-cyan-500/10 pb-4">
        <h3 className="font-display font-black text-white text-base sm:text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Enterprise Analytics & ESG Dashboard
        </h3>
        <p className="text-xs text-slate-400 font-sans mt-0.5">Predictive forecasting, species yields, carbon buffers, and client lifetimes</p>
      </div>

      {/* Overview Stat Banners */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950/40 border border-cyan-500/5 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Net Revenue</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-white mt-1">$830,000</div>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1">▲ +24.5% QoQ</span>
        </div>
        <div className="bg-slate-950/40 border border-cyan-500/5 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Ecosystem Margin</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-cyan-400 mt-1">61.4%</div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">Vessel overhead factored</span>
        </div>
        <div className="bg-slate-950/40 border border-cyan-500/5 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Bycatch Mitigation</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-emerald-400 mt-1">0.35%</div>
          <span className="text-[10px] text-emerald-400 font-mono block mt-1">FAO Safe-basins compliant</span>
        </div>
        <div className="bg-slate-950/40 border border-cyan-500/5 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Carbon Saved (Total)</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-white mt-1">830 kg CO2</div>
          <span className="text-[10px] text-cyan-400 font-mono block mt-1">Prevented landfill spoilage</span>
        </div>
      </div>

      {/* Financials & Carbon line chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950/60 border border-cyan-500/10 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-display font-semibold text-white text-xs flex items-center gap-1.5 uppercase">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Quarterly Profit Yield & ESG buffer
            </h4>
            <span className="text-[9px] font-mono text-slate-500">HOVER CHART TO ANALYZE VALUES</span>
          </div>

          {/* Interactive Line Chart drawn with pure responsive SVG */}
          <div className="h-48 w-full relative pt-4">
            <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="20" y1="10" x2="380" y2="10" stroke="#1e293b" strokeWidth="0.5" />
              <line x1="20" y1="50" x2="380" y2="50" stroke="#1e293b" strokeWidth="0.5" />
              <line x1="20" y1="90" x2="380" y2="90" stroke="#1e293b" strokeWidth="0.5" />
              <line x1="20" y1="110" x2="380" y2="110" stroke="#334155" strokeWidth="1" />

              {/* Graphed lines (Revenue path) */}
              <polyline
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2.5"
                points="40,90 140,60 240,65 340,30"
                strokeLinecap="round"
              />
              {/* Graphed lines (Profit path) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                points="40,105 140,85 240,90 340,55"
                strokeLinecap="round"
                strokeDasharray="2"
              />

              {/* Data points */}
              {[
                { x: 40, y: 90, rev: 145, prof: 85, idx: 0 },
                { x: 140, y: 60, rev: 210, prof: 130, idx: 1 },
                { x: 240, y: 65, rev: 195, prof: 110, idx: 2 },
                { x: 340, y: 30, rev: 280, prof: 185, idx: 3 },
              ].map((pt) => (
                <g key={pt.idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint === pt.idx ? '5' : '3.5'}
                    fill="#020617"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(pt.idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y + 15}
                    r={hoveredPoint === pt.idx ? '5' : '3'}
                    fill="#020617"
                    stroke="#10b981"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(pt.idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}

              {/* X Axis Labels */}
              <text x="40" y="120" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">Q1 2026</text>
              <text x="140" y="120" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">Q2 2026</text>
              <text x="240" y="120" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">Q3 2026</text>
              <text x="340" y="120" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">Q4 2026</text>
            </svg>

            {/* Overlaid Tooltip with AnimatePresence */}
            <AnimatePresence>
              {hoveredPoint !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-2 right-4 bg-slate-950 border border-cyan-500/35 p-3 rounded-xl font-mono text-[10px] text-white space-y-1 shadow-xl z-20"
                >
                  <div className="font-bold text-cyan-400">{financialData[hoveredPoint].label} PERFORMANCE</div>
                  <div className="flex justify-between gap-4"><span>GROSS REVENUE:</span><span className="font-bold text-white">${financialData[hoveredPoint].revenue}K</span></div>
                  <div className="flex justify-between gap-4"><span>NET MARGIN:</span><span className="font-bold text-emerald-400">${financialData[hoveredPoint].profit}K</span></div>
                  <div className="flex justify-between gap-4"><span>CARBON OFFSET:</span><span className="font-bold text-teal-400">{financialData[hoveredPoint].carbonSaved} kg CO2</span></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ESG / Bio circular metrics */}
        <div className="bg-slate-950/40 border border-cyan-500/10 p-5 rounded-2xl flex flex-col justify-between">
          <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/10 pb-2 flex items-center gap-1.5 uppercase">
            <Leaf className="w-4 h-4 text-emerald-400" /> Sustainability Buffer (Bycatch)
          </h4>

          <div className="h-32 flex items-center justify-center relative my-3">
            {/* SVG circle drawing */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray="251"
                strokeDashoffset="30" // 88% selective success
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-display font-black text-white">88%</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">SELECTIVE RATE</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-sans leading-normal text-center">
             Silva Seafood Harvests logs a bycatch rate of just 0.12%, beating the FAO basinal threshold (1.5%) by 12x.
          </p>
        </div>
      </div>

      {/* Species performance vertical bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column Bar chart */}
        <div className="lg:col-span-2 bg-slate-950/60 border border-cyan-500/10 p-5 rounded-2xl space-y-4">
          <h4 className="font-display font-semibold text-white text-xs flex items-center gap-1.5 uppercase border-b border-cyan-500/10 pb-2.5">
            <BarChart2 className="w-4 h-4 text-cyan-400" /> Species Sourcing Capitalization (Metric Tons)
          </h4>

          {/* SVG Column chart */}
          <div className="h-44 w-full relative">
            <svg viewBox="0 0 400 100" className="w-full h-full">
              {/* Horizontal markings */}
              <line x1="20" y1="10" x2="380" y2="10" stroke="#1e293b" strokeWidth="0.5" />
              <line x1="20" y1="50" x2="380" y2="50" stroke="#1e293b" strokeWidth="0.5" />
              <line x1="20" y1="80" x2="380" y2="80" stroke="#334155" strokeWidth="1" />

              {/* Graphed bars */}
              {[
                { x: 30, h: 42.5, dat: speciesData[0], idx: 0 },
                { x: 120, h: 76, dat: speciesData[1], idx: 1 },
                { x: 210, h: 24, dat: speciesData[2], idx: 2 },
                { x: 300, h: 60, dat: speciesData[3], idx: 3 },
              ].map((col) => (
                <rect
                  key={col.idx}
                  x={col.x}
                  y={80 - col.h}
                  width="50"
                  height={col.h}
                  fill={hoveredBar === col.idx ? '#22d3ee' : '#0e7490'}
                  rx="4"
                  className="cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredBar(col.idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                />
              ))}

              {/* Labels */}
              <text x="55" y="92" fill="#64748b" fontSize="7" fontFamily="sans-serif" textAnchor="middle">Tuna</text>
              <text x="145" y="92" fill="#64748b" fontSize="7" fontFamily="sans-serif" textAnchor="middle">Cod</text>
              <text x="235" y="92" fill="#64748b" fontSize="7" fontFamily="sans-serif" textAnchor="middle">Crab</text>
              <text x="325" y="92" fill="#64748b" fontSize="7" fontFamily="sans-serif" textAnchor="middle">Scallops</text>
            </svg>

            {/* Hover bar popup */}
            <AnimatePresence>
              {hoveredBar !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-2 right-4 bg-slate-950 border border-cyan-500/35 p-3 rounded-xl font-mono text-[9px] text-white space-y-1 shadow-xl z-20"
                >
                  <div className="font-bold text-cyan-400">{speciesData[hoveredBar].species.toUpperCase()}</div>
                  <div className="flex justify-between gap-4"><span>HARVEST VOLUME:</span><span className="font-bold text-white">{speciesData[hoveredBar].volume} tons</span></div>
                  <div className="flex justify-between gap-4"><span>EST VALUE:</span><span className="font-bold text-emerald-400">${speciesData[hoveredBar].val}K USD</span></div>
                  <div className="flex justify-between gap-4"><span>BYCATCH FACTOR:</span><span className="font-bold text-red-400">{(speciesData[hoveredBar].bycatch * 100).toFixed(1)}%</span></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Customer Lifetime Value (CLV) & Predictions */}
        <div className="bg-slate-950/40 border border-cyan-500/10 p-5 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/10 pb-2 flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" /> Customer Lifetime Value
            </h4>

            <div className="space-y-3 text-[10px] font-mono">
              <div className="p-2.5 bg-slate-950 rounded border border-cyan-500/5 flex justify-between items-center">
                <div>
                  <div className="text-white font-bold">Chef Akira Sato (Umi Zen)</div>
                  <span className="text-[9px] text-slate-500 font-sans">Sashimi grade tuna, scallops</span>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-bold block">$18.4K CLV</span>
                  <span className="text-[8px] text-emerald-400 font-bold">98% Retention</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded border border-cyan-500/5 flex justify-between items-center">
                <div>
                  <div className="text-white font-bold">Vigo Fresh Distributors</div>
                  <span className="text-[9px] text-slate-500 font-sans">Bulk cod and king crab</span>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-bold block">$42.5K CLV</span>
                  <span className="text-[8px] text-emerald-400 font-bold">95% Retention</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-cyan-950/20 border border-cyan-500/10 rounded-xl text-[9px] text-cyan-400 font-mono mt-3">
            🤖 Sourcing predictions show seafood demand increasing 12% in Q3.
          </div>
        </div>
      </div>
    </div>
  );
}
