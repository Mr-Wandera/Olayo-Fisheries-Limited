import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Order } from '../types';
import { Ship, Snowflake, ShieldCheck, Truck, Warehouse, Utensils, ShoppingBag, Eye, Waves, CheckCircle2 } from 'lucide-react';

interface SupplyChainProps {
  orders: Order[];
  onSelectOrder?: (order: Order) => void;
}

const STAGES = [
  { name: 'Ocean', icon: Waves, temp: '8°C', desc: 'Biological assets roaming freely in sustainable maritime coordinates.' },
  { name: 'Fishing Boat', icon: Ship, temp: '-2°C', desc: 'Line caught on certified vessel. Super-chilled immediately in slush-ice holds.' },
  { name: 'Cold Storage', icon: Snowflake, temp: '-24°C', desc: 'Blast frozen to -60°C or stored at deep sub-zero temperatures at port depots.' },
  { name: 'Processing Plant', icon: ShieldCheck, temp: '-18°C', desc: 'Hand-shucked, portioned, or filleted in clinical-grade sterile environments.' },
  { name: 'Packaging', icon: ShieldCheck, temp: '-18°C', desc: 'Vacuum-sealed in biodegradable protective barriers with active temp tags.' },
  { name: 'Transport', icon: Truck, temp: '-20°C', desc: 'Sunk in frozen container truck fleet with live GPS telemetry tracking.' },
  { name: 'Warehouse', icon: Warehouse, temp: '-22°C', desc: 'Arrived at Olayo central regional logistics and sorting centers.' },
  { name: 'Retail', icon: ShoppingBag, temp: '-1°C', desc: 'Delivered to certified luxury seafood markets under strict thermal controls.' },
  { name: 'Restaurant', icon: Utensils, temp: '2°C', desc: 'Prepared by certified Michelin-star chef lines for fine dining guests.' },
  { name: 'Consumer', icon: CheckCircle2, temp: '20°C', desc: 'Gourmet meal consumed with complete transparency ledger. QR Code verified.' }
] as const;

