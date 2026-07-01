import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Waves, Ship, Sun, Sunset, Moon, Anchor, Compass, Heart, BookOpen, 
  Calendar, MapPin, ShieldCheck, Flame, Users, Sparkles, Phone, FileText, 
  Download, Briefcase, Award, ArrowRight, Activity, Info, Droplets, 
  Landmark, BarChart3, LineChart, Globe, HelpCircle, MessageSquare, 
  Plus, Check, UserPlus, CheckCircle2, AlertCircle, RefreshCw, Send, ChevronRight, Bookmark
} from 'lucide-react';
import { FloatingCard, SwipeContainer, SlideToConfirm } from './InteractionEngine';
import { Product, UserProfile, Order } from '../types';

interface OlayoEcosystemProps {
  products: Product[];
  currentUser?: UserProfile;
  onOrderCompleted?: (order: any) => void;
  sustainabilityScore: number;
  onSustainbilityIncrease?: (amount: number) => void;
}

// Mock Live Cages Data (10 cages operated by Olayo Fisheries on Lake Victoria)
interface Cage {
  id: string;
  name: string;
  species: string;
  stockCount: number;
  stockingDate: string;
  expectedHarvest: string;
  avgWeight: number; // in grams
  biomass: number; // in kg
  temperature: number; // °C
  doLevel: number; // Dissolved Oxygen mg/L
  pH: number;
  feedSchedule: string;
  dailyFeedKg: number;
  mortalityRate: number; // %
  maintenanceStatus: 'Optimal' | 'Cleaning' | 'Inspecting' | 'Harvest Ready';
  sensorStatus: 'Online' | 'Calibrating' | 'Offline';
}

const INITIAL_CAGES: Cage[] = [
  { id: 'CAGE-01', name: 'Busiime Alpha', species: 'Nile Tilapia (Ngege)', stockCount: 15400, stockingDate: '2026-02-10', expectedHarvest: '2026-08-10', avgWeight: 380, biomass: 5852, temperature: 26.4, doLevel: 6.8, pH: 7.2, feedSchedule: '08:00, 13:00, 17:00', dailyFeedKg: 180, mortalityRate: 1.1, maintenanceStatus: 'Optimal', sensorStatus: 'Online' },
  { id: 'CAGE-02', name: 'Busiime Beta', species: 'Nile Tilapia (Ngege)', stockCount: 14800, stockingDate: '2026-01-15', expectedHarvest: '2026-07-15', avgWeight: 490, biomass: 7252, temperature: 26.5, doLevel: 6.5, pH: 7.3, feedSchedule: '08:00, 13:00, 17:00', dailyFeedKg: 210, mortalityRate: 1.4, maintenanceStatus: 'Harvest Ready', sensorStatus: 'Online' },
  { id: 'CAGE-03', name: 'Busiime Gamma', species: 'Nile Perch (Mputa)', stockCount: 5200, stockingDate: '2025-11-20', expectedHarvest: '2026-09-20', avgWeight: 1450, biomass: 7540, temperature: 25.8, doLevel: 7.1, pH: 7.1, feedSchedule: '07:35, 15:30', dailyFeedKg: 320, mortalityRate: 2.1, maintenanceStatus: 'Optimal', sensorStatus: 'Online' },
  { id: 'CAGE-04', name: 'Sio Bay Deep', species: 'African Catfish (Male)', stockCount: 18200, stockingDate: '2026-03-05', expectedHarvest: '2026-09-05', avgWeight: 220, biomass: 4004, temperature: 27.2, doLevel: 5.4, pH: 6.9, feedSchedule: '09:00, 14:00, 18:00', dailyFeedKg: 120, mortalityRate: 0.9, maintenanceStatus: 'Optimal', sensorStatus: 'Online' },
  { id: 'CAGE-05', name: 'Majanji Shallows', species: 'Nile Tilapia (Ngege)', stockCount: 16000, stockingDate: '2026-03-20', expectedHarvest: '2026-09-20', avgWeight: 180, biomass: 2880, temperature: 26.8, doLevel: 6.9, pH: 7.4, feedSchedule: '08:00, 13:00, 17:00', dailyFeedKg: 95, mortalityRate: 0.7, maintenanceStatus: 'Inspecting', sensorStatus: 'Online' },
  { id: 'CAGE-06', name: 'Victoria Reef West', species: 'Nile Perch (Mputa)', stockCount: 4800, stockingDate: '2025-12-10', expectedHarvest: '2026-10-10', avgWeight: 1100, biomass: 5280, temperature: 25.9, doLevel: 7.0, pH: 7.2, feedSchedule: '07:35, 15:30', dailyFeedKg: 280, mortalityRate: 1.8, maintenanceStatus: 'Optimal', sensorStatus: 'Online' },
  { id: 'CAGE-07', name: 'Victoria Reef East', species: 'African Catfish (Male)', stockCount: 12000, stockingDate: '2026-04-01', expectedHarvest: '2026-10-01', avgWeight: 90, biomass: 1080, temperature: 27.0, doLevel: 5.8, pH: 7.0, feedSchedule: '09:00, 14:00, 18:00', dailyFeedKg: 45, mortalityRate: 0.5, maintenanceStatus: 'Optimal', sensorStatus: 'Calibrating' },
  { id: 'CAGE-08', name: 'Busiime Delta', species: 'Nile Tilapia (Ngege)', stockCount: 15000, stockingDate: '2026-05-01', expectedHarvest: '2026-11-01', avgWeight: 45, biomass: 675, temperature: 26.2, doLevel: 6.7, pH: 7.2, feedSchedule: '08:00, 13:00, 17:00', dailyFeedKg: 30, mortalityRate: 0.3, maintenanceStatus: 'Optimal', sensorStatus: 'Online' },
  { id: 'CAGE-09', name: 'Hatchery Reservoir', species: 'High-Survival Fingerlings', stockCount: 75000, stockingDate: '2026-06-01', expectedHarvest: '2026-07-15', avgWeight: 6, biomass: 450, temperature: 27.5, doLevel: 7.2, pH: 7.3, feedSchedule: 'Hourly automatic', dailyFeedKg: 25, mortalityRate: 1.2, maintenanceStatus: 'Cleaning', sensorStatus: 'Online' },
  { id: 'CAGE-10', name: 'Busiime Omega', species: 'Nile Tilapia (Ngege)', stockCount: 16500, stockingDate: '2026-02-28', expectedHarvest: '2026-08-28', avgWeight: 310, biomass: 5115, temperature: 26.3, doLevel: 6.6, pH: 7.2, feedSchedule: '08:00, 13:00, 17:00', dailyFeedKg: 155, mortalityRate: 1.0, maintenanceStatus: 'Optimal', sensorStatus: 'Online' },
];

