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

  // Generate floating fish particles
  const fishParticles = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 8 + Math.random() * 6,
    size: 12 + Math.random() * 8,
  })), []);

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 overflow-hidden flex flex-col justify-between p-6 sm:p-8">
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none animate-breathe" />

      {/* Animated water surface */}
      <svg className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 50">
        <defs>
          <linearGradient id="splashWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,20 Q25,15 50,20 T100,20 L100,50 L0,50 Z"
          fill="url(#splashWater)"
          animate={{ d: [
            "M0,20 Q25,15 50,20 T100,20 L100,50 L0,50 Z",
            "M0,20 Q25,25 50,20 T100,20 L100,50 L0,50 Z",
            "M0,20 Q25,15 50,20 T100,20 L100,50 L0,50 Z",
          ]}}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {/* Floating fish silhouettes */}
      {fishParticles.map(f => (
        <motion.div
          key={f.id}
          className="absolute opacity-10 text-cyan-400 pointer-events-none"
          style={{ top: `${30 + Math.random() * 40}%`, left: `${f.x}%` }}
          initial={{ x: -50 }}
          animate={{ x: typeof window !== 'undefined' ? window.innerWidth + 50 : 1000 }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: 'linear' }}
        >
          <Fish style={{ width: f.size, height: f.size }} />
        </motion.div>
      ))}

      {/* Top deck */}
      <div className="flex justify-between items-center text-slate-500 text-[10px] font-mono tracking-widest z-10">
        <span>LOC: BUSIA DISTRICT · UGANDA</span>
        <span className="hidden sm:inline">SYS VERSION: 1.0.0</span>
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
