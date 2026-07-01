import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Map, CheckCircle2, AlertCircle, QrCode, Globe, Clock, Compass, Truck, ShieldCheck, ClipboardCheck } from 'lucide-react';

interface InventoryBatch {
  id: string;
  species: string;
  weight: number;
  qualityScore: number;
  harvestDate: string;
  expiryDays: number;
  warehouseZone: string;
  fifoPriority: 'HIGH' | 'MEDIUM' | 'STABLE';
}

interface ExportShipment {
  id: string;
  destination: string;
  vessel: string;
  species: string;
  weight: number;
  customsStatus: 'Pending' | 'Approved' | 'In Progress';
  healthCert: boolean;
  containerId: string;
  eta: string;
}

export default function SmartLogistics() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'export'>('inventory');

  // Simulated active inventory batches
  const [batches, setBatches] = useState<InventoryBatch[]>([
    { id: 'BAT-2026-A1', species: 'Bluefin Tuna', weight: 450, qualityScore: 98, harvestDate: '2026-06-28', expiryDays: 4, warehouseZone: 'Deep Freeze A', fifoPriority: 'HIGH' },
    { id: 'BAT-2026-A2', species: 'Atlantic Cod', weight: 1200, qualityScore: 88, harvestDate: '2026-06-25', expiryDays: 12, warehouseZone: 'Cryo Room B', fifoPriority: 'STABLE' },
    { id: 'BAT-2026-A3', species: 'Red King Crab', weight: 650, qualityScore: 92, harvestDate: '2026-06-29', expiryDays: 8, warehouseZone: 'Live Shellfish C', fifoPriority: 'MEDIUM' },
    { id: 'BAT-2026-A4', species: 'Sea Scallops', weight: 800, qualityScore: 90, harvestDate: '2026-06-24', expiryDays: 2, warehouseZone: 'Deep Freeze A', fifoPriority: 'HIGH' },
  ]);

  // Selected warehouse zone for live visual map
  const [selectedZone, setSelectedZone] = useState<string>('Deep Freeze A');

  // QR/NFC Scanner simulator state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  // Simulated active export shipments
  const [exports, setExports] = useState<ExportShipment[]>([
    { id: 'EXP-9008', destination: 'Tokyo (Toyosu Exchange, Japan)', vessel: 'Ocean Sentinel', species: 'Sashimi Bluefin Tuna', weight: 350, customsStatus: 'Approved', healthCert: true, containerId: 'HLX-39102-C', eta: '2026-07-12' },
    { id: 'EXP-9010', destination: 'Boston Harbor (United States)', vessel: 'Deep Sea Explorer', species: 'Atlantic Cod Fillets', weight: 1000, customsStatus: 'In Progress', healthCert: true, containerId: 'HLX-44910-U', eta: '2026-07-15' },
    { id: 'EXP-9011', destination: 'Hamburg Port (Germany)', vessel: 'Vigo Trader', species: 'Gourmet King Crab', weight: 400, customsStatus: 'Pending', healthCert: false, containerId: 'HLX-12093-G', eta: '2026-07-19' },
  ]);

  const warehouseZones = [
    { name: 'Deep Freeze A', temp: '-28.5°C', capacity: '78%', items: 12, status: 'optimal' },
    { name: 'Cryo Room B', temp: '-32.2°C', capacity: '42%', items: 6, status: 'optimal' },
    { name: 'Live Shellfish C', temp: '2.5°C', capacity: '90%', items: 18, status: 'warning' },
    { name: 'Dry Cargo D', temp: '16.0°C', capacity: '25%', items: 4, status: 'optimal' },
  ];

  // Perform virtual barcode/NFC scan
  const triggerScan = () => {
    setIsScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      setIsScanning(false);
      // Pick a random batch details
      const randomBatch = batches[Math.floor(Math.random() * batches.length)];
      setScannedResult(`DECODED BATCH [${randomBatch.id}]\\nSpecies: ${randomBatch.species}\\nWeight: ${randomBatch.weight}kg\\nQuality Score: ${randomBatch.qualityScore}%\\nShelf-life: ${randomBatch.expiryDays} days left\\nFIFO Rank: ${randomBatch.fifoPriority}`);
    }, 2200);
  };

  const handleApplyFIFO = () => {
    // Reorder batches by FIFO order (expiryDays ascending)
    const sorted = [...batches].sort((a, b) => a.expiryDays - b.expiryDays);
    setBatches(sorted);
  };

  return (
    <div className="bg-slate-900/60 border border-cyan-500/15 p-5 sm:p-6 rounded-3xl backdrop-blur-md space-y-6">
      {/* Tab Selectors */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-cyan-500/10 pb-4">
        <div>
          <h3 className="font-display font-black text-white text-base sm:text-lg flex items-center gap-2">
            <Box className="w-5 h-5 text-cyan-400" />
            Smart Logistics & Cold Chain
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Automated stock mapping, FIFO sorting, and customs validation</p>
        </div>

        <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-cyan-500/15">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'inventory' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Inventory Control
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'export' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Export Manifests
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Warehouse Visual 3D Grid Map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <span className="text-[10px] font-mono text-cyan-400 uppercase">Interactive Warehouse Map</span>
                <div className="grid grid-cols-2 gap-4">
                  {warehouseZones.map((zone) => {
                    const isSelected = selectedZone === zone.name;
                    return (
                      <div
                        key={zone.name}
                        onClick={() => setSelectedZone(zone.name)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-28 relative overflow-hidden ${isSelected ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10' : 'bg-slate-950/40 border-cyan-500/5 hover:border-cyan-500/20'}`}
                      >
                        {/* Dynamic backdrop waves for capacity */}
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-cyan-500/5 transition-all duration-500"
                          style={{ height: zone.capacity }}
                        />

                        <div className="flex justify-between items-start z-10">
                          <div>
                            <span className="font-display font-bold text-xs text-white block">{zone.name}</span>
                            <span className="text-[9px] font-mono text-slate-500 block">SENSORS CALIBRATED</span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${zone.status === 'optimal' ? 'bg-emerald-950 text-emerald-400' : 'bg-orange-950 text-orange-400 animate-pulse'}`}>
                            {zone.temp}
                          </span>
                        </div>

                        <div className="flex justify-between items-end z-10 text-[10px] font-mono pt-4">
                          <span className="text-slate-400">Total loads: {zone.items}</span>
                          <span className="text-cyan-400 font-bold">{zone.capacity} capacity</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* NFC/QR Scanner Simulator */}
              <div className="bg-slate-950/40 border border-cyan-500/10 p-5 rounded-2xl flex flex-col justify-between min-h-[220px]">
                <div>
                  <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/10 pb-2 flex items-center gap-1.5 uppercase">
                    <QrCode className="w-4 h-4 text-cyan-400" /> IoT Tag & RFID Scanner
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed mt-2">
                    Simulate scanning packing crate barcodes, QR codes, or digital NFC tags to instantly verify blockchain tracking parameters.
                  </p>
                </div>

                <div className="my-4 relative">
                  {isScanning && (
                    <div className="h-14 bg-slate-900 rounded-xl flex items-center justify-center border border-dashed border-cyan-500/40 overflow-hidden relative">
                      {/* Scanning laser visual */}
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]"
                        animate={{ top: ['10%', '90%', '10%'] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-[10px] font-mono text-cyan-400 animate-pulse uppercase">LASER TUNING...</span>
                    </div>
                  )}

                  {scannedResult && !isScanning && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/20 font-mono text-[9px] text-emerald-400 whitespace-pre-line leading-relaxed">
                      {scannedResult}
                    </div>
                  )}

                  {!isScanning && !scannedResult && (
                    <div className="h-14 bg-slate-900/40 border border-cyan-500/5 rounded-xl flex items-center justify-center text-[10px] text-slate-500 font-sans">
                      Scanner Ready. Click to ping sensor.
                    </div>
                  )}
                </div>

                <button
                  onClick={triggerScan}
                  disabled={isScanning}
                  className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all flex justify-center items-center gap-1 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" /> TRIGGER RFID SCAN
                </button>
              </div>
            </div>

            {/* Smart Inventory Table with FIFO Sort Option */}
            <div className="bg-slate-950/40 border border-cyan-500/10 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3 flex-wrap gap-2">
                <div>
                  <h4 className="font-display font-semibold text-white text-xs flex items-center gap-1.5 uppercase">
                    <Clock className="w-4 h-4 text-cyan-400" /> Active Cargo Batches & Shelf-Life Tracker
                  </h4>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Automated First-In-First-Out recommendations</p>
                </div>

                <button
                  onClick={handleApplyFIFO}
                  className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/20 rounded-lg text-[10px] font-mono text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer"
                >
                  APPLY AUTO-FIFO SEQUENCE
                </button>
              </div>

              {/* Batches Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] text-slate-300">
                  <thead>
                    <tr className="border-b border-cyan-500/10 text-slate-500 text-[9px] uppercase">
                      <th className="py-2.5">Batch ID</th>
                      <th>Species</th>
                      <th>Weight</th>
                      <th>Harvest Date</th>
                      <th>Expiry Buffer</th>
                      <th>Warehouse Location</th>
                      <th>FIFO priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/5">
                    {batches.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-950/20 transition-colors">
                        <td className="py-2.5 text-cyan-400 font-bold">{b.id}</td>
                        <td className="font-sans text-white font-semibold">{b.species}</td>
                        <td>{b.weight} kg</td>
                        <td>{b.harvestDate}</td>
                        <td className="flex items-center gap-1.5 py-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${b.expiryDays <= 4 ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
                          <span className={b.expiryDays <= 4 ? 'text-red-400 font-bold' : 'text-slate-300'}>{b.expiryDays} days</span>
                        </td>
                        <td className="font-sans">{b.warehouseZone}</td>
                        <td>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${b.fifoPriority === 'HIGH' ? 'bg-red-950 text-red-400 border border-red-500/20' : b.fifoPriority === 'MEDIUM' ? 'bg-orange-950 text-orange-400' : 'bg-slate-800 text-slate-400'}`}>
                            {b.fifoPriority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'export' && (
          <motion.div
            key="export"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Global Exports Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Shipments List */}
              <div className="lg:col-span-2 bg-slate-950/40 border border-cyan-500/10 p-5 rounded-2xl space-y-4">
                <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/10 pb-2.5 flex items-center gap-1.5 uppercase">
                  <Globe className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} /> Active International Shipments
                </h4>

                <div className="space-y-3">
                  {exports.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-slate-950/60 border border-cyan-500/5 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono"
                    >
                      <div className="space-y-1">
                        <div className="text-cyan-400 font-bold text-sm">{exp.id}</div>
                        <div className="text-white font-sans font-semibold">{exp.species} — {exp.weight}kg</div>
                        <div className="text-[10px] text-slate-500">Destination: <span className="text-slate-300 font-sans font-medium">{exp.destination}</span></div>
                        <div className="text-[10px] text-slate-500">Logistics vessel: <span className="text-slate-300 font-sans font-medium">{exp.vessel}</span></div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">CUSTOMS:</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${exp.customsStatus === 'Approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/10' : exp.customsStatus === 'In Progress' ? 'bg-orange-950 text-orange-400' : 'bg-slate-800 text-slate-400'}`}>
                            {exp.customsStatus}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">HEALTH CERT:</span>
                          {exp.healthCert ? (
                            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> VALID</span>
                          ) : (
                            <button
                              onClick={() => {
                                setExports(prev => prev.map(e => e.id === exp.id ? { ...e, healthCert: true, customsStatus: 'In Progress' } : e));
                                alert('Export Sanitary Health Certificate generated and signed electronically.');
                              }}
                              className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[9px] hover:bg-amber-400 transition-all cursor-pointer"
                            >
                              GENERATE CERT
                            </button>
                          )}
                        </div>

                        <div className="text-[9px] text-slate-500">Container Code: <span className="text-slate-300 font-bold">{exp.containerId}</span></div>
                        <div className="text-[9px] text-slate-500">Estimated ETA: <span className="text-cyan-400 font-bold">{exp.eta}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* International Customs Regulations Sidepanel */}
              <div className="bg-slate-950/40 border border-cyan-500/10 p-5 rounded-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/10 pb-2 flex items-center gap-1.5 uppercase">
                    <ClipboardCheck className="w-4 h-4 text-cyan-400" /> Border Customs Compliance
                  </h4>

                  <div className="space-y-3 font-mono text-[10px]">
                    <div className="p-2.5 bg-slate-950 rounded border border-cyan-500/5 space-y-1">
                      <div className="text-cyan-400 font-bold">🇯🇵 JAPAN (Toyosu Exchange)</div>
                      <p className="text-[9px] text-slate-400 font-sans leading-normal">
                        Requires official FAO basinal cert and a sensory quality index score above 90%. Must verify cold chain holding temperature is under -25°C.
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded border border-cyan-500/5 space-y-1">
                      <div className="text-amber-400 font-bold">🇺🇸 UNITED STATES (NOAA Fish)</div>
                      <p className="text-[9px] text-slate-400 font-sans leading-normal">
                        Requires SIMP reporting (Species Identification and Monitoring Program). Vessel GPS history must prove zero illegal basin trespassing.
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded border border-cyan-500/5 space-y-1">
                      <div className="text-slate-300 font-bold">🇪🇺 EUROPEAN UNION (IUU Rules)</div>
                      <p className="text-[9px] text-slate-400 font-sans leading-normal">
                        Full digital catch certification system. Bycatch rates must be under 1.5% and recorded with electronic hook sensors.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-cyan-950/20 border border-cyan-500/10 rounded-xl text-[9px] text-cyan-400 font-mono mt-3">
                  🛡️ All certificates are signed with double cryptography.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