export default function OlayoEcosystem({ 
  products, 
  currentUser, 
  onOrderCompleted, 
  sustainabilityScore,
  onSustainbilityIncrease 
}: OlayoEcosystemProps) {

  // Local tabs / sub-experiences
  const [ecoTab, setEcoTab] = useState<'twin' | 'species' | 'trace' | 'booking' | 'sustain' | 'outgrower'>('twin');
  const [currentTimePeriod, setCurrentTimePeriod] = useState<'morning' | 'afternoon' | 'sunset' | 'night'>('afternoon');
  const [droneMode, setDroneMode] = useState<boolean>(false);
  const [selectedCage, setSelectedCage] = useState<Cage | null>(INITIAL_CAGES[0]);
  const [traceOrderId, setTraceOrderId] = useState<string>('ord_1001');
  const [customTraceId, setCustomTraceId] = useState<string>('');
  const [traceSearchActive, setTraceSearchActive] = useState<boolean>(false);
  const [traceAnimStage, setTraceAnimStage] = useState<number>(0);

  // Form states
  const [visitFormData, setVisitFormData] = useState({ name: '', email: '', date: '', size: '10', purpose: 'School field trip', confirmed: false, ticketId: '' });
  const [consultFormData, setConsultFormData] = useState({ name: '', email: '', date: '', service: 'Cage Setup Design', notes: '', submitted: false });
  const [outgrowerFormData, setOutgrowerFormData] = useState({ name: '', location: 'Busia District', waterAccess: 'Yes, direct lake access', cageCount: '1', experience: 'No experience, seeking training', submitted: false });
  const [prebookQuantity, setPrebookQuantity] = useState<number>(250);
  const [prebookSuccess, setPrebookSuccess] = useState<boolean>(false);

  // Chatbot floating support
  const [showSupportChat, setShowSupportChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: "Hello! Welcome to Olayo Fisheries Support. Ask me anything about our cage farms, fingerlings, school visits, or outgrower support!" }
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Sponsoring local impact
  const [sponsorTrees, setSponsorTrees] = useState<number>(12);
  const [sponsorSuccess, setSponsorSuccess] = useState<boolean>(false);

  // Simulated live telemetry loop
  const [cages, setCages] = useState<Cage[]>(INITIAL_CAGES);
  useEffect(() => {
    const interval = setInterval(() => {
      setCages(prev => prev.map(c => {
        // slightly drift temperature and pH to simulate real sensors
        const tempDrift = (Math.random() - 0.5) * 0.1;
        const doDrift = (Math.random() - 0.5) * 0.05;
        const pHDrift = (Math.random() - 0.5) * 0.02;
        return {
          ...c,
          temperature: parseFloat((c.temperature + tempDrift).toFixed(2)),
          doLevel: parseFloat((c.doLevel + doDrift).toFixed(2)),
          pH: parseFloat((c.pH + pHDrift).toFixed(2)),
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Sync selected cage with telemetry drift
  const activeCageDetail = useMemo(() => {
    if (!selectedCage) return null;
    return cages.find(c => c.id === selectedCage.id) || selectedCage;
  }, [cages, selectedCage]);

  // Handle traceability step trigger
  useEffect(() => {
    if (traceSearchActive) {
      setTraceAnimStage(0);
      const timer = setInterval(() => {
        setTraceAnimStage(prev => {
          if (prev < 4) return prev + 1;
          clearInterval(timer);
          return prev;
        });
      }, 1400);
      return () => clearInterval(timer);
    }
  }, [traceSearchActive, traceOrderId]);

  const handleSupportSend = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');

    // Semantic response
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = "Our expert team has received your query. We operate in Busiime, Busia, Uganda. For urgent orders, feel free to call +256 700 123456.";
      if (lower.includes('tilapia') || lower.includes('ngege')) {
        reply = "Our Nile Tilapia (Ngege) is reared in deep, oxygen-rich water cages on Lake Victoria. They grow under controlled feeds with zero chemicals.";
      } else if (lower.includes('visit') || lower.includes('school')) {
        reply = "We offer guided educational tours for schools and researchers at Busiime! Go to the 'Visits & Consulting' tab to book your direct ticket and generate a secure entry QR code.";
      } else if (lower.includes('outgrower') || lower.includes('join')) {
        reply = "Yes! Local farmers can join our outgrower network. We supply premium fingerlings, high-quality floating feeds, and full technical training.";
      } else if (lower.includes('cage') || lower.includes('diagnostics')) {
        reply = "You can view each floating cage's water quality diagnostics, biomass calculations, and daily feed rates live in the 'Lake Victoria Cage Digital Twin' section.";
      }
      setChatMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    }, 1000);
  };

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitFormData.name || !visitFormData.date) return;
    const tId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
    setVisitFormData(prev => ({ ...prev, confirmed: true, ticketId: tId }));
    if (onSustainbilityIncrease) onSustainbilityIncrease(1);
  };

  const handleBookConsult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultFormData.name || !consultFormData.date) return;
    setConsultFormData(prev => ({ ...prev, submitted: true }));
  };

  const handleApplyOutgrower = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outgrowerFormData.name) return;
    setOutgrowerFormData(prev => ({ ...prev, submitted: true }));
    if (onSustainbilityIncrease) onSustainbilityIncrease(2);
  };

  const handleSponsorSustain = () => {
    setSponsorSuccess(true);
    if (onSustainbilityIncrease) onSustainbilityIncrease(sponsorTrees * 0.25);
    setTimeout(() => setSponsorSuccess(false), 4000);
  };

  // Environment colors based on time of day
  const envSkyColor = {
    morning: 'from-sky-700 via-amber-600/40 to-slate-900',
    afternoon: 'from-cyan-900 via-sky-800 to-slate-950',
    sunset: 'from-orange-800 via-rose-900 to-[#0e1629]',
    night: 'from-slate-950 via-[#0a1122] to-black',
  }[currentTimePeriod];

  const envSunPosition = {
    morning: 'bottom-20 left-1/4 bg-amber-400 shadow-[0_0_80px_rgba(245,158,11,0.6)]',
    afternoon: 'top-10 left-1/2 bg-cyan-200 shadow-[0_0_100px_rgba(34,211,238,0.7)]',
    sunset: 'bottom-4 right-1/3 bg-rose-500 shadow-[0_0_90px_rgba(239,68,68,0.8)]',
    night: 'top-10 right-1/4 bg-teal-100 shadow-[0_0_60px_rgba(45,212,191,0.35)]',
  }[currentTimePeriod];

  return (
    <div className="space-y-12">
      {/* SECTION 1: IMMERSIVE STORYTELLING STAGE (LAKE VICTORIA CANVAS) */}
      <section className="relative rounded-3xl overflow-hidden border border-cyan-500/20 bg-slate-950 shadow-2xl">
        {/* Dynamic Sky and Mountains Backdrop */}
        <div className={`h-[420px] bg-gradient-to-b ${envSkyColor} transition-all duration-1000 relative overflow-hidden flex flex-col justify-between p-6`}>
          
          {/* Stars for night */}
          {currentTimePeriod === 'night' && (
            <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#fff,transparent_100%),radial-gradient(1.5px_1.5px_at_120px_150px,#fff,transparent_100%)] opacity-40 pointer-events-none" />
          )}

          {/* Golden reflections overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(251,191,36,0.08),transparent_50%)] pointer-events-none" />

          {/* Environmental Clouds or Sun/Moon */}
          <motion.div 
            layout
            transition={{ type: 'spring', stiffness: 40, damping: 10 }}
            className={`absolute w-16 h-16 rounded-full ${envSunPosition} blur-[2px]`} 
          />

          {/* Flying Birds (Only during daytime periods) */}
          {(currentTimePeriod === 'morning' || currentTimePeriod === 'afternoon' || currentTimePeriod === 'sunset') && (
            <div className="absolute top-12 left-10 pointer-events-none w-full">
              <motion.div
                animate={{
                  x: ['0vw', '110vw'],
                  y: [20, -10, 40, 20]
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="flex gap-12 text-cyan-200/40"
              >
                <div className="flex flex-col items-center">
                  <span className="text-[10px] animate-bounce">🦢</span>
                </div>
                <div className="flex flex-col items-center mt-4">
                  <span className="text-xs animate-bounce" style={{ animationDelay: '1s' }}>🦢</span>
                </div>
                <div className="flex flex-col items-center -mt-2">
                  <span className="text-[9px] animate-bounce" style={{ animationDelay: '2s' }}>🦢</span>
                </div>
              </motion.div>
            </div>
          )}

          {/* Mountains silhouette in background */}
          <div className="absolute bottom-16 left-0 right-0 h-16 bg-slate-900/60 flex items-end justify-between pointer-events-none border-b border-cyan-500/5">
            <div className="w-[30%] h-14 bg-slate-950/40 rounded-t-[120px] blur-[1px]" />
            <div className="w-[45%] h-10 bg-slate-950/30 rounded-t-[100px] blur-[2px]" />
            <div className="w-[25%] h-16 bg-slate-950/50 rounded-t-[150px] blur-[1px]" />
          </div>

          {/* GENTLE LAKE WAVES & WATER LEVEL (LOWER HALF) */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-cyan-950/80 border-t border-cyan-500/30 backdrop-blur-sm z-10 overflow-hidden">
            {/* Water waves layering */}
            <div className="absolute inset-0 bg-repeat-x bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%221000%22 height=%22100%22 viewBox=%220 0 1000 100%22 fill=%22none%22><path d=%22M0,40 Q150,20 300,40 T600,40 T900,40 L1000,100 L0,100 Z%22 fill=%22%23083344%22 opacity=%220.4%22/></svg>')] animate-pulse" />
            <div className="absolute inset-0 bg-repeat-x bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%221000%22 height=%22100%22 viewBox=%220 0 1000 100%22 fill=%22none%22><path d=%22M0,50 Q120,60 250,50 T500,50 T750,50 L1000,100 L0,100 Z%22 fill=%22%23164e63%22 opacity=%220.3%22/></svg>')] animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Interactive Floating Fish Cages (bobbing in water) */}
            <div className="absolute inset-x-0 bottom-4 flex justify-around items-center px-4 z-20">
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                onClick={() => { setEcoTab('twin'); setSelectedCage(cages[0]); }}
                className="bg-slate-900/90 border-2 border-cyan-400 rounded-xl px-2 py-1 flex items-center gap-1 cursor-pointer text-[10px] hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20 text-white"
              >
                <Anchor className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Cage 1 (Tilapia)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              </motion.div>

              {/* Boat travelling between cages */}
              <motion.div
                animate={{
                  x: ['-10vw', '75vw', '-10vw'],
                  y: [0, -2, 1, 0]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute flex items-center gap-1.5 text-xs text-white"
              >
                <div className="bg-slate-900 border border-teal-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                  <Ship className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                  <span className="font-mono text-[9px] text-teal-300">Olayo-Logistics-03</span>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                onClick={() => { setEcoTab('twin'); setSelectedCage(cages[2]); }}
                className="bg-slate-900/90 border-2 border-orange-500/60 rounded-xl px-2 py-1 flex items-center gap-1 cursor-pointer text-[10px] hover:scale-105 transition-transform shadow-lg text-white"
              >
                <Anchor className="w-3 h-3 text-orange-400 shrink-0" />
                <span>Cage 3 (Nile Perch)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              </motion.div>

              <motion.div 
                animate={{ y: [1, -3, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                onClick={() => { setEcoTab('twin'); setSelectedCage(cages[3]); }}
                className="bg-slate-900/90 border-2 border-cyan-400/50 rounded-xl px-2 py-1 flex items-center gap-1 cursor-pointer text-[10px] hover:scale-105 transition-transform text-white"
              >
                <Anchor className="w-3 h-3 text-cyan-300 shrink-0" />
                <span>Cage 4 (Catfish)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              </motion.div>
            </div>
          </div>

          {/* Cinematic Top Control Overlays */}
          <div className="w-full flex justify-between items-start z-20">
            <div>
              <span className="text-[10px] font-mono uppercase bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 px-3 py-1 rounded-full backdrop-blur-md font-bold tracking-widest">
                📍 Lake Victoria Ecosystem • Busiime, Uganda
              </span>
              <h2 className="font-display font-extrabold text-white text-2xl sm:text-4xl mt-3 tracking-tight">
                OLAYO CAGE AQUACULTURE
              </h2>
              <p className="text-xs text-cyan-200/80 max-w-md font-sans leading-relaxed mt-1">
                Farming premium Nile Tilapia & Nile Perch across ten advanced floating deep-water cages in Busia District.
              </p>
            </div>

            {/* Time period controller & Drone View toggle */}
            <div className="flex flex-col sm:flex-row gap-2 bg-slate-950/80 p-2 border border-cyan-500/20 rounded-xl backdrop-blur-md">
              <div className="flex gap-1">
                {(['morning', 'afternoon', 'sunset', 'night'] as const).map(time => (
                  <button
                    key={time}
                    onClick={() => setCurrentTimePeriod(time)}
                    className={`p-1.5 rounded-md transition-all text-xs uppercase font-mono ${currentTimePeriod === time ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                    title={`Set environment to ${time}`}
                  >
                    {time === 'morning' && <Sun className="w-3.5 h-3.5" />}
                    {time === 'afternoon' && <Compass className="w-3.5 h-3.5" />}
                    {time === 'sunset' && <Sunset className="w-3.5 h-3.5" />}
                    {time === 'night' && <Moon className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setDroneMode(prev => !prev)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold transition-all ${droneMode ? 'bg-teal-500 text-slate-950 shadow-md animate-pulse' : 'bg-slate-900 text-cyan-300 border border-cyan-500/20'}`}
              >
                🛰️ Drone View: {droneMode ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Drone-inspired grid lines overlay if activated */}
          {droneMode && (
            <div className="absolute inset-0 border-[3px] border-dashed border-teal-500/20 pointer-events-none z-10 animate-pulse">
              <div className="absolute top-4 left-4 font-mono text-[9px] text-teal-400 bg-slate-950/90 px-2 py-0.5 rounded">ALT: 180M • CAM_01</div>
              <div className="absolute bottom-20 right-4 font-mono text-[9px] text-teal-400 bg-slate-950/90 px-2 py-0.5 rounded">GRID: BUSIIME_L_VIC</div>
              {/* Drone centering reticle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-teal-400/40 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-teal-400 rounded-full" />
              </div>
            </div>
          )}

          {/* Bottom Live highlights strip */}
          <div className="w-full bg-slate-950/90 border border-cyan-500/10 p-3 rounded-2xl backdrop-blur-md z-20 flex flex-wrap gap-4 items-center justify-between text-xs sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[10px] text-slate-400 uppercase">Live highlights:</span>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-1 items-center flex-1 justify-around font-mono text-[11px]">
              <div>
                <span className="text-slate-500">Active Cages:</span>{' '}
                <span className="text-white font-bold">10 Cages</span>
              </div>
              <div>
                <span className="text-slate-500">Production:</span>{' '}
                <span className="text-cyan-400 font-bold">120+ Tons/yr</span>
              </div>
              <div>
                <span className="text-slate-500">Water Index:</span>{' '}
                <span className="text-emerald-400 font-bold">96/100 (Optimal)</span>
              </div>
              <div>
                <span className="text-slate-500">Today's Harvest:</span>{' '}
                <span className="text-orange-400 font-bold">850 kg Tilapia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SUB-EXPERIENCE TABS CONTROL */}
      <section className="space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-cyan-500/15 pb-4">
          {[
            { id: 'twin', label: 'Lake Victoria Twin', icon: Waves },
            { id: 'species', label: 'Farmed Species', icon: Anchor },
            { id: 'trace', label: 'From Cage to Plate', icon: Compass },
            { id: 'booking', label: 'Visits & Consulting', icon: Calendar },
            { id: 'outgrower', label: 'Outgrower Hub', icon: Users },
            { id: 'sustain', label: 'Eco-Sustainability', icon: Droplets },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = ecoTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setEcoTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isActive ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900/60 border-cyan-500/10 text-slate-400 hover:text-white'}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ACTIVE MODULE CONTAINER */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* MODULE A: DIGITAL CAGE TWIN */}
            {ecoTab === 'twin' && (
              <motion.div
                key="twin"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* 10 Cages Spatial Grid Map */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 backdrop-blur-md">
                    <h3 className="font-display font-bold text-white text-base flex items-center gap-2 border-b border-cyan-500/10 pb-3">
                      <Compass className="w-5 h-5 text-cyan-400" />
                      Lake Victoria Cage Layout Map (Spatial Digital Twin)
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-2 leading-relaxed">
                      Below is the actual coordinate distribution of our cages in Busiime Bay, Busia, Uganda. Select any floating cage to pull real-time NPK, temperature, feeding rate, and biological biomass diagnostics.
                    </p>

                    {/* Visual Cages Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
                      {cages.map((cage) => {
                        const isSelected = selectedCage?.id === cage.id;
                        return (
                          <div
                            key={cage.id}
                            onClick={() => setSelectedCage(cage)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-28 relative overflow-hidden group ${isSelected ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-102' : 'bg-slate-950/60 border-cyan-500/10 hover:border-cyan-400/30'}`}
                          >
                            <span className="font-mono text-[9px] text-slate-500 group-hover:text-cyan-400 transition-colors block">
                              {cage.id}
                            </span>
                            <div className="mt-1">
                              <h4 className="font-display font-bold text-white text-xs line-clamp-1">
                                {cage.name}
                              </h4>
                              <p className="text-[10px] text-cyan-300 font-mono mt-0.5">
                                {cage.species.split(' ')[0]}
                              </p>
                            </div>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-cyan-500/10">
                              <span className="text-[10px] text-slate-400 font-mono">
                                {(cage.biomass / 1000).toFixed(1)}t
                              </span>
                              <span className={`w-2 h-2 rounded-full ${cage.maintenanceStatus === 'Harvest Ready' ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary of Digital twin status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-900/60 border border-cyan-500/10 p-4 rounded-xl flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Waves className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Total Biomass Active</span>
                        <span className="text-sm font-bold text-white">44.8 Tons Stocked</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/60 border border-cyan-500/10 p-4 rounded-xl flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                        <Droplets className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Avg dissolved oxygen</span>
                        <span className="text-sm font-bold text-emerald-400">6.65 mg/L (Healthy)</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/60 border border-cyan-500/10 p-4 rounded-xl flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Operative Crew Onsite</span>
                        <span className="text-sm font-bold text-white">16 Lake Wardens</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Cage Telemetry Readout */}
                {activeCageDetail && (
                  <div className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-md space-y-6">
                    <div className="flex justify-between items-start border-b border-cyan-500/10 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold block">{activeCageDetail.id} Telemetry</span>
                        <h3 className="font-display font-bold text-white text-base mt-0.5">{activeCageDetail.name}</h3>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${activeCageDetail.maintenanceStatus === 'Harvest Ready' ? 'bg-orange-500/25 text-orange-400 border border-orange-400/30' : 'bg-emerald-500/25 text-emerald-400 border border-emerald-400/30'}`}>
                        {activeCageDetail.maintenanceStatus}
                      </span>
                    </div>

                    {/* Interactive Telemetry Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-950/40 p-3 rounded-xl border border-cyan-500/5">
                        <span className="text-[10px] text-slate-500 uppercase block">Species Stocked</span>
                        <span className="text-xs font-bold text-white mt-1 block line-clamp-1">{activeCageDetail.species}</span>
                      </div>
                      <div className="bg-slate-950/40 p-3 rounded-xl border border-cyan-500/5">
                        <span className="text-[10px] text-slate-500 uppercase block">Total Fish Count</span>
                        <span className="text-xs font-bold text-white mt-1 block">{activeCageDetail.stockCount.toLocaleString()} fish</span>
                      </div>
                      <div className="bg-slate-950/40 p-3 rounded-xl border border-cyan-500/5">
                        <span className="text-[10px] text-slate-500 uppercase block">Dissolved Oxygen</span>
                        <span className="text-xs font-bold text-emerald-400 mt-1 block flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5" />
                          {activeCageDetail.doLevel} mg/L
                        </span>
                      </div>
                      <div className="bg-slate-950/40 p-3 rounded-xl border border-cyan-500/5">
                        <span className="text-[10px] text-slate-500 uppercase block">Water pH</span>
                        <span className="text-xs font-bold text-cyan-300 mt-1 block">{activeCageDetail.pH}</span>
                      </div>
                      <div className="bg-slate-950/40 p-3 rounded-xl border border-cyan-500/5">
                        <span className="text-[10px] text-slate-500 uppercase block">Water Temp</span>
                        <span className="text-xs font-bold text-white mt-1 block">{activeCageDetail.temperature}°C</span>
                      </div>
                      <div className="bg-slate-950/40 p-3 rounded-xl border border-cyan-500/5">
                        <span className="text-[10px] text-slate-500 uppercase block">Biomass Volume</span>
                        <span className="text-xs font-bold text-white mt-1 block">{(activeCageDetail.biomass).toLocaleString()} kg</span>
                      </div>
                    </div>

                    {/* Stocking Details and growth statistics */}
                    <div className="bg-slate-950/50 p-3.5 rounded-xl border border-cyan-500/10 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stocking Date:</span>
                        <span className="text-white font-mono">{activeCageDetail.stockingDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Expected Harvest:</span>
                        <span className="text-white font-mono font-bold text-cyan-400">{activeCageDetail.expectedHarvest}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Average Weight:</span>
                        <span className="text-white font-mono">{activeCageDetail.avgWeight} grams</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Feeding Frequency:</span>
                        <span className="text-white">{activeCageDetail.feedSchedule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Daily Feed Rate:</span>
                        <span className="text-white font-mono">{activeCageDetail.dailyFeedKg} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Mortality Index:</span>
                        <span className="text-red-400 font-mono font-bold">{activeCageDetail.mortalityRate}%</span>
                      </div>
                    </div>

                    {/* Action buttons: Pre-book harvest */}
                    {activeCageDetail.maintenanceStatus === 'Harvest Ready' ? (
                      <div className="space-y-3 pt-2">
                        <div className="text-center text-[11px] text-orange-400 font-semibold bg-orange-950/30 p-2.5 rounded-lg border border-orange-500/20">
                          ⚠️ This cage is primed for optimal commercial harvest. Restaurants and wholesalers can pre-allocate stocks now.
                        </div>

                        {prebookSuccess ? (
                          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                            <Check className="w-4 h-4" /> Harvest Pre-booked Successfully!
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={prebookQuantity}
                              onChange={(e) => setPrebookQuantity(parseInt(e.target.value) || 0)}
                              className="w-24 bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-1.5 text-xs text-cyan-300 outline-none font-mono"
                              min="50"
                              max="2000"
                            />
                            <button
                              onClick={() => {
                                setPrebookSuccess(true);
                                if (onSustainbilityIncrease) onSustainbilityIncrease(1);
                              }}
                              className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:opacity-90 flex justify-center items-center gap-1.5 shadow-lg shadow-orange-500/20 cursor-pointer"
                            >
                              <Anchor className="w-3.5 h-3.5 fill-current" /> Reserve {prebookQuantity}kg Stock
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-[10px] text-slate-500 font-mono bg-slate-950/30 p-2 rounded-lg">
                        Daily Growth Matrix: Biomass increasing at avg ~1.2% daily.
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* MODULE B: SPECIES CENTRE */}
            {ecoTab === 'species' && (
              <motion.div
                key="species"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: 'Nile Tilapia',
                      localName: 'Ngege',
                      scientific: 'Oreochromis niloticus',
                      desc: 'The staple of East African aquaculture. Reared in deep-water cages inside floating Lake Victoria rings. Features succulent white meat, extremely low fats, and high protein density.',
                      class: 'Cichlidae • Herbivore/Omnivore',
                      tempRange: '24°C - 30°C',
                      doReq: '> 4.5 mg/L',
                      harvestAge: '6 - 8 Months',
                      avgWeight: '500g - 800g',
                      nutrients: 'Protein: 20.1g, Lipids: 1.7g, Omega-3: 0.6g per 100g',
                      priceTrend: 'Stable ($5.80/kg)',
                      color: 'border-cyan-500/25 shadow-cyan-500/5',
                      image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=400',
                    },
                    {
                      name: 'Nile Perch',
                      localName: 'Mputa',
                      scientific: 'Lates niloticus',
                      desc: 'A magnificent freshwater predator found abundantly in Lake Victoria. Reared under strict sustainable stocking densities. Delivers giant, meaty boneless fillets prized worldwide for thick culinary flakes.',
                      class: 'Centropomidae • Carnivore',
                      tempRange: '23°C - 28°C',
                      doReq: '> 5.5 mg/L',
                      harvestAge: '12 - 18 Months',
                      avgWeight: '1.2kg - 8kg',
                      nutrients: 'Protein: 19.6g, Lipids: 2.1g, Omega-3: 0.8g per 100g',
                      priceTrend: 'High Demand ($12.50/kg)',
                      color: 'border-amber-500/25 shadow-amber-500/5',
                      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
                    },
                    {
                      name: 'African Catfish',
                      localName: 'Male',
                      scientific: 'Clarias gariepinus',
                      desc: 'Farmed in our specific Busiime nursery cages. Incredibly robust freshwater species capable of thriving in varied oxygen thresholds. Possesses firm, deep red meat loaded with traditional texture.',
                      class: 'Clariidae • Omnivore',
                      tempRange: '25°C - 32°C',
                      doReq: '> 3.0 mg/L',
                      harvestAge: '7 - 10 Months',
                      avgWeight: '800g - 2kg',
                      nutrients: 'Protein: 18.5g, Lipids: 4.2g, Omega-3: 0.4g per 100g',
                      priceTrend: 'Rising ($6.50/kg)',
                      color: 'border-emerald-500/25 shadow-emerald-500/5',
                      image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&q=80&w=400',
                    }
                  ].map((sp) => (
                    <div 
                      key={sp.name}
                      className={`bg-slate-900/60 border rounded-2xl overflow-hidden backdrop-blur-md flex flex-col justify-between hover:scale-101 transition-all shadow-xl ${sp.color}`}
                    >
                      <div className="relative h-44 overflow-hidden bg-slate-950">
                        <img 
                          src={sp.image} 
                          alt={sp.name} 
                          className="w-full h-full object-cover brightness-95" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-slate-950/80 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-mono text-[9px] text-cyan-300 font-bold">
                          Local name: {sp.localName}
                        </div>
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h4 className="font-display font-bold text-white text-base sm:text-lg">{sp.name}</h4>
                          <p className="text-[11px] font-mono text-slate-400 italic">{sp.scientific}</p>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{sp.desc}</p>
                        </div>

                        <div className="border-t border-cyan-500/10 pt-3 space-y-1.5 text-[11px] font-mono">
                          <div className="flex justify-between text-slate-400">
                            <span>Classification:</span>
                            <span className="text-white">{sp.class}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Harvest Target:</span>
                            <span className="text-cyan-300">{sp.avgWeight} ({sp.harvestAge})</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Oxygen Req:</span>
                            <span className="text-emerald-400">{sp.doReq}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Nutritional Profile:</span>
                            <span className="text-white text-[10px] text-right truncate pl-4">{sp.nutrients}</span>
                          </div>
                          <div className="flex justify-between text-slate-400 pt-1.5 border-t border-cyan-500/5">
                            <span>Market Value:</span>
                            <span className="text-orange-400 font-bold">{sp.priceTrend}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* MODULE C: CAGE TO PLATE TRACEABILITY */}
            {ecoTab === 'trace' && (
              <motion.div
                key="trace"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 backdrop-blur-md space-y-6"
              >
                <div className="border-b border-cyan-500/10 pb-4">
                  <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                    <Compass className="w-5 h-5 text-cyan-400" />
                    Olayo Seafood Ledger: From Cage to Plate Traceability
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-2">
                    Every fish harvested has its complete biological, log, temperature, and logistical lifecycle written to Olayo's ledger. Select a transaction to run full traceability.
                  </p>
                </div>

                {/* Simulated search or scan block */}
                <div className="flex flex-col sm:flex-row gap-3 items-end bg-slate-950/40 p-4 border border-cyan-500/5 rounded-xl">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Select Active Batch / Invoice ID</label>
                    <select
                      value={traceOrderId}
                      onChange={(e) => { setTraceOrderId(e.target.value); setTraceSearchActive(false); }}
                      className="w-full bg-slate-900 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-cyan-300 outline-none"
                    >
                      <option value="ord_1001">Invoice ord_1001 - Henri Dubois Fine Foods</option>
                      <option value="ord_olayo_01">Batch LV-TIL-884 - Lake Victoria Local Delivery</option>
                      <option value="ord_olayo_02">Batch LV-PER-921 - Kampala Distributor Transit</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Or enter QR custom code</label>
                    <input
                      type="text"
                      placeholder="e.g. OLAYO-LV-9831"
                      value={customTraceId}
                      onChange={(e) => setCustomTraceId(e.target.value)}
                      className="w-full bg-slate-900 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setTraceSearchActive(true)}
                    className="px-6 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-400 flex items-center gap-1.5 shrink-0 shadow-md shadow-cyan-500/15 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${traceSearchActive && traceAnimStage < 4 ? 'animate-spin' : ''}`} /> Run Audit Scan
                  </button>
                </div>

                {/* Animated Trace Steps */}
                {traceSearchActive && (
                  <div className="space-y-8 pt-4">
                    <div className="text-xs font-mono text-cyan-400 text-center animate-pulse">
                      🔎 Ledger scanning block coefficients... verified 100% security matching.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                      {/* Horizontal Connector Line for desktop */}
                      <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-slate-800 z-0" />

                      {[
                        { stage: '1. Cage Farming', place: 'Busiime Cages, Uganda', icon: Waves, details: 'Tilapia reared in Floating Cage #2. Average Lake temperature 26.5°C, pH 7.3. Logged on 2026-06-15.', color: 'border-cyan-500' },
                        { stage: '2. Harvesting', place: 'Lake Victoria Landing', icon: Anchor, details: 'Batch certified hand-harvested by Olayo Warden Team. Quality check score: 98%. Water cooled at sea to 1.5°C.', color: 'border-cyan-400' },
                        { stage: '3. Processing Hub', place: 'Olayo Busia Depot', icon: ShieldCheck, details: 'Cleaned, graded, and biodegradable vacuum sealed. Super-chilled flash cold blast at -2.0°C within 1 hour.', color: 'border-teal-400' },
                        { stage: '4. Cold Chain Transit', place: 'Refrigerated Carrier', icon: Ship, details: 'Super-chilled logistics truck tracking active. Live sensor feed locked at constant -1.8°C with GPS route mapping.', color: 'border-emerald-400' },
                        { stage: '5. Landing/Plating', place: 'Customer Doorstep', icon: CheckCircle2, details: 'Secure handover dispatch authorized via local SatLink. Chain-of-custody locked. Freshness index: Prime.', color: 'border-emerald-300' }
                      ].map((stp, idx) => {
                        const isUnlocked = traceAnimStage >= idx;
                        return (
                          <motion.div
                            key={stp.stage}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={isUnlocked ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.25 }}
                            transition={{ duration: 0.4 }}
                            className={`p-4 rounded-xl border bg-slate-950/60 z-10 flex flex-col justify-between space-y-3 relative ${isUnlocked ? `border-2 ${stp.color} shadow-lg` : 'border-slate-800'}`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[9px] text-slate-500">STAGE 0{idx + 1}</span>
                              {isUnlocked ? (
                                <span className="text-[8px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase">Verified</span>
                              ) : (
                                <span className="text-[8px] font-mono text-slate-500 px-1.5 py-0.5 rounded uppercase">Pending</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${isUnlocked ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-900 text-slate-500'}`}>
                                <stp.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">{stp.stage}</h4>
                                <p className="text-[10px] text-slate-400 font-mono">{stp.place}</p>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-300 font-sans leading-normal">
                              {stp.details}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* QR Code Graphic element */}
                    {traceAnimStage === 4 && (
                      <div className="max-w-xs mx-auto text-center bg-slate-950 p-4 border border-cyan-500/20 rounded-xl space-y-2">
                        <div className="w-24 h-24 bg-white p-2 mx-auto rounded">
                          {/* QR Mock image */}
                          <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#000,#000_5px,#fff_5px,#fff_10px)]" />
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 block font-bold">✓ SECURITY TOKEN KEY VERIFIED</span>
                        <p className="text-[9px] text-slate-500">Scan this QR on your phone to download the full audited PDF of this seafood batch, backed by Uganda Fisheries Authority certificates.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* MODULE D: BOOKING PORTAL (VISITS & CONSULTANCY) */}
            {ecoTab === 'booking' && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* School and Tour Visit Schedulers */}
                <div className="bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 backdrop-blur-md space-y-5">
                  <div className="border-b border-cyan-500/10 pb-3">
                    <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                      Book an Educational Farm Visit
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-1">
                      We love hosting schools, university researchers, government officials, and sustainable aquaculture tourists at our floating cage facilities on Lake Victoria.
                    </p>
                  </div>

                  {visitFormData.confirmed ? (
                    <div className="bg-slate-950 p-5 rounded-2xl border-2 border-emerald-500/30 text-center space-y-4 shadow-xl">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-white text-base">Booking Confirmed!</h4>
                        <p className="text-xs text-slate-400 mt-1">Your educational pass has been issued on the Olayo Ledger.</p>
                      </div>

                      {/* Ticket graphics */}
                      <div className="border-t border-b border-dashed border-slate-800 py-3.5 space-y-1.5 text-xs text-left">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Visitor:</span>
                          <span className="text-white font-bold">{visitFormData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Target Date:</span>
                          <span className="text-cyan-400 font-mono font-bold">{visitFormData.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Group Size:</span>
                          <span className="text-white">{visitFormData.size} Attendees</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Ticket ID:</span>
                          <span className="text-white font-mono">{visitFormData.ticketId}</span>
                        </div>
                      </div>

                      <div className="w-20 h-20 bg-white p-1 mx-auto rounded flex items-center justify-center">
                        {/* Mock QR */}
                        <div className="w-full h-full bg-[radial-gradient(#000_15%,transparent_16%),radial-gradient(#000_15%,transparent_16%)] bg-[length:10px_10px]" style={{ bgPosition: '0 0, 5px 5px' }} />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 block">Show this QR code at the landing pier for SatLink check-in.</span>

                      <button
                        onClick={() => setVisitFormData(prev => ({ ...prev, confirmed: false }))}
                        className="text-xs text-cyan-400 hover:underline font-mono"
                      >
                        Book another visit
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBookVisit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Contact Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Professor Wandera"
                            value={visitFormData.name}
                            onChange={(e) => setVisitFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. wandera@busiauniversity.ac.ug"
                            value={visitFormData.email}
                            onChange={(e) => setVisitFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Tour Date</label>
                          <input
                            type="date"
                            required
                            value={visitFormData.date}
                            onChange={(e) => setVisitFormData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Group Size</label>
                          <select
                            value={visitFormData.size}
                            onChange={(e) => setVisitFormData(prev => ({ ...prev, size: e.target.value }))}
                            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-cyan-300 outline-none"
                          >
                            <option value="5">1 - 5 Persons</option>
                            <option value="15">6 - 15 Persons</option>
                            <option value="40">16 - 40 Persons</option>
                            <option value="100">40+ Persons (Bulk)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Primary Purpose of Tour</label>
                        <select
                          value={visitFormData.purpose}
                          onChange={(e) => setVisitFormData(prev => ({ ...prev, purpose: e.target.value }))}
                          className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-cyan-300 outline-none"
                        >
                          <option value="School field trip">High School / Elementary Biology field trip</option>
                          <option value="University Research">University Aquaculture research practical</option>
                          <option value="Government inspection">Ministry of Agriculture / Fisheries Audit</option>
                          <option value="Investor inspection">Potential Investor cage inspection</option>
                          <option value="General Tourism">Ecotourism sightseeing tour</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-400 transition-all flex justify-center items-center gap-1.5 shadow-lg shadow-cyan-500/10 cursor-pointer"
                      >
                        <Check className="w-4 h-4" /> Schedule Visit & Generate Ticket
                      </button>
                    </form>
                  )}
                </div>

                {/* Professional Aquaculture Consulting */}
                <div className="bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 backdrop-blur-md space-y-5">
                  <div className="border-b border-cyan-500/10 pb-3">
                    <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                      <Compass className="w-5 h-5 text-amber-400" />
                      Book Technical Consultation
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-1">
                      Our marine biologists, cage engineers, and farm operations experts provide corporate feasibility studies, water-site assessments, and cage fabrication consulting.
                    </p>
                  </div>

                  {consultFormData.submitted ? (
                    <div className="p-5 bg-teal-950/40 border border-teal-500/20 rounded-xl text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500/15 text-teal-400 flex items-center justify-center mx-auto">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-white text-xs">Consultancy Request Received!</h4>
                        <p className="text-[11px] text-slate-400 mt-1">An Olayo technical engineer will call you back on your registered credentials within 24 hours to coordinate.</p>
                      </div>
                      <button
                        onClick={() => setConsultFormData(prev => ({ ...prev, submitted: false }))}
                        className="text-xs text-cyan-400 hover:underline font-mono"
                      >
                        Submit another inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBookConsult} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Contact Person / Company</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Busia Farmers cooperative"
                          value={consultFormData.name}
                          onChange={(e) => setConsultFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Requested Service</label>
                          <select
                            value={consultFormData.service}
                            onChange={(e) => setConsultFormData(prev => ({ ...prev, service: e.target.value }))}
                            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-cyan-300 outline-none"
                          >
                            <option value="Cage Setup Design">Floating Cage Setup & Engineering</option>
                            <option value="Feasibility Study">Aquaculture Business Feasibility study</option>
                            <option value="Water Audit">Water Site chemical & depth feasibility</option>
                            <option value="Feeding Programs">Feeding Optimization & Growth trials</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Target Date</label>
                          <input
                            type="date"
                            required
                            value={consultFormData.date}
                            onChange={(e) => setConsultFormData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Ecosystem Notes / Specifications</label>
                        <textarea
                          placeholder="Please describe your site (e.g. water depth, budget, target production volume)..."
                          value={consultFormData.notes}
                          onChange={(e) => setConsultFormData(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-full h-20 bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-400 transition-all flex justify-center items-center gap-1.5 shadow-lg shadow-cyan-500/10 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" /> Book Online Consultation
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}

            {/* MODULE E: OUTGROWER HUB */}
            {ecoTab === 'outgrower' && (
              <motion.div
                key="outgrower"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Outgrower Information */}
                <div className="bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 backdrop-blur-md space-y-4">
                  <div className="border-b border-cyan-500/10 pb-3">
                    <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-400" />
                      Olayo Aquaculture Outgrower Program
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-1">
                      Empowering local communities around Lake Victoria to establish profitable, sustainable cage fish farms.
                    </p>
                  </div>

                  <div className="space-y-3.5 text-xs text-slate-300 font-sans leading-relaxed">
                    <p>
                      At Olayo Fisheries, we believe in inclusive community development. Our **Outgrower Program** is a strategic partnership designed to support smallholder farmers in Busia District and neighboring regions.
                    </p>
                    <div className="bg-slate-950/40 p-3.5 rounded-xl border border-cyan-500/5 space-y-2.5">
                      <div className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Premium Fingerlings Input:</strong>
                          <p className="text-slate-400 text-[11px] mt-0.5">Direct supply of high-survival Nile Tilapia fingerlings directly conditioned from our Busiime nurseries.</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Aggregated Market Access:</strong>
                          <p className="text-slate-400 text-[11px] mt-0.5">Olayo guarantees to buy back your mature harvest at stable competitive market prices, protecting you from brokers.</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Technical Training & Extension:</strong>
                          <p className="text-slate-400 text-[11px] mt-0.5">Regular onsite monitoring, water-testing parameters, and biological disease diagnostic assistance by Olayo extension wardens.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply online form */}
                <div className="bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 backdrop-blur-md">
                  <h3 className="font-display font-bold text-white text-sm flex items-center gap-2 border-b border-cyan-500/10 pb-3">
                    <UserPlus className="w-4.5 h-4.5 text-cyan-400" />
                    Submit Outgrower Application
                  </h3>

                  {outgrowerFormData.submitted ? (
                    <div className="p-6 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-center space-y-4 mt-6">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-white text-base">Application Submitted!</h4>
                        <p className="text-xs text-slate-300 mt-1">An Olayo Community Coordinator has registered your farm profile. Our extension wardens will contact you for a site audit visit.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyOutgrower} className="space-y-4 mt-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Applicant / Farm Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Abdul Wandera Cooperative"
                          value={outgrowerFormData.name}
                          onChange={(e) => setOutgrowerFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Location (District/County)</label>
                          <select
                            value={outgrowerFormData.location}
                            onChange={(e) => setOutgrowerFormData(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-cyan-300 outline-none"
                          >
                            <option value="Busia District">Busia District, Uganda</option>
                            <option value="Namayingo District">Namayingo District, Uganda</option>
                            <option value="Bugiri District">Bugiri District, Uganda</option>
                            <option value="Kenya Border Bay">Sio Port / Border Bay</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Direct Water Access?</label>
                          <select
                            value={outgrowerFormData.waterAccess}
                            onChange={(e) => setOutgrowerFormData(prev => ({ ...prev, waterAccess: e.target.value }))}
                            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-cyan-300 outline-none"
                          >
                            <option value="Yes, direct lake access">Yes, direct lake access</option>
                            <option value="Pond setup, nearby river">Pond setup, nearby river</option>
                            <option value="Seeking floating site lease">Seeking floating site lease</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Planned Cages / Ponds Count</label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="20"
                            value={outgrowerFormData.cageCount}
                            onChange={(e) => setOutgrowerFormData(prev => ({ ...prev, cageCount: e.target.value }))}
                            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Current Aquaculture Experience</label>
                          <select
                            value={outgrowerFormData.experience}
                            onChange={(e) => setOutgrowerFormData(prev => ({ ...prev, experience: e.target.value }))}
                            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-cyan-300 outline-none"
                          >
                            <option value="No experience, seeking training">No experience, seeking training</option>
                            <option value="Moderate pond farming experience">Moderate pond farming experience</option>
                            <option value="Experienced cage fish farmer">Experienced cage fish farmer</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-400 transition-all flex justify-center items-center gap-1.5 shadow-lg shadow-cyan-500/10 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" /> Submit Outgrower Request
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}

            {/* MODULE F: ECO-SUSTAINABILITY HUD */}
            {ecoTab === 'sustain' && (
              <motion.div
                key="sustain"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Score & Ecosystem Restoration Animation */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 backdrop-blur-md space-y-6">
                  <div className="border-b border-cyan-500/10 pb-3">
                    <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-cyan-400 animate-pulse" />
                      Lake Victoria Ecology Conservation Portal
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-1">
                      Our commitment to protecting Lake Victoria. We maintain advanced zero-plastic floating cage structures, organic feeding, and fund active shoreline tree-planting to minimize nutrient run-off.
                    </p>
                  </div>

                  {/* Ecological restore level illustration */}
                  <div className="bg-slate-950/80 p-5 rounded-2xl border border-cyan-500/20 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                    <div className="absolute top-3 right-3 text-right">
                      <span className="text-[10px] font-mono text-slate-500 block">Lake Health Index</span>
                      <span className="text-2xl font-extrabold text-emerald-400 font-mono">{sustainabilityScore.toFixed(1)}%</span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        Lake Shore Restoration Status
                      </span>
                      <p className="text-[11px] text-slate-400 max-w-md">
                        As conservation projects progress, the water quality score improves, directly expanding native cichlid populations and fish stocks.
                      </p>
                    </div>

                    {/* Progress tracking bars */}
                    <div className="space-y-2 mt-4 pt-4 border-t border-cyan-500/5">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Carbon offset progress:</span>
                        <span className="text-white">74.2%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: '74.2%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Community & Environmental highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                    <div className="p-4 rounded-xl bg-slate-950/40 border border-cyan-500/5">
                      <strong className="text-white block font-display">1,240+ Trees Planted</strong>
                      <span className="text-slate-400 text-[11px] mt-0.5 block leading-normal">Shoreline buffer strips to curb local soil erosion.</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/40 border border-cyan-500/5">
                      <strong className="text-white block font-display">100% Organic Feeds</strong>
                      <span className="text-slate-400 text-[11px] mt-0.5 block leading-normal">Pellets formulated strictly with insect protein.</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/40 border border-cyan-500/5">
                      <strong className="text-white block font-display">98% Plastic-Free</strong>
                      <span className="text-slate-400 text-[11px] mt-0.5 block leading-normal">Fully reusable cage grids and netting ropes.</span>
                    </div>
                  </div>
                </div>

                {/* Sponsoring dynamic conservation restoration */}
                <div className="bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 backdrop-blur-md space-y-4">
                  <h3 className="font-display font-bold text-white text-sm flex items-center gap-1.5 border-b border-cyan-500/10 pb-3">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Sponsor Shoreline Tree Planting
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    We plant indigenous trees along the Busiime lake shores for every 5 USD donated. This creates an immediate soil buffer zone to stop toxic nutrient run-off into cage breeding sites.
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center bg-slate-950 p-3.5 border border-cyan-500/10 rounded-xl">
                      <span className="text-xs text-white font-mono">Trees Count:</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSponsorTrees(prev => Math.max(1, prev - 1))}
                          className="w-7 h-7 rounded-lg bg-slate-900 border border-cyan-500/20 text-white font-bold flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-cyan-400 font-mono">{sponsorTrees}</span>
                        <button
                          onClick={() => setSponsorTrees(prev => prev + 1)}
                          className="w-7 h-7 rounded-lg bg-slate-900 border border-cyan-500/20 text-white font-bold flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">Total Contribution:</span>
                      <span className="text-white font-bold">${(sponsorTrees * 5).toFixed(2)}</span>
                    </div>

                    {sponsorSuccess ? (
                      <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4.5 h-4.5 animate-bounce" /> Shoreline Trees Funded! +{(sponsorTrees * 0.25).toFixed(2)} Eco Points
                      </div>
                    ) : (
                      <button
                        onClick={handleSponsorSustain}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl hover:opacity-95 flex justify-center items-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
                      >
                        <Droplets className="w-3.5 h-3.5 fill-current" /> Fund {sponsorTrees} Trees Restoration
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 3: OTHER SERVICES CARDS (OUTGROWER, RESEARCH, INVESTOR, CAREERS PORTALS) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Research Portal */}
        <FloatingCard className="h-full">
          <div className="bg-slate-900/60 border border-cyan-500/10 p-5 rounded-2xl flex flex-col justify-between h-full space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 p-0.5 flex items-center justify-center text-slate-950">
                <Compass className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-display font-bold text-white text-sm">Research & Water Innovation</h4>
              <p className="text-xs text-slate-400 leading-normal font-sans">
                Olayo operates a technical lab partnering with Makerere University. We run water chemistry, fingerling genetic selection, and circular nutrient research trials on Lake Victoria.
              </p>
            </div>
            <div className="border-t border-cyan-500/10 pt-3 flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-500">3 Active Papers</span>
              <a href="#download" onClick={() => alert("Olayo Technical Paper 'Cage Densities and Dissolved Oxygen Rhythms in Lake Victoria 2026' download initialized.")} className="text-cyan-300 hover:underline flex items-center gap-0.5 font-bold">
                <Download className="w-3 h-3" /> PDF Report
              </a>
            </div>
          </div>
        </FloatingCard>

        {/* Careers Portal */}
        <FloatingCard className="h-full">
          <div className="bg-slate-900/60 border border-cyan-500/10 p-5 rounded-2xl flex flex-col justify-between h-full space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 p-0.5 flex items-center justify-center text-slate-950">
                <Briefcase className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-display font-bold text-white text-sm">Careers & Attachments</h4>
              <p className="text-xs text-slate-400 leading-normal font-sans">
                Looking to build your career in premium sustainable aquaculture? Apply for graduate trainee programs, university research attachments, or local operations roles in Busiime.
              </p>
            </div>
            <div className="border-t border-cyan-500/10 pt-3 flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-500">2 Vacancies Open</span>
              <a href="#apply" onClick={() => alert("Redirecting to Olayo Recruitment Board. Apply with your CV/Resume directly.")} className="text-teal-300 hover:underline flex items-center gap-0.5 font-bold">
                Apply Now <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </FloatingCard>

        {/* Investor Relations */}
        <FloatingCard className="h-full">
          <div className="bg-slate-900/60 border border-cyan-500/10 p-5 rounded-2xl flex flex-col justify-between h-full space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 flex items-center justify-center text-slate-950">
                <Landmark className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-display font-bold text-white text-sm">Investor Relations</h4>
              <p className="text-xs text-slate-400 leading-normal font-sans">
                Olayo Fisheries Limited is expanding floating cage capacities, establishing a new feed mill in Busia, and building local cold storage facilities. View growth blueprints.
              </p>
            </div>
            <div className="border-t border-cyan-500/10 pt-3 flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-500">2026 Prospectus</span>
              <a href="#prospectus" onClick={() => alert("Downloading Olayo Fisheries 2026-2030 Commercial Expansion Blueprint Prospectus.")} className="text-amber-300 hover:underline flex items-center gap-0.5 font-bold">
                <Download className="w-3 h-3" /> Prospectus
              </a>
            </div>
          </div>
        </FloatingCard>

      </section>

      {/* SECTION 4: FLOATING AI LIVE CHAT BUTTON & MODAL (CUSTOMER SUPPORT) */}
      <div className="fixed bottom-6 left-6 z-40 pointer-events-auto">
        <button
          onClick={() => setShowSupportChat(prev => !prev)}
          className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-2xl transition-all hover:scale-105 cursor-pointer relative"
          title="Olayo Support Assistant"
        >
          <MessageSquare className="w-6 h-6 stroke-[2.5]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950 animate-ping" />
        </button>

        {/* Support Chat Box */}
        <AnimatePresence>
          {showSupportChat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="absolute bottom-16 left-0 w-[320px] h-[400px] bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between"
            >
              {/* Header */}
              <div className="bg-slate-950 px-4 py-3 border-b border-cyan-500/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-white">Olayo Support Agent</span>
                </div>
                <button 
                  onClick={() => setShowSupportChat(false)}
                  className="text-slate-400 hover:text-white font-mono text-[10px] uppercase"
                >
                  Close
                </button>
              </div>

              {/* Message scroll container */}
              <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs font-sans">
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${msg.role === 'assistant' ? 'bg-slate-950/60 text-slate-200 border border-cyan-500/5 self-start mr-auto' : 'bg-cyan-500 text-slate-950 font-semibold self-end ml-auto'}`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <div className="p-2 border-t border-cyan-500/10 bg-slate-950 flex gap-1.5">
                <input
                  type="text"
                  placeholder="Ask about Tilapia, tours, feeds..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSupportSend()}
                  className="flex-1 bg-slate-900 border border-cyan-500/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleSupportSend}
                  className="p-2 bg-cyan-500 text-slate-950 rounded-xl hover:bg-cyan-400 shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
