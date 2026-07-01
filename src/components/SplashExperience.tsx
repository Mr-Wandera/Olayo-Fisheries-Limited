import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Sparkles, Navigation } from 'lucide-react';

interface SplashExperienceProps {
  onComplete: () => void;
}

const SPLASH_MESSAGES = [
  'Establishing secure satellite link to Lake Victoria telemetry buoys...',
  'Initializing organic feed storage silo sensors...',
  'Calibrating sub-zero freezing facility compressors...',
  'Synchronizing blockchain supply ledger checkpoints...',
  'Verifying NEMA environmental compliance indexes...',
  'Olayo Fisheries Ecosystem Active. Launching portal...'
];

export default function SplashExperience({ onComplete }: SplashExperienceProps) {
  const [progress, setProgress] = useState<number>(0);
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  // Tick loading bar
  useEffect(() => {
    const totalDuration = 3500; // 3.5 seconds
    const intervalTime = 50;
    const increment = (100 / (totalDuration / intervalTime));

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(100, prev + increment);
        if (next >= 100) {
          clearInterval(progressTimer);
          setIsDone(true);
        }
        return next;
      });
    }, intervalTime);

    // Rotate through status messages
    const messageTimer = setInterval(() => {
      setMessageIndex(prev => Math.min(SPLASH_MESSAGES.length - 1, prev + 1));
    }, 600);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 overflow-hidden flex flex-col justify-between p-8" id="splash-container">
      
      {/* BACKGROUND SUNRISE GLOWS & REFLECTIONS */}
      {/* Golden-orange sunrise gradient behind deep blue water layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-amber-600/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Aquatic water ripple wave background lines (CSS styled) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/10 via-transparent to-transparent pointer-events-none" />

      {/* Decorative vector birds flying */}
      <div className="absolute top-24 left-1/4 opacity-40 pointer-events-none animate-pulse">
        <svg width="40" height="15" viewBox="0 0 40 15" fill="none" className="text-amber-500/40">
          <path d="M 0 10 Q 10 0, 20 10 Q 30 0, 40 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <div className="absolute top-36 right-1/4 opacity-30 pointer-events-none animate-pulse" style={{ animationDelay: '1.2s' }}>
        <svg width="30" height="12" viewBox="0 0 30 12" fill="none" className="text-teal-500/40">
          <path d="M 0 8 Q 7.5 0, 15 8 Q 22.5 0, 30 8" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      </div>

      {/* TOP DECK */}
      <div className="flex justify-between items-center text-slate-500 text-[10px] font-mono tracking-widest z-10">
        <span>LOC: BUSIA DISTRICT • UGANDA</span>
        <span>SYS VERSION: 1.0.0 RELEASE</span>
      </div>

      {/* CENTERPIECE LOGO & ANCHOR STORY */}
      <div className="max-w-xl mx-auto text-center space-y-6 z-10 flex-grow flex flex-col justify-center">
        {/* Glowing circular waves icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mx-auto relative w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 via-teal-400 to-amber-500 p-0.5 flex items-center justify-center shadow-2xl shadow-cyan-500/10"
        >
          {/* Animated pulsing ocean wave rings */}
          <div className="absolute inset-0 rounded-3xl bg-cyan-400/20 animate-ping pointer-events-none" />
          <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
            <Waves className="w-10 h-10 text-cyan-400 animate-pulse stroke-[2]" />
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
            className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-amber-400 uppercase font-black"
          >
            Cultivating Sustainably, Nourishing East Africa
          </motion.p>
        </div>

        {/* Soft sunrise reflecting waves animation */}
        <div className="h-6 flex items-center justify-center gap-1 opacity-40">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500" />
          <span className="text-[10px] text-amber-500 font-bold font-mono">✦</span>
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500" />
        </div>
      </div>

      {/* BOTTOM DECK: LOADER PROGRESS */}
      <div className="max-w-md mx-auto w-full space-y-4 z-10 pb-8 text-center">
        
        {/* Status log message */}
        <div className="h-6">
          <AnimatePresence mode="wait">
            <motion.p 
              key={messageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[10px] sm:text-xs font-mono text-cyan-400/80 tracking-normal"
            >
              {SPLASH_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress rail */}
        <div className="w-full bg-slate-900 h-1.5 rounded-full border border-cyan-500/10 overflow-hidden relative p-[1px]">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-500 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic loading text */}
        <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
          <span>SECURE SECRETS DECRYPTED</span>
          <span>{Math.round(progress)}% CONNECTED</span>
        </div>

        {/* Seamless transition trigger button */}
        <div className="pt-2">
          {isDone ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={onComplete}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-amber-500 text-slate-950 font-display font-extrabold text-xs uppercase tracking-widest rounded-xl cursor-pointer shadow-lg shadow-cyan-400/20 border border-cyan-300/20"
            >
              Enter Olayo Operations Portal →
            </motion.button>
          ) : (
            <button
              onClick={onComplete}
              className="text-[9px] font-mono text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest cursor-pointer"
            >
              Skip Loading Sequences
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
