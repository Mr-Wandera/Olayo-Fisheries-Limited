import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Award, BarChart3, Bell, BookOpen, BrainCircuit, Calendar, 
  Check, CheckCircle2, ChevronRight, Clock, DollarSign, Download, Droplets, 
  FileSpreadsheet, FileText, Flame, Globe, Heart, HelpCircle, Info, Landmark, 
  LineChart, Lock, MapPin, RefreshCw, Send, ShieldAlert, ShieldCheck, Ship, 
  Sparkles, Star, Sun, Thermometer, Trash2, TrendingUp, UserCheck, Users, 
  Wifi, Wind 
} from 'lucide-react';
import { Product, UserProfile } from '../types';

interface CommandCenterViewProps {
  products: Product[];
  currentUser?: UserProfile;
  sustainabilityScore: number;
  onSustainbilityIncrease?: (amount: number) => void;
}

export default function CommandCenterView({
  products,
  currentUser,
  sustainabilityScore,
  onSustainbilityIncrease
}: CommandCenterViewProps) {
  // Live Clock State
  const [currentTime, setCurrentTime] = useState<string>('');
  
  // Interactive Onboarding Tour state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const onboardingSteps = [
    {
      title: 'Satellite Telemetry Grid',
      desc: 'Monitor real-time environmental metrics, live vessel positions, and weather risk factors directly streamed from Lake Victoria sensors.',
      element: 'telemetry'
    },
    {
      title: 'Biomass & Feed Silos',
      desc: 'View active biomass volume forecasts and insect-protein feed silos showing automated level sensors.',
      element: 'biomass'
    },
    {
      title: 'Cinematic Test Suite',
      desc: 'Simulate critical events like certified harvests or carbon-reduction milestones to verify active response pathways.',
      element: 'delight'
    },
    {
      title: 'Executive Report Builder',
      desc: 'Compile comprehensive daily, quarterly, or annual reports with charts, advisor insights, and official digital signatures.',
      element: 'reports'
    }
  ];

  // Live Gauge variables (Users can adjust them to trigger warning highlights!)
  const [waterTemp, setWaterTemp] = useState<number>(26.2);
  const [dissolvedOxygen, setDissolvedOxygen] = useState<number>(6.8);
  const [feedSiloLevel, setFeedSiloLevel] = useState<number>(82);

  // Delight moments states
  const [showHarvestCinema, setShowHarvestCinema] = useState<boolean>(false);
  const [showCoralMilestone, setShowCoralMilestone] = useState<boolean>(false);
  const [boatAnimationActive, setBoatAnimationActive] = useState<boolean>(false);
  const [coralsCount, setCoralsCount] = useState<number>(3);

  // Swim pool fish coordination
  const [cursorPos, setCursorPos] = useState({ x: 150, y: 100 });
  const [fishes, setFishes] = useState<Array<{ id: number; x: number; y: number; angle: number; speed: number; size: number; color: string }>>([]);

  // Report Builder State
  const [reportType, setReportType] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Annual'>('Weekly');
  const [includeRecommendations, setIncludeRecommendations] = useState<boolean>(true);
  const [includeCharts, setIncludeCharts] = useState<boolean>(true);
  const [reportNotes, setReportNotes] = useState<string>('All cage parameters match maximum bio-security requirements. Standard export supply agreements preserved.');
  const [showReportPreview, setShowReportPreview] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  // Initialize Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize interactive fish school
  useEffect(() => {
    const initialFishes = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 300,
      y: Math.random() * 200,
      angle: Math.random() * Math.PI * 2,
      speed: 1.5 + Math.random() * 1.5,
      size: 14 + Math.random() * 12,
      color: i % 2 === 0 ? 'text-cyan-400' : 'text-teal-400'
    }));
    setFishes(initialFishes);
  }, []);

  // Animate swimming fish responding to mouse movement
  useEffect(() => {
    const fishInterval = setInterval(() => {
      setFishes(prevFishes => 
        prevFishes.map(fish => {
          // Calculate distance to cursor
          const dx = cursorPos.x - fish.x;
          const dy = cursorPos.y - fish.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let targetAngle = fish.angle;
          let currentSpeed = fish.speed;

          // Repelled if mouse is close
          if (dist < 70) {
            targetAngle = Math.atan2(-dy, -dx) + (Math.random() - 0.5) * 0.5;
            currentSpeed = fish.speed * 2.2; // swim faster away!
          } else {
            // Standard schooling flock behavior
            targetAngle += (Math.random() - 0.5) * 0.25;
            currentSpeed = Math.max(fish.speed, currentSpeed * 0.95);
          }

          // Step movement
          let nextX = fish.x + Math.cos(targetAngle) * currentSpeed;
          let nextY = fish.y + Math.sin(targetAngle) * currentSpeed;

          // Bounce boundaries of the 350x220 visual aquarium card
          if (nextX < 15 || nextX > 335) {
            targetAngle = Math.PI - targetAngle;
            nextX = Math.max(15, Math.min(335, nextX));
          }
          if (nextY < 15 || nextY > 205) {
            targetAngle = -targetAngle;
            nextY = Math.max(15, Math.min(205, nextY));
          }

          return {
            ...fish,
            x: nextX,
            y: nextY,
            angle: targetAngle,
            speed: currentSpeed
          };
        })
      );
    }, 45);

    return () => clearInterval(fishInterval);
  }, [cursorPos]);

  // Handle pointer coordinate tracking
  const handleAquariumMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Trigger simulated harvest sequence
  const handleTriggerHarvest = () => {
    setShowHarvestCinema(true);
    setBoatAnimationActive(true);
    
    // Auto increment sustainability points
    if (onSustainbilityIncrease) {
      onSustainbilityIncrease(3.5);
    }
    
    // Reset boat animation after 3.5s
    setTimeout(() => {
      setBoatAnimationActive(false);
    }, 3500);
  };

  // Trigger sustainability corals growth
  const handleTriggerCoralBloom = () => {
    setShowCoralMilestone(true);
    setCoralsCount(prev => Math.min(8, prev + 1));
    if (onSustainbilityIncrease) {
      onSustainbilityIncrease(4.5);
    }
  };

  // Simulation parameters for chart points
  const weeklyBiomassData = [
    { week: 'Wk 21', projected: 31000, actual: 31200 },
    { week: 'Wk 22', projected: 31800, actual: 32100 },
    { week: 'Wk 23', projected: 32600, actual: 32900 },
    { week: 'Wk 24', projected: 33400, actual: 33800 },
    { week: 'Wk 25', projected: 34200, actual: 34500 },
    { week: 'Wk 26', projected: 35000, actual: 35400 }
  ];

  // Compile PDF Report Action
  const handleCompileReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      setShowReportPreview(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 text-left relative" id="command-center-container">
      
      {/* 1. CINEMATIC HARVEST COMPLETE VIEW (FULL SCREEN DELIGHT MOMENT) */}
      <AnimatePresence>
        {showHarvestCinema && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-400/40 rounded-3xl p-8 max-w-2xl w-full text-center shadow-2xl space-y-6 relative overflow-hidden"
            >
              {/* Decorative moving particles/glows */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-400/30 animate-bounce">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-400/20">
                  Secured Sourcing Validation Passed
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase mt-2">
                  Cinematic Harvest Sequence Complete!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
                  Cage-02 Nile Tilapia (Ngege) biomass recorded at standard sub-zero sorting thresholds. Transferred securely to sub-zero freezer vessels.
                </p>
              </div>

              {/* Statistics Panel */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/10">
                  <span className="text-[9px] text-slate-500 uppercase block">Harvest Weight</span>
                  <span className="text-sm font-bold text-white block mt-1">14,200 kg</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/10">
                  <span className="text-[9px] text-slate-500 uppercase block">Sorting Quality</span>
                  <span className="text-sm font-bold text-emerald-400 block mt-1">Grade Premium</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/10">
                  <span className="text-[9px] text-slate-500 uppercase block">Bycatch Rate</span>
                  <span className="text-sm font-bold text-white block mt-1">0.00%</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/10">
                  <span className="text-[9px] text-slate-500 uppercase block">Eco-Quota Index</span>
                  <span className="text-sm font-bold text-cyan-400 block mt-1">Sustained</span>
                </div>
              </div>

              {/* Dynamic Animated Boat Delight */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-cyan-500/5 relative overflow-hidden h-24 flex items-center justify-center">
                <div className="absolute bottom-1 left-0 right-0 h-1 bg-cyan-500/10" />
                
                {/* Boat icon gliding across */}
                <motion.div 
                  initial={{ x: -100 }} 
                  animate={{ x: 260 }}
                  transition={{ duration: 3.5, ease: "linear", repeat: Infinity }}
                  className="flex flex-col items-center absolute"
                >
                  <Ship className="w-8 h-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                  <span className="text-[8px] font-mono text-cyan-400 mt-1">MV Olayo-01</span>
                </motion.div>
                
                <span className="text-[10px] text-slate-500 font-sans italic pt-12">
                  Delivering harvest batch to Busia Sorting Cold Station...
                </span>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowHarvestCinema(false)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 text-xs font-bold hover:opacity-95 shadow-lg cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CORAL MILESTONE COMPLIANCE DELIGHT OVERLAY */}
      <AnimatePresence>
        {showCoralMilestone && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="bg-gradient-to-b from-slate-900 to-slate-950 border border-teal-400/40 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-5"
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-teal-500/15 text-teal-400 flex items-center justify-center border border-teal-400/30">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Biodegradable Milestone Achieved</span>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                  Marine Coral Growth Expanded!
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Your organic, chemical-free, and single-use plastic reduction initiatives have triggered healthy bio-reef restorations in Lake Victoria.
                </p>
              </div>

              {/* Graphical Growing Corals Visual */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-teal-500/15 h-36 flex items-end justify-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/10 to-transparent pointer-events-none" />
                
                {/* Simulated aquatic flora/corals */}
                {Array.from({ length: coralsCount }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: [0, 40 + idx * 12] }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="w-4 rounded-t-full bg-gradient-to-t from-teal-600 via-cyan-500 to-emerald-400 flex items-center justify-center relative shadow-lg shadow-teal-500/20"
                    title="Healthy Living Coral Stem"
                  >
                    <span className="text-[8px] text-slate-950 font-bold font-mono">✦</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCoralMilestone(false)}
                  className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Inspect Extended Quotas
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. EXECUTIVE REPORT BUILDER MODAL PREVIEW */}
      <AnimatePresence>
        {showReportPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 relative print:p-0 my-8"
              id="printable-executive-report"
            >
              {/* Close Button on Web Preview */}
              <button 
                onClick={() => setShowReportPreview(false)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer print:hidden shadow-inner"
                title="Dismiss preview"
              >
                ✕
              </button>

              {/* Report Header Block with Branding */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-900 pb-5 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-lg text-slate-900 uppercase tracking-tight">Olayo Fisheries Limited</span>
                    <span className="text-[9px] font-mono bg-slate-900 text-white px-2 py-0.5 rounded uppercase">Official Copy</span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans">Kampala HQ • Busia District Aquaculture Landing Hub • Lake Victoria</p>
                </div>
                <div className="text-right font-mono text-[10px] text-slate-600 sm:border-l sm:pl-4 border-slate-200">
                  <div>Ref ID: <strong>OLAYO-REP-{Math.floor(1000 + Math.random()*9000)}</strong></div>
                  <div>Generated: <strong>{new Date().toLocaleDateString()}</strong></div>
                  <div>Access Level: <strong>EXECUTIVE LEVEL</strong></div>
                </div>
              </div>

              {/* Title Section */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Consolidated Executive Status Summary</span>
                <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight uppercase">
                  {reportType} Aquaculture & Supply Chain Audit
                </h2>
                <div className="h-1 w-20 bg-teal-500 rounded" />
              </div>

              {/* Executive Summary Narrative */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-display font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-teal-600 fill-teal-600" />
                  I. Executive Digest & Sustainability Summary
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  This dossier certifies operational parameters for Olayo Fisheries' Nile Tilapia nursery grids and cold transport fleets. Current biomass indexes report optimal weight trajectories. Under strict regulatory quotas aligned with Lake Victoria environmental mandates, our carbon footprint has been sustained at <strong>1.12 kg CO₂/kg</strong>, successfully utilizing zero single-use plastics across our sorting lanes.
                </p>
              </div>

              {/* Statistics grid for printing */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left">
                  <span className="text-[9px] text-slate-500 font-mono uppercase">Platform Revenue</span>
                  <div className="text-base font-bold text-slate-900 font-mono mt-0.5">$128,500.00</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left">
                  <span className="text-[9px] text-slate-500 font-mono uppercase">Ecosystem Health</span>
                  <div className="text-base font-bold text-slate-900 font-mono mt-0.5">94.5% Compliant</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left">
                  <span className="text-[9px] text-slate-500 font-mono uppercase">FCR Index</span>
                  <div className="text-base font-bold text-teal-600 font-mono mt-0.5">1.37 Optimal</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left">
                  <span className="text-[9px] text-slate-500 font-mono uppercase">Biosecurity Score</span>
                  <div className="text-base font-bold text-slate-900 font-mono mt-0.5">100% Secure</div>
                </div>
              </div>

              {/* Charts section (if checked) */}
              {includeCharts && (
                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <h4 className="font-display font-bold text-xs text-slate-900">II. Biomass Volume Yield Trend Curve</h4>
                  
                  {/* Styled Minimal Print Chart representation */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-mono text-slate-500">Nile Tilapia Biomass Growth Curve (kg)</span>
                      <div className="flex gap-3 text-[9px] font-mono text-slate-500">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-300 rounded-full" /> Projected Target</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-teal-600 rounded-full" /> Actual Biomass</span>
                      </div>
                    </div>
                    
                    {/* SVG Curve for PDF print precision */}
                    <svg viewBox="0 0 500 120" className="w-full h-24 overflow-visible">
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
                      
                      {/* Grid Lines */}
                      <line x1="100" y1="10" x2="100" y2="100" stroke="#f1f5f9" />
                      <line x1="200" y1="10" x2="200" y2="100" stroke="#f1f5f9" />
                      <line x1="300" y1="10" x2="300" y2="100" stroke="#f1f5f9" />
                      <line x1="400" y1="10" x2="400" y2="100" stroke="#f1f5f9" />

                      {/* Projected path */}
                      <path 
                        d="M 20 95 L 100 85 L 180 75 L 260 65 L 340 55 L 420 45 L 480 35" 
                        fill="none" 
                        stroke="#94a3b8" 
                        strokeWidth="2" 
                        strokeDasharray="4,4"
                      />

                      {/* Actual path */}
                      <path 
                        d="M 20 93 L 100 82 L 180 71 L 260 59 L 340 48 L 420 37 L 480 23" 
                        fill="none" 
                        stroke="#0d9488" 
                        strokeWidth="3.5" 
                      />

                      {/* Labels */}
                      <text x="20" y="115" fontSize="8" fontFamily="monospace" fill="#64748b">Week 21</text>
                      <text x="180" y="115" fontSize="8" fontFamily="monospace" fill="#64748b">Week 23</text>
                      <text x="340" y="115" fontSize="8" fontFamily="monospace" fill="#64748b">Week 25</text>
                      <text x="480" y="115" fontSize="8" fontFamily="monospace" fill="#64748b" textAnchor="end">Week 26</text>
                    </svg>
                  </div>
                </div>
              )}

              {/* Recommendations section (if checked) */}
              {includeRecommendations && (
                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <h4 className="font-display font-bold text-xs text-slate-900">III. AI Intelligence & Operational Directive Notes</h4>
                  <p className="text-xs text-slate-600 font-sans italic leading-relaxed">
                    "{reportNotes}"
                  </p>
                </div>
              )}

              {/* Signatures & Approvals */}
              <div className="flex justify-between items-end border-t border-slate-200 pt-8 mt-6">
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase">Compiled By</div>
                  <div className="font-display font-bold text-xs text-slate-900 mt-1">{currentUser?.name || 'Dr. Abdul Wandera'}</div>
                  <div className="text-[10px] text-slate-400 font-sans">{currentUser?.role || 'Founder & CEO'}</div>
                </div>

                <div className="text-center">
                  {/* Simulated Corporate Stamp */}
                  <div className="border-2 border-dashed border-teal-600 rounded-full w-20 h-20 flex flex-col items-center justify-center text-teal-600 shrink-0 transform rotate-6">
                    <span className="text-[7px] font-mono font-bold uppercase tracking-tight">Olayo Fish</span>
                    <span className="text-[9px] font-display font-black uppercase">APPROVED</span>
                    <span className="text-[6px] font-mono tracking-tighter">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[9px] font-mono text-slate-500 uppercase">Authorized Security Key</div>
                  <div className="font-mono text-xs text-slate-900 font-bold mt-1">SHA256://8F9B7A...</div>
                  <div className="text-[10px] text-slate-400 font-sans">NEMA Regulatory Stamp Valid</div>
                </div>
              </div>

              {/* Print Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 print:hidden">
                <button
                  onClick={() => setShowReportPreview(false)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all"
                >
                  Cancel Preview
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/20"
                >
                  <Download className="w-4 h-4" /> Trigger Browser Print (PDF)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MAIN TELEMETRY WALL SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-slate-900/60 border border-cyan-500/15 rounded-3xl p-6 backdrop-blur-md shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-ping" />
            <h1 className="font-display text-lg sm:text-2xl font-black text-white tracking-wider uppercase">
              OLAYO COMMAND CENTER
            </h1>
            <span className="text-[9px] font-mono font-extrabold uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full tracking-widest animate-pulse">
              ● LIVE SECURE FEED
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans max-w-xl">
            Flagship executive wall-projection layout. Standardizing telemetry updates, certified biomass yields, sub-zero logistics, and bio-security protocols across Lake Victoria.
          </p>
        </div>

        {/* Live Clock Display */}
        <div className="bg-slate-950/80 px-4 py-2 rounded-2xl border border-cyan-500/10 flex flex-col items-end shrink-0">
          <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400 animate-spin" /> UTC TIME SIGNAL
          </span>
          <span className="font-mono text-sm sm:text-base text-white font-extrabold tracking-tight mt-1">
            {currentTime || 'Synchronizing...'}
          </span>
        </div>
      </div>

      {/* 5. FIRST-TIME ONBOARDING TOUR BAR */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-950 border border-cyan-400/20 p-5 rounded-3xl text-left relative overflow-hidden"
          >
            {/* Banner top line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500" />
            
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px] font-bold uppercase">
                  <Star className="w-3.5 h-3.5 fill-current" /> Interactive Command Center Tutorial
                </div>
                <h4 className="font-display font-bold text-white text-sm sm:text-base">
                  Tour: {onboardingSteps[onboardingStep].title} ({onboardingStep + 1} of {onboardingSteps.length})
                </h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {onboardingSteps[onboardingStep].desc}
                </p>
              </div>

              <button 
                onClick={() => setShowOnboarding(false)}
                className="text-slate-500 hover:text-white font-mono font-bold text-xs cursor-pointer p-1"
                title="Dismiss Walkthrough Guide"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-cyan-500/5">
              <div className="flex gap-1">
                {onboardingSteps.map((_, i) => (
                  <span 
                    key={i}
                    onClick={() => setOnboardingStep(i)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${onboardingStep === i ? 'bg-cyan-400 px-2' : 'bg-slate-800 hover:bg-slate-700'}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {onboardingStep > 0 && (
                  <button
                    onClick={() => setOnboardingStep(prev => prev - 1)}
                    className="px-3 py-1.5 bg-slate-900 border border-cyan-500/10 hover:bg-slate-800 text-slate-300 text-[10px] rounded-lg font-mono font-bold transition-all cursor-pointer"
                  >
                    Previous
                  </button>
                )}
                
                {onboardingStep < onboardingSteps.length - 1 ? (
                  <button
                    onClick={() => setOnboardingStep(prev => prev + 1)}
                    className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] rounded-lg font-mono font-bold transition-all cursor-pointer"
                  >
                    Next Guide Step
                  </button>
                ) : (
                  <button
                    onClick={() => setShowOnboarding(false)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] rounded-lg font-mono font-extrabold transition-all cursor-pointer"
                  >
                    Complete Walkthrough!
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. ADVANCED TELEMETRY BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Financial Health */}
        <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl hover:border-cyan-500/20 hover:scale-[1.02] transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-cyan-400/60 uppercase">Consolidated Revenue</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-white mt-4">$128,500 <span className="text-[10px] text-emerald-400 font-mono font-bold">▲ +12%</span></div>
          <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-2 border-t border-cyan-500/5 pt-2">
            Domestic wholesales total <strong>$68.5k</strong>. Global seafood export delivery value totals <strong>$60k</strong>.
          </p>
        </div>

        {/* Metric 2: Live Nile Tilapia Biomass */}
        <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl hover:border-cyan-500/20 hover:scale-[1.02] transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-teal-400/60 uppercase">Nile Tilapia Biomass</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-teal-400 mt-4">35,400 kg <span className="text-[10px] text-slate-500 font-mono">stocked</span></div>
          <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-2 border-t border-cyan-500/5 pt-2">
            Average Nile Tilapia weight is <strong>540g</strong>. Harvest projection models indicate standard market sizes next week.
          </p>
        </div>

        {/* Metric 3: Cold Chain Storage Status */}
        <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl hover:border-cyan-500/20 hover:scale-[1.02] transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-blue-400/60 uppercase">Freezer Logistics</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-white mt-4">-18.2 °C <span className="text-[10px] text-emerald-400 font-mono font-bold">● SECURE</span></div>
          <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-2 border-t border-cyan-500/5 pt-2">
            Busia district cold holding tanks validated. Sub-zero compressors operational.
          </p>
        </div>

        {/* Metric 4: Academic Course Engagement */}
        <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl hover:border-cyan-500/20 hover:scale-[1.02] transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-emerald-400/60 uppercase">Academy Index</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-emerald-400 mt-4">85% Certified <span className="text-[10px] text-slate-500 font-mono">participation</span></div>
          <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-2 border-t border-cyan-500/5 pt-2">
            8 wardens fully certified in marine gear conservation and bio-security protocols.
          </p>
        </div>
      </div>

      {/* 7. VISUAL DELIGHT, SILOS, AND GRIDS (SPLIT CONTAINER) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ACTIVE FEED SILOS & ADJUSTABLE GAUGE CONTROLS */}
        <div className="bg-slate-900/60 border border-cyan-500/15 rounded-3xl p-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/10 pb-2.5">
              <Flame className="w-4.5 h-4.5 text-cyan-400" />
              Feed Silos & Dynamic Telemetry
            </h3>

            {/* Storage Silo Visualization */}
            <div className="space-y-3 font-mono text-[11px]">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Main Protein Silo S-01 (insect meal)</span>
                  <span className="text-white font-bold">{feedSiloLevel}% capacity</span>
                </div>
                {/* Horizontal storage gauge */}
                <div className="w-full bg-slate-950 h-5 rounded-xl border border-cyan-500/15 overflow-hidden flex items-center relative p-1">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-600 to-teal-500 rounded-lg transition-all duration-300" 
                    style={{ width: `${feedSiloLevel}%` }}
                  />
                  <span className="absolute left-3 text-[9px] text-cyan-100 font-bold mix-blend-difference uppercase">
                    {(feedSiloLevel * 50).toLocaleString()} kg of 5,000 kg Remaining
                  </span>
                </div>
              </div>

              {/* Adjustable telemetry slider to test system triggers */}
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-cyan-500/5 space-y-2.5 mt-4">
                <span className="text-[10px] text-slate-400 uppercase block font-mono">Calibrate Silo Sensors</span>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">Slide Level</span>
                  <input 
                    type="range" 
                    min="15" 
                    max="100" 
                    value={feedSiloLevel}
                    onChange={(e) => {
                      const level = parseInt(e.target.value);
                      setFeedSiloLevel(level);
                    }}
                    className="w-1/2 accent-cyan-400 bg-slate-900 cursor-pointer h-1.5 rounded"
                  />
                  <span className={`font-bold ${feedSiloLevel < 25 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                    {feedSiloLevel}%
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic adjustable gauges */}
            <div className="space-y-3 border-t border-cyan-500/5 pt-4">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Water Quality Diagnostic Dials</span>
              
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                {/* Dissolved Oxygen */}
                <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/10 flex flex-col justify-between">
                  <span className="text-[8px] text-slate-500 uppercase">Oxygen DO</span>
                  <span className="text-sm font-bold text-white mt-1">{dissolvedOxygen} mg/L</span>
                  <input 
                    type="range" 
                    min="3.5" 
                    max="10" 
                    step="0.1"
                    value={dissolvedOxygen}
                    onChange={(e) => setDissolvedOxygen(parseFloat(e.target.value))}
                    className="accent-teal-400 mt-2 cursor-pointer h-1 rounded bg-slate-900"
                  />
                  <span className={`text-[8px] mt-1 ${dissolvedOxygen < 5.0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                    {dissolvedOxygen < 5.0 ? '⚡ LOW LIMIT' : '✓ OPTIMAL'}
                  </span>
                </div>

                {/* Water Temp */}
                <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/10 flex flex-col justify-between">
                  <span className="text-[8px] text-slate-500 uppercase">Lake Temp</span>
                  <span className="text-sm font-bold text-white mt-1">{waterTemp} °C</span>
                  <input 
                    type="range" 
                    min="20" 
                    max="32" 
                    step="0.1"
                    value={waterTemp}
                    onChange={(e) => setWaterTemp(parseFloat(e.target.value))}
                    className="accent-cyan-400 mt-2 cursor-pointer h-1 rounded bg-slate-900"
                  />
                  <span className={`text-[8px] mt-1 ${waterTemp > 29.5 || waterTemp < 23.5 ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}`}>
                    {waterTemp > 29.5 || waterTemp < 23.5 ? '⚡ ELEVATED' : '✓ THERMAL STANDARD'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-sans leading-relaxed italic border-t border-cyan-500/5 pt-3">
            💡 Adjusting these sliders updates the operational early warning signals to test diagnostic alert triggers.
          </p>
        </div>

        {/* MIDDLE COLUMN: INTERACTIVE SWIMMING AQUARIUM FISH DELIGHT (MICRO-INTERACTION) */}
        <div className="bg-slate-900/60 border border-cyan-500/15 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2.5">
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4.5 h-4.5 text-cyan-400 animate-bounce" />
                Cage Bio-Telemetry Simulator
              </h3>
              <span className="text-[8px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                Schooling Fish Pool
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-normal mt-2">
              Move your pointer across the blue aqua pool below to see Nile Tilapia virtual models respond in real-time, swimming dynamically to avoid blockages.
            </p>
          </div>

          {/* School of Fish responsive canvas container */}
          <div 
            className="bg-slate-950/90 rounded-2xl border border-cyan-500/20 h-48 relative overflow-hidden cursor-crosshair shadow-inner"
            onMouseMove={handleAquariumMouseMove}
            title="Schooling Fish Pool - Move pointer inside to scatter fish!"
          >
            {/* Water dynamic background color overlay based on sustainability */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 to-teal-950/20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500/5 font-mono text-[70px] select-none font-bold">
              OLAYO
            </div>

            {/* Coordinates feedback */}
            <div className="absolute bottom-2 left-2 text-[8px] font-mono text-slate-500">
              Pointer: X:{cursorPos.x.toFixed(0)}, Y:{cursorPos.y.toFixed(0)}
            </div>

            {/* Individual responsive swimming fish */}
            {fishes.map(fish => {
              // Convert rotation angle from radians to degrees
              const rotationDeg = (fish.angle * 180) / Math.PI;
              return (
                <div
                  key={fish.id}
                  className="absolute transition-transform duration-75 pointer-events-none"
                  style={{
                    left: `${fish.x}px`,
                    top: `${fish.y}px`,
                    transform: `translate(-50%, -50%) rotate(${rotationDeg}deg)`
                  }}
                >
                  {/* Styled Fish representation */}
                  <svg 
                    width={fish.size} 
                    height={fish.size / 2} 
                    viewBox="0 0 40 20" 
                    className={`${fish.color} fill-current filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}
                  >
                    {/* Fish body */}
                    <path d="M 0 10 C 10 0, 30 0, 40 10 C 30 20, 10 20, 0 10 Z" />
                    {/* Tail fin */}
                    <path d="M 0 10 L -6 4 L -6 16 Z" />
                    {/* Fin lines */}
                    <path d="M 20 8 L 16 12" stroke="#111827" strokeWidth="1" />
                    {/* Small organic eye dot */}
                    <circle cx="32" cy="9" r="1.5" fill="#111827" />
                  </svg>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center">
            School count: 8 fish • Mode: Schooling • Range: Lake Victoria Grid
          </div>
        </div>

        {/* RIGHT COLUMN: EVENT TRIGGER PANEL (PERFORMANCE TESTS & STABILITY) */}
        <div className="bg-slate-900/60 border border-cyan-500/15 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/10 pb-2.5">
              <Sparkles className="w-4.5 h-4.5 text-cyan-400" />
              Platform Delight triggers
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              Aquacultural compliance involves rigorous ecological audits. Use these simulated triggers to test live milestone animations across the corporate framework.
            </p>

            <div className="space-y-2.5">
              {/* Trigger 1: Record Certified Harvest */}
              <button
                onClick={handleTriggerHarvest}
                className="w-full p-3 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/25 rounded-2xl hover:border-cyan-400 transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <div className="p-2 bg-cyan-500/15 rounded-xl text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shrink-0">
                  <Ship className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-xs">Simulate Certified Harvest</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Launches full cinematic "Harvest Complete" achievement panel with GPS boat cargo logs.</p>
                </div>
              </button>

              {/* Trigger 2: Sustainability coral bloom */}
              <button
                onClick={handleTriggerCoralBloom}
                className="w-full p-3 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/25 rounded-2xl hover:border-teal-400 transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <div className="p-2 bg-teal-500/15 rounded-xl text-teal-300 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-xs">Trigger Sustainability Goal</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Expands micro-reef flora growth and logs premium environmental quota bonuses.</p>
                </div>
              </button>
            </div>
          </div>

          <div className="text-[10px] font-sans text-slate-500 text-center italic">
            🔒 Fully sandboxed triggers. Action logs are archived locally.
          </div>
        </div>

      </div>

      {/* 8. REPORT BUILDER INTEGRATION & ADVISORY PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* REPORT BUILDER ENGINE */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-cyan-500/15 rounded-3xl p-5 space-y-4 text-left">
          <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
            <div>
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-cyan-400" />
                Executive Report Builder & PDF Compiler
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Generate, edit, and export custom operational dossiers for NEMA regulators and Hilton Seafood contract managers.
              </p>
            </div>
          </div>

          <form onSubmit={handleCompileReport} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">Report Duration</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Daily', 'Weekly', 'Monthly', 'Annual'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setReportType(type)}
                      className={`py-1.5 rounded-lg font-mono text-[9px] font-bold border transition-all cursor-pointer ${reportType === type ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow' : 'bg-slate-950 border-cyan-500/10 text-slate-400 hover:text-white'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle configurations */}
              <div className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-cyan-500/5">
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Widget Toggles</span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Include Advisor Recommendations</span>
                  <input 
                    type="checkbox" 
                    checked={includeRecommendations} 
                    onChange={(e) => setIncludeRecommendations(e.target.checked)} 
                    className="accent-cyan-400 w-4 h-4 cursor-pointer" 
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-slate-300">Include Biomass Yield Curve Charts</span>
                  <input 
                    type="checkbox" 
                    checked={includeCharts} 
                    onChange={(e) => setIncludeCharts(e.target.checked)} 
                    className="accent-cyan-400 w-4 h-4 cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">Custom Intelligence Notes</label>
                <textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Record custom operational insights or specific bio-metric observations..."
                  rows={3}
                  className="w-full bg-slate-950 border border-cyan-500/15 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingReport}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl hover:opacity-95 shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                {isGeneratingReport ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Compiling Dossier...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4" />
                    Compile Report & Preview
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ADVISORY INTELLIGENCE COLUMN (TRANSFORMING DASHBOARDS INTO ADVISORS) */}
        <div className="bg-slate-900/60 border border-cyan-500/15 rounded-3xl p-5 space-y-4 text-left">
          <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/10 pb-2.5">
            <BrainCircuit className="w-4.5 h-4.5 text-cyan-400" />
            AI Operations Advisor
          </h3>

          <div className="space-y-3">
            {/* Advice Item 1 */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/5 hover:border-cyan-500/15 transition-all text-xs font-sans space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-cyan-300">
                <span>⚡ BIO-CONVERSION INDEX</span>
                <span className="bg-cyan-500/10 text-[8px] font-bold px-1.5 py-0.5 rounded">High efficiency</span>
              </div>
              <p className="text-slate-300 leading-normal">
                Feed efficiency is <strong>8% higher</strong> compared to historical baseline. Organic black soldier fly insect crumbles provide optimal protein absorption inside floating cages.
              </p>
            </div>

            {/* Advice Item 2 */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/5 hover:border-cyan-500/15 transition-all text-xs font-sans space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-teal-300">
                <span>⚡ HARVEST PROJECTION</span>
                <span className="bg-teal-500/10 text-[8px] font-bold px-1.5 py-0.5 rounded">6 days remaining</span>
              </div>
              <p className="text-slate-300 leading-normal">
                Cage-02 Nile Tilapia will likely hit targeted whole wholesale harvest size in six days. Landing crews are scheduled for immediate dispatch.
              </p>
            </div>

            {/* Advice Item 3 */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/5 hover:border-cyan-500/15 transition-all text-xs font-sans space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-orange-300">
                <span>⚡ METEOROLOGICAL ALERT</span>
                <span className="bg-orange-500/10 text-[8px] font-bold px-1.5 py-0.5 rounded">Ideal conditions</span>
              </div>
              <p className="text-slate-300 leading-normal">
                Weather patterns tomorrow indicate low wind levels (7 knots) and stable 0.3m wave heights. Optimal window for physical bio-telemetry repair works.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
