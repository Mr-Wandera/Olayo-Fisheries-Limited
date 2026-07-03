import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Sparkles, Fish, Droplets, BrainCircuit, ArrowRight } from 'lucide-react';

interface SplashExperienceProps {
  onComplete: () => void;
}

const SPLASH_MESSAGES = [
  'Establishing secure satellite link to Lake Victoria telemetry buoys...',
  'Initializing organic feed storage silo sensors...',
  'Calibrating sub-zero freezing facility compressors...',
  'Synchronizing blockchain supply ledger checkpoints...',
  'Verifying NEMA environmental compliance indexes...',
  'Olayo Fisheries Ecosystem Active. Launching portal...',
];

/* ============ REALISTIC SWIMMING FISH ============ */
interface FishData {
  id: number;
  y: number;
  delay: number;
  duration: number;
  scale: number;
  direction: number;
  color: string;
  depth: number;
}

function SwimmingFish({ fish }: { fish: FishData }) {
  const startX = fish.direction > 0 ? -15 : 115;
  const endX = fish.direction > 0 ? 115 : -15;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: `${fish.y}%`, zIndex: Math.floor(fish.depth) }}
      initial={{ x: `${startX}%`, opacity: 0 }}
      animate={{ x: `${endX}%`, opacity: [0, fish.depth === 0 ? 0.5 : 0.25, fish.depth === 0 ? 0.5 : 0.25, 0] }}
      transition={{ duration: fish.duration, repeat: Infinity, delay: fish.delay, ease: 'linear' }}
    >
      <motion.div
        animate={{ y: [0, -6, 0, 4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transform: fish.direction < 0 ? 'scaleX(-1)' : 'none' }}
      >
        <svg width={60 * fish.scale} height={30 * fish.scale} viewBox="0 0 60 30" fill="none">
          {/* Body with gradient */}
          <defs>
            <linearGradient id={`fishGrad-${fish.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fish.color} stopOpacity="0.8" />
              <stop offset="50%" stopColor={fish.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={fish.color} stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {/* Fish body — elongated ellipse */}
          <motion.path
            d="M5,15 C10,5 25,3 40,5 C50,6 55,10 55,15 C55,20 50,24 40,25 C25,27 10,25 5,15 Z"
            fill={`url(#fishGrad-${fish.id})`}
            stroke={fish.color}
            strokeWidth="0.5"
            strokeOpacity="0.3"
            animate={{
              d: [
                "M5,15 C10,5 25,3 40,5 C50,6 55,10 55,15 C55,20 50,24 40,25 C25,27 10,25 5,15 Z",
                "M5,15 C10,7 25,5 40,7 C50,8 55,12 55,15 C55,18 50,22 40,23 C25,25 10,23 5,15 Z",
                "M5,15 C10,5 25,3 40,5 C50,6 55,10 55,15 C55,20 50,24 40,25 C25,27 10,25 5,15 Z",
              ]
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Tail — animated wagging */}
          <motion.path
            d="M55,15 L58,8 L60,15 L58,22 Z"
            fill={fish.color}
            fillOpacity="0.3"
            stroke={fish.color}
            strokeWidth="0.3"
            strokeOpacity="0.3"
            animate={{ d: ["M55,15 L58,8 L60,15 L58,22 Z", "M55,15 L57,6 L59,15 L57,24 Z", "M55,15 L58,8 L60,15 L58,22 Z"] }}
            transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Dorsal fin */}
          <motion.path
            d="M25,5 Q30,1 35,5 L33,8 L27,8 Z"
            fill={fish.color}
            fillOpacity="0.2"
            animate={{ d: ["M25,5 Q30,1 35,5 L33,8 L27,8 Z", "M25,5 Q30,0 35,5 L33,8 L27,8 Z", "M25,5 Q30,1 35,5 L33,8 L27,8 Z"] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Eye */}
          <circle cx="14" cy="13" r="1.5" fill="rgba(255,255,255,0.6)" />
          <circle cx="14" cy="13" r="0.8" fill="rgba(0,0,0,0.8)" />
          {/* Pectoral fin */}
          <motion.path
            d="M28,16 Q32,20 35,18 L33,16 Z"
            fill={fish.color}
            fillOpacity="0.15"
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ============ UNDERWATER PLANT ============ */
function UnderwaterPlant({ x, height, delay }: { x: number; height: number; delay: number }) {
  return (
    <div className="absolute bottom-0 pointer-events-none" style={{ left: `${x}%` }}>
      <motion.svg
        width={20}
        height={height}
        viewBox={`0 0 20 ${height}`}
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
        style={{ transformOrigin: 'bottom center' }}
      >
        <path d={`M10,${height} Q8,${height * 0.6} 12,${height * 0.3} T10,0`} stroke="rgba(20,184,166,0.2)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d={`M10,${height} Q12,${height * 0.5} 8,${height * 0.2} T10,0`} stroke="rgba(20,184,166,0.15)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </motion.svg>
    </div>
  );
}

/* ============ BUBBLE ============ */
function Bubble({ x, delay, size }: { x: number; delay: number; size: number }) {
  return (
    <motion.div
      className="absolute bottom-0 pointer-events-none"
      style={{ left: `${x}%` }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: '-100vh', opacity: [0, 0.3, 0.3, 0] }}
      transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay, ease: 'linear' }}
    >
      <div
        className="rounded-full border border-cyan-300/20"
        style={{ width: size, height: size, background: 'radial-gradient(circle at 30% 30%, rgba(34,211,238,0.15), transparent)' }}
      />
    </motion.div>
  );
}

export default function SplashExperience({ onComplete }: SplashExperienceProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const totalDuration = 3200;
    const intervalTime = 40;
    const increment = 100 / (totalDuration / intervalTime);
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(100, prev + increment);
        if (next >= 100) { clearInterval(progressTimer); setIsDone(true); }
        return next;
      });
    }, intervalTime);
    const messageTimer = setInterval(() => {
      setMessageIndex(prev => Math.min(SPLASH_MESSAGES.length - 1, prev + 1));
    }, 550);
    return () => { clearInterval(progressTimer); clearInterval(messageTimer); };
  }, []);

  // Generate realistic fish with varied swimming patterns
  const fishSchool = useMemo<FishData[]>(() => {
    const colors = ['#22d3ee', '#14b8a6', '#0ea5e9', '#06b6d4', '#2dd4bf', '#67e8f9'];
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      y: 20 + Math.random() * 60,
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 10,
      scale: 0.5 + Math.random() * 0.8,
      direction: Math.random() > 0.5 ? 1 : -1,
      color: colors[i % colors.length],
      depth: Math.random() > 0.5 ? 0 : 1,
    }));
  }, []);

  const plants = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
    x: 5 + i * 18 + Math.random() * 8,
    height: 40 + Math.random() * 60,
    delay: Math.random() * 3,
  })), []);

  const bubbles = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 6,
    size: 4 + Math.random() * 10,
  })), []);

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 overflow-hidden flex flex-col justify-between p-6 sm:p-8">
      {/* Deep water background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none animate-breathe" />

      {/* Light rays from surface */}
      <div className="absolute top-0 left-0 right-0 h-full pointer-events-none overflow-hidden">
        {[20, 45, 70].map((x, i) => (
          <motion.div
            key={i}
            className="absolute top-0 w-32 h-full opacity-10"
            style={{ left: `${x}%`, transform: 'rotate(8deg)', background: 'linear-gradient(to bottom, rgba(34,211,238,0.3), transparent 60%)' }}
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 1.5 }}
          />
        ))}
      </div>

      {/* Animated water surface */}
      <svg className="absolute top-0 left-0 w-full h-24 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 20">
        <defs>
          <linearGradient id="splashSurface" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,5 Q25,2 50,5 T100,5 L100,0 L0,0 Z"
          fill="url(#splashSurface)"
          animate={{ d: ["M0,5 Q25,2 50,5 T100,5 L100,0 L0,0 Z", "M0,5 Q25,8 50,5 T100,5 L100,0 L0,0 Z", "M0,5 Q25,2 50,5 T100,5 L100,0 L0,0 Z"] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {/* Swimming fish — realistic with body undulation */}
      {fishSchool.map(f => <SwimmingFish key={f.id} fish={f} />)}

      {/* Underwater plants swaying */}
      {plants.map((p, i) => <UnderwaterPlant key={i} {...p} />)}

      {/* Rising bubbles */}
      {bubbles.map((b, i) => <Bubble key={i} {...b} />)}

      {/* Top deck */}
      <div className="flex justify-between items-center text-slate-500 text-[10px] font-mono tracking-widest z-10">
        <span>LOC: BUSIA DISTRICT · UGANDA</span>
        <span className="hidden sm:inline">SYS VERSION: 2.0.0</span>
      </div>

      {/* Centerpiece */}
      <div className="max-w-xl mx-auto text-center space-y-6 z-10 flex-grow flex flex-col justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mx-auto relative w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 p-0.5 flex items-center justify-center shadow-2xl shadow-cyan-500/30"
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl bg-cyan-400/30"
          />
          <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Waves className="w-12 h-12 text-cyan-400 stroke-[2]" />
            </motion.div>
          </div>
        </motion.div>

        <div className="space-y-2">
          <motion.h1
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display font-black text-3xl sm:text-5xl text-white tracking-widest uppercase"
          >
            OLAYO FISHERIES
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase font-black"
          >
            Cultivating Sustainably · Nourishing East Africa
          </motion.p>
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {[
            { icon: Droplets, label: 'IoT Telemetry' },
            { icon: BrainCircuit, label: 'AI Workforce' },
            { icon: Fish, label: 'Cage Aquaculture' },
          ].map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/60 border border-cyan-500/20 backdrop-blur-sm"
            >
              <f.icon className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-mono text-cyan-300">{f.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom deck: loader */}
      <div className="max-w-md mx-auto w-full space-y-4 z-10 pb-8 text-center">
        <div className="h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[10px] sm:text-xs font-mono text-cyan-400/80"
            >
              {SPLASH_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="w-full bg-slate-900 h-1.5 rounded-full border border-cyan-500/10 overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
          <motion.div
            className="absolute top-0 h-full w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ['-12px', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ left: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
          <span>SECURE LINK ESTABLISHED</span>
          <span>{Math.round(progress)}% CONNECTED</span>
        </div>

        <div className="pt-2">
          {isDone ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-display font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-cyan-400/20 border border-cyan-300/20 flex items-center gap-2 mx-auto"
            >
              Enter Operations Portal <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <button
              onClick={onComplete}
              className="text-[9px] font-mono text-slate-600 hover:text-slate-400 uppercase tracking-widest"
            >
              Skip Loading
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
