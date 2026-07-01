import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Boat, CatchReport, Product, Order, ColdChainFacility, UserProfile, UserRole } from '../types';
import { Shield, Ship, Thermometer, Anchor, ClipboardList, RefreshCw, AlertTriangle, Plus, ChevronRight, UserCheck, BookOpen, Clock } from 'lucide-react';
import VesselDigitalTwin from './VesselDigitalTwin';
import SmartLogistics from './SmartLogistics';
import QualityAssurance from './QualityAssurance';
import AnalyticsCenter from './AnalyticsCenter';
import PlatformComms from './PlatformComms';
import UserProfilePortal from './UserProfilePortal';

interface DashboardRolesProps {
  currentUser: UserProfile;
  boats: Boat[];
  catchReports: CatchReport[];
  facilities: ColdChainFacility[];
  orders: Order[];
  onRoleChanged: (newRole: UserRole) => void;
  onCatchSubmitted: (report: Partial<CatchReport>) => void;
  onFacilityTempChanged: (facilityId: string, temp: number) => void;
  onBoatMaintenanceSubmitted: (id: string, date: string, status: Boat['status']) => void;
}

export default function DashboardRoles({
  currentUser,
  boats,
  catchReports,
  facilities,
  orders,
  onRoleChanged,
  onCatchSubmitted,
  onFacilityTempChanged,
  onBoatMaintenanceSubmitted
}: DashboardRolesProps) {
  // Hub sub-tab state
  const [hubTab, setHubTab] = useState<'forms' | 'twins' | 'logistics' | 'qa' | 'analytics' | 'comms' | 'profile'>('forms');

  // Catch registration form state (for Producer)
  const [catchSpecies, setCatchSpecies] = useState('Bluefin Tuna');
  const [catchQty, setCatchQty] = useState<number>(850);
  const [catchZone, setCatchZone] = useState('Atlantic FAO 27');
  const [catchDepth, setCatchDepth] = useState<number>(150);
  const [catchTemp, setCatchTemp] = useState<number>(-2.2);
  const [catchQuality, setCatchQuality] = useState<number>(95);
  const [selectedBoatId, setSelectedBoatId] = useState(boats[0]?.id || '');

  // Boat maintenance form state (for Fleet Manager)
  const [maintStatus, setMaintStatus] = useState<Boat['status']>('active');
  const [maintDate, setMaintDate] = useState('2026-07-15');
  const [selectedMaintBoatId, setSelectedMaintBoatId] = useState(boats[0]?.id || '');

  // Role descriptions for the selector
  const rolesInfo: Record<UserRole, string> = {
    'Administrator': 'System audits, database parameters, user permissions, and master logs.',
    'Fleet Manager': 'Vessel GPS tracking, crew scheduling, fuel levels, and drydock maintenance logs.',
    'Producer': 'Commercial catch registration, species logging, depth, temperature, and quality scoring.',
    'Consumer': 'Cargo manifest tracking, cold-chain receipt verification, and expert certificates.',
    'Retailer': 'Purchasing bulk sustainable seafood stocks, logistics monitoring, and invoices.',
    'Restaurant': 'Sourcing high-lipid sashimi tuna, cold chain temperature auditing, and recipe matching.',
    'Exporter': 'International customs validation, packing seals, and multi-currency forward contracts.',
    'Quality Inspector': 'Cold warehouse monitoring, lipid validation, sensory clarity index scoring.',
    'Warehouse Manager': 'Deep-freeze facility management, cargo sorting, load-capacity balancing.',
    'Delivery Partner': 'Last-mile dry ice replenishment, thermal cargo tags, and client signatures.'
  };

  const handleCatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const boat = boats.find(b => b.id === selectedBoatId);
    onCatchSubmitted({
      boatId: selectedBoatId,
      boatName: boat ? boat.name : 'Unknown Vessel',
      species: catchSpecies,
      quantity: catchQty,
      fishingZone: catchZone,
      depth: catchDepth,
      temperature: catchTemp,
      qualityScore: catchQuality,
      freshness: catchQuality >= 90 ? 'optimal' : catchQuality >= 75 ? 'good' : 'warning',
      loggedBy: currentUser.name
    });
    // Reset or show feedback
    alert('Catch report successfully validated and appended to the ledger.');
  };

  const handleMaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBoatMaintenanceSubmitted(selectedMaintBoatId, maintDate, maintStatus);
    alert('Vessel schedule updated.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Role Switcher sidebar */}
      <div className="bg-slate-900/80 border border-cyan-500/20 p-5 rounded-2xl backdrop-blur-md space-y-4">
        <div>
          <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/15 pb-2 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            Security Core Switcher
          </h4>
          <p className="text-[10px] text-slate-400 font-sans mt-1">Simulate multiple enterprise actors in a single click:</p>
        </div>

        <div className="space-y-1 overflow-y-auto max-h-[380px] pr-1">
          {Object.keys(rolesInfo).map((rKey) => {
            const roleName = rKey as UserRole;
            const isSelected = currentUser.role === roleName;
            return (
              <button
                key={roleName}
                onClick={() => onRoleChanged(roleName)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all border flex flex-col gap-0.5 ${isSelected ? 'bg-cyan-500 border-cyan-300 text-slate-950 font-bold' : 'bg-slate-950/40 border-cyan-500/5 text-slate-300 hover:border-cyan-400/20'}`}
              >
                <span>{roleName}</span>
                <span className={`text-[9px] font-normal font-sans leading-tight line-clamp-1 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                  {rolesInfo[roleName]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Role-Specific Canvas (3 cols) */}
      <div className="lg:col-span-3 space-y-6">
        {/* Command Hub Sub-tabs */}
        <div className="flex flex-wrap gap-2 bg-slate-950/40 p-1.5 rounded-2xl border border-cyan-500/10">
          <button
            onClick={() => setHubTab('forms')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${hubTab === 'forms' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Role Console ({currentUser.role})
          </button>
          <button
            onClick={() => setHubTab('twins')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${hubTab === 'twins' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Vessel Twins
          </button>
          <button
            onClick={() => setHubTab('logistics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${hubTab === 'logistics' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Smart Logistics
          </button>
          <button
            onClick={() => setHubTab('qa')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${hubTab === 'qa' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Quality Assurance
          </button>
          <button
            onClick={() => setHubTab('analytics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${hubTab === 'analytics' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Analytics Center
          </button>
          <button
            onClick={() => setHubTab('comms')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${hubTab === 'comms' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Vessel SatLink
          </button>
          <button
            onClick={() => setHubTab('profile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${hubTab === 'profile' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Captain's Profile
          </button>
        </div>

        {hubTab === 'forms' && (
          <>
            {currentUser.role === 'Producer' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Catch submission form */}
            <div className="md:col-span-2 bg-slate-900/80 border border-cyan-500/30 p-5 rounded-2xl backdrop-blur-md space-y-4">
              <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5 border-b border-cyan-500/10 pb-3">
                <ClipboardList className="w-5 h-5 text-cyan-400" />
                Register Commercial Landing (Catch Report)
              </h3>

              <form onSubmit={handleCatchSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Harvesting Vessel</label>
                  <select
                    value={selectedBoatId}
                    onChange={(e) => setSelectedBoatId(e.target.value)}
                    className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {boats.map(b => (
                      <option key={b.id} value={b.id}>{b.name} (Captain: {b.captain})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Biological Species</label>
                  <select
                    value={catchSpecies}
                    onChange={(e) => setCatchSpecies(e.target.value)}
                    className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Bluefin Tuna">Bluefin Tuna (Thunnus thynnus)</option>
                    <option value="Atlantic Cod">Atlantic Cod (Gadus morhua)</option>
                    <option value="Red King Crab">Red King Crab (Paralithodes camtschaticus)</option>
                    <option value="Atlantic Sea Scallops">Sea Scallops (Placopecten magellanicus)</option>
                    <option value="European Red Lobster">European Red Lobster (Homarus gammarus)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Total Weight (kg)</label>
                  <input
                    type="number"
                    value={catchQty}
                    onChange={(e) => setCatchQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-cyan-400/60 uppercase">FAO Fishing Basin</label>
                  <input
                    type="text"
                    value={catchZone}
                    onChange={(e) => setCatchZone(e.target.value)}
                    className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Bathymetric Depth (meters)</label>
                  <input
                    type="number"
                    value={catchDepth}
                    onChange={(e) => setCatchDepth(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Sensor Hold Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={catchTemp}
                    onChange={(e) => setCatchTemp(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-mono text-cyan-400/60 uppercase flex justify-between">
                    <span>Quality/Sensory Score ({catchQuality}%)</span>
                    <span className="text-emerald-400">{catchQuality >= 90 ? 'Optimal Sashimi Grade' : 'Standard grade'}</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={catchQuality}
                    onChange={(e) => setCatchQuality(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="sm:col-span-2 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all flex justify-center items-center gap-1.5 shadow-md shadow-cyan-500/15 cursor-pointer mt-2"
                >
                  <Plus className="w-4 h-4" /> Secure Harvest to Ledger
                </button>
              </form>
            </div>

            {/* Side summary of recent catches */}
            <div className="bg-slate-900/80 border border-cyan-500/20 p-4 rounded-2xl backdrop-blur-md flex flex-col justify-between">
              <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/15 pb-2 mb-3">Vessel Ledger Record</h4>
              <div className="space-y-2 overflow-y-auto max-h-[300px] flex-1">
                {catchReports.map(cr => (
                  <div key={cr.id} className="bg-slate-950/40 border border-cyan-500/5 p-2.5 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-start font-semibold text-white">
                      <span>{cr.species}</span>
                      <span className="text-cyan-400 font-mono font-bold">{cr.quantity}kg</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>{cr.boatName}</span>
                      <span className="text-[9px] font-mono">{cr.fishingZone}</span>
                    </div>
                    <div className="text-[9px] font-mono text-emerald-400 flex justify-between pt-1 border-t border-cyan-500/5">
                      <span>Hold Temp: {cr.temperature}°C</span>
                      <span>Quality: {cr.qualityScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentUser.role === 'Fleet Manager' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Boats status cards with rocking animation as requested! */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2">
                <h3 className="font-display font-semibold text-white text-sm sm:text-base flex items-center gap-1.5">
                  <Ship className="w-5 h-5 text-cyan-400" />
                  Fleet Deployment Operations
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {boats.map(b => {
                  const isMaintenance = b.status === 'maintenance';
                  const isDocked = b.status === 'docked';

                  return (
                    <motion.div
                      key={b.id}
                      animate={{
                        // Gently rock while idle (docked or maintenance) as requested!
                        rotate: (isDocked || isMaintenance) ? [0, -1, 1, 0] : 0,
                        y: (isDocked || isMaintenance) ? [0, -3, 0] : 0
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 6,
                        ease: 'easeInOut'
                      }}
                      className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl overflow-hidden p-4 space-y-3 shadow-lg relative flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-display font-bold text-white text-sm">{b.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Captain: {b.captain}</div>
                        </div>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${b.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/25' : b.status === 'maintenance' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/25' : 'bg-slate-800 text-slate-400'}`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono pt-1">
                        <div>
                          <div className="text-slate-500">Crew Size:</div>
                          <div className="text-white font-semibold">{b.crewCount} heads</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Total Trips:</div>
                          <div className="text-white font-semibold">{b.tripCount} logs</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-slate-500">Maintenance Schedule:</div>
                          <div className="text-white font-semibold">{b.maintenanceDate}</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-cyan-500/5 flex justify-between items-center text-[10px]">
                        <span className="text-slate-500 font-mono">Fuel Level:</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${b.fuelLevel <= 25 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${b.fuelLevel}%` }} />
                          </div>
                          <span className="font-mono text-white">{b.fuelLevel}%</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Schedule Maintenance form */}
            <div className="bg-slate-900/80 border border-cyan-500/20 p-4 rounded-2xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/15 pb-2 mb-3">Update Ship Schedule</h4>
                <form onSubmit={handleMaintSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Vessel Name</label>
                    <select
                      value={selectedMaintBoatId}
                      onChange={(e) => setSelectedMaintBoatId(e.target.value)}
                      className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-2.5 py-2 text-xs text-white"
                    >
                      {boats.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Drydock Target Date</label>
                    <input
                      type="date"
                      value={maintDate}
                      onChange={(e) => setMaintDate(e.target.value)}
                      className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-2.5 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-cyan-400/60 uppercase">Operational Status</label>
                    <select
                      value={maintStatus}
                      onChange={(e) => setMaintStatus(e.target.value as any)}
                      className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-2.5 py-2 text-xs text-white"
                    >
                      <option value="active">Active Sea Operations</option>
                      <option value="maintenance">Drydock Maintenance</option>
                      <option value="docked">Harbor Docked</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all flex justify-center items-center gap-1 shadow-md shadow-cyan-500/15 cursor-pointer mt-2"
                  >
                    Commit Vessel Log
                  </button>
                </form>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-xl text-[10px] text-cyan-400 font-mono mt-4">
                🛡️ Fleet commands are broadcast via Marine GPS Satlink v4.
              </div>
            </div>
          </div>
        )}

        {currentUser.role === 'Quality Inspector' && (
          <div className="space-y-4 bg-slate-900/80 border border-cyan-500/30 p-5 rounded-2xl backdrop-blur-md">
            <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5 border-b border-cyan-500/10 pb-3">
              <Thermometer className="w-5 h-5 text-orange-400 animate-pulse" />
              Super-Chilled Cold Chain monitoring Panel
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {facilities.map((fac) => {
                const isAlert = fac.status === 'alert';
                const isWarning = fac.status === 'warning';

                return (
                  <div key={fac.id} className="bg-slate-950/60 border border-cyan-500/15 p-4 rounded-xl flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-display font-semibold text-white text-xs">{fac.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{fac.type} facility</div>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${fac.status === 'optimal' ? 'bg-emerald-500/20 text-emerald-400' : isAlert ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-orange-500/20 text-orange-400'}`}>
                        {fac.status}
                      </span>
                    </div>

                    {/* Sensor controller slider so they can test/interact dynamically! */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Live Sensor:</span>
                        <span className={`font-bold ${isAlert ? 'text-red-400' : 'text-cyan-400'}`}>{fac.temp.toFixed(1)}°C</span>
                      </div>
                      <input
                        type="range"
                        min="-35"
                        max="5"
                        step="0.5"
                        value={fac.temp}
                        onChange={(e) => onFacilityTempChanged(fac.id, parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-slate-500">
                        <span>Min Allowed: {fac.minAllowedTemp}°C</span>
                        <span>Max Allowed: {fac.maxAllowedTemp}°C</span>
                      </div>
                    </div>

                    {fac.alerts.length > 0 && (
                      <div className="bg-red-950/30 border border-red-500/25 rounded-xl p-2.5 flex gap-1.5 items-start">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-[9px] font-mono text-red-300 leading-normal">{fac.alerts[0]}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentUser.role === 'Administrator' && (
          <div className="space-y-4 bg-slate-900/80 border border-cyan-500/30 p-5 rounded-2xl backdrop-blur-md">
            <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5 border-b border-cyan-500/10 pb-3">
              <Shield className="w-5 h-5 text-cyan-400" />
              HQ Security & Ledger Audits
            </h3>

            <div className="space-y-3">
              <div className="text-xs font-mono text-cyan-300">Live Crypto Audit Log stream:</div>
              <div className="bg-slate-950 border border-cyan-500/15 rounded-xl p-4 font-mono text-[10px] text-slate-300 space-y-2.5 max-h-[300px] overflow-y-auto">
                <div className="flex gap-2 items-start">
                  <span className="text-slate-500">[00:34:31]</span>
                  <span className="text-emerald-400 font-bold">[LEDGER_INIT]</span>
                  <span>Olayo master file initialized. System state OK.</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-slate-500">[00:15:00]</span>
                  <span className="text-orange-400 font-bold">[CHAIN_ALERT]</span>
                  <span>Facility monitor #2 (Ocean Express Truck) reported temperature warning threshold breach.</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-slate-500">[22:40:00]</span>
                  <span className="text-cyan-400 font-bold">[FLEET_REDUNDANCY]</span>
                  <span>Ocean Sentinel GPS telemetry synced. Docked at harbor.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentUser.role === 'Consumer' && (
          <div className="space-y-4 bg-slate-900/80 border border-cyan-500/30 p-5 rounded-2xl backdrop-blur-md">
            <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5 border-b border-cyan-500/10 pb-3">
              <ClipboardList className="w-5 h-5 text-cyan-400" />
              Order Telemetry & Historical receipts
            </h3>

            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map(o => (
                  <div key={o.id} className="bg-slate-950/60 border border-cyan-500/10 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div>
                      <div className="font-mono text-cyan-300 font-bold text-sm">Invoice ID: {o.id}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Sourcing Date: {new Date(o.date).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-400">Total Purchase: <span className="font-mono text-cyan-400">${o.total.toFixed(2)} USD</span></div>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={o.invoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1"
                      >
                        Commercial Invoice
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-400 font-sans border border-dashed border-cyan-500/10 rounded-xl bg-slate-950/20">
                You have not placed any orders yet. Visit the Seafood Marketplace to procure.
              </div>
            )}
          </div>
        )}

        {currentUser.role !== 'Producer' && currentUser.role !== 'Fleet Manager' && currentUser.role !== 'Quality Inspector' && currentUser.role !== 'Administrator' && currentUser.role !== 'Consumer' && (
          <div className="bg-slate-900/80 border border-cyan-500/30 p-8 rounded-2xl text-center backdrop-blur-md flex flex-col items-center justify-center space-y-4">
            <UserCheck className="w-12 h-12 text-cyan-400 animate-pulse" />
            <h4 className="font-display font-bold text-white text-base">{currentUser.role} Dashboard</h4>
            <p className="text-xs text-slate-300 max-w-md font-sans leading-relaxed">
              You are signed in under the certified role **{currentUser.role}**. Your actor account has read/write permissions to security certificates, commercial invoices, and temperature logs. Select other roles on the left sidebar to test different operational platforms.
            </p>
          </div>
        )}
          </>
        )}

        {hubTab === 'twins' && (
          <VesselDigitalTwin boats={boats} onBoatMaintenanceSubmitted={onBoatMaintenanceSubmitted} />
        )}

        {hubTab === 'logistics' && (
          <SmartLogistics />
        )}

        {hubTab === 'qa' && (
          <QualityAssurance />
        )}

        {hubTab === 'analytics' && (
          <AnalyticsCenter />
        )}

        {hubTab === 'comms' && (
          <PlatformComms />
        )}

        {hubTab === 'profile' && (
          <UserProfilePortal
            currentUser={currentUser}
            orders={orders}
            catchReports={catchReports}
          />
        )}
      </div>
    </div>
  );
}