export default function SupplyChain({ orders }: SupplyChainProps) {
  const [activeOrder, setActiveOrder] = useState<Order | null>(orders[0] || null);
  const currentStageName = activeOrder?.trackingStage || 'Ocean';

  const activeStageIndex = STAGES.findIndex(s => s.name === currentStageName);

  return (
    <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cyan-500/20 pb-4 gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-cyan-400 animate-pulse" />
            Active Supply Chain Ledger
          </h3>
          <p className="text-xs text-cyan-200/60 font-sans">End-to-end telemetry auditing from maritime origin to consumption tabletop</p>
        </div>

        {/* Order Selector Tab bar */}
        <div className="flex gap-2 overflow-x-auto max-w-full pb-1">
          {orders.map(ord => (
            <button
              key={ord.id}
              onClick={() => setActiveOrder(ord)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-300 border whitespace-nowrap ${activeOrder?.id === ord.id ? 'bg-cyan-500 border-cyan-300 text-slate-950 shadow-md shadow-cyan-500/20' : 'bg-slate-950/60 border-cyan-500/20 text-cyan-300 hover:border-cyan-400/40'}`}
            >
              Order {ord.id}
            </button>
          ))}
        </div>
      </div>

      {activeOrder ? (
        <div className="space-y-6">
          {/* Main Visual Progress Map */}
          <div className="relative overflow-x-auto pb-4">
            {/* Connecting Progress Line behind */}
            <div className="absolute top-7 left-8 right-8 h-[2px] bg-slate-800 z-0" />
            <div 
              className="absolute top-7 left-8 h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-400 to-orange-500 z-0 transition-all duration-500" 
              style={{ width: `${(activeStageIndex / (STAGES.length - 1)) * 95}%` }}
            />

            <div className="flex justify-between items-center min-w-[900px] px-2 z-10 relative">
              {STAGES.map((stg, idx) => {
                const Icon = stg.icon;
                const isCompleted = idx < activeStageIndex;
                const isCurrent = idx === activeStageIndex;
                const isUpcoming = idx > activeStageIndex;

                let colorClass = 'text-slate-500 border-slate-800 bg-slate-950';
                if (isCompleted) colorClass = 'text-emerald-400 border-emerald-500/60 bg-emerald-950/80 shadow-md shadow-emerald-500/10';
                if (isCurrent) colorClass = 'text-cyan-400 border-cyan-400 bg-cyan-950 shadow-lg shadow-cyan-400/20';

                return (
                  <div key={stg.name} className="flex flex-col items-center text-center space-y-2 w-[85px]">
                    {/* Circle Indicator */}
                    <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-500 z-10 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {/* Step label */}
                    <div className={`text-[10px] font-semibold tracking-tight transition-colors duration-500 ${isCurrent ? 'text-cyan-300' : isCompleted ? 'text-emerald-300/80' : 'text-slate-400'}`}>
                      {stg.name}
                    </div>
                    {/* Temperature Reading */}
                    <div className={`font-mono text-[9px] px-1.5 py-0.5 rounded border transition-colors duration-500 ${isCurrent ? 'bg-cyan-950 border-cyan-400/40 text-cyan-400' : isCompleted ? 'bg-slate-950 border-emerald-500/10 text-emerald-400' : 'bg-slate-950/50 border-slate-900 text-slate-600'}`}>
                      {stg.temp}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expanded Stage Info Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 border border-cyan-500/10 rounded-xl p-5">
            {/* Active Stage summary */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">Stage {activeStageIndex + 1} of 10</span>
                <span className="text-xs text-cyan-200/40">●</span>
                <div className="text-xs font-mono text-cyan-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Telemetry Active
                </div>
              </div>

              <h4 className="font-display text-white font-semibold text-base mt-2 flex items-center gap-2">
                {React.createElement(STAGES[activeStageIndex].icon, { className: "w-5 h-5 text-cyan-400" })}
                Current Stage: {STAGES[activeStageIndex].name}
              </h4>
              <p className="text-xs text-cyan-100/70 font-sans leading-relaxed">
                {STAGES[activeStageIndex].desc}
              </p>
            </div>

            {/* Stage Thermal Diagnostics */}
            <div className="border-t md:border-t-0 md:border-l border-cyan-500/20 pt-4 md:pt-0 md:pl-5 space-y-3">
              <div className="text-[10px] font-mono text-cyan-400/60 uppercase">Telemetry Sensors</div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-sans">Sensors Status:</span>
                  <span className="font-mono text-emerald-400 font-semibold">SECURE & CALIBRATED</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-sans">Asset Thermal:</span>
                  <span className="font-mono text-cyan-300 font-semibold">{STAGES[activeStageIndex].temp}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-sans">GPS Transit Checkpoint:</span>
                  <span className="font-mono text-cyan-300 font-semibold">CHECKPOINT_SECURE_{activeStageIndex}</span>
                </div>
              </div>

              <div className="text-[9px] font-mono text-cyan-300/40 border-t border-cyan-500/10 pt-2 text-center">
                Cryptographic Signature: SHA-256_{activeOrder.id}
              </div>
            </div>
          </div>

          {/* Subordinated Order Products list for reference */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-cyan-300/80">Biological Cargo Specifications:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeOrder.items.map(it => (
                <div key={it.product.id} className="bg-slate-950/40 border border-cyan-500/10 p-3 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-white">{it.product.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono italic">{it.product.scientificName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-cyan-400">{it.quantity} {it.product.unit}</div>
                    <div className="text-[10px] text-slate-500">FAO Origin: {it.product.origin}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-cyan-200/50 text-xs font-sans">
          No orders active. Settle an order in the Marketplace to monitor its oceanic transit log.
        </div>
      )}
    </div>
  );
}
