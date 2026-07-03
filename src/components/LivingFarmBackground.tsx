import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FarmStatus } from '../types';

interface LivingFarmBackgroundProps {
  farmStatus: FarmStatus | null;
  sustainabilityScore: number;
}

/**
 * LivingFarmBackground — the entire application floats on top of a living
 * digital twin of Olayo Fisheries' Busiime cage grid on Lake Victoria.
 *
 * Layers (back to front):
 *   1. Sky gradient (time-of-day adaptive)
 *   2. Sun / moon glow
 *   3. Clouds (wind-affected)
 *   4. Stars (night only)
 *   5. Distant shoreline hills
 *   6. Lake water (animated SVG waves + shimmer)
 *   7. Fish shadows beneath cages (scatter on cursor proximity)
 *   8. Floating cage grid (buoyancy)
 *   9. Boats with wakes
 *   10. Dock + onshore infrastructure
 *   11. Workers, trucks, birds
 *   12. Weather overlay (rain, lightning)
 *   13. Ambient light wash (golden hour, etc.)
 *   14. Cursor ripples on water
 *   15. Floating leaves, morning mist, moonlight shimmer
 */
export default function LivingFarmBackground({ farmStatus, sustainabilityScore }: LivingFarmBackgroundProps) {
  const weather = farmStatus?.weather || 'clear';
  const timeOfDay = farmStatus?.timeOfDay || 'midday';
  const windKnots = farmStatus?.windKnots || 6;
  const boatsActive = farmStatus?.boatsActive || 0;

  const isNight = timeOfDay === 'night' || timeOfDay === 'midnight';
  const isStorm = weather === 'storm';
  const isRain = weather === 'rain' || isStorm;
  const isGolden = timeOfDay === 'golden' || timeOfDay === 'sunset';
  const isMorning = timeOfDay === 'morning';

  // Sky palette per time of day
  const sky = useMemo(() => {
    if (isStorm) return { top: '#0a0f1a', mid: '#0f1a2e', bot: '#0a1420' };
    if (isNight) return { top: '#010308', mid: '#020815', bot: '#020617' };
    if (isGolden) return { top: '#0d1e3a', mid: '#1a2d52', bot: '#0a1929' };
    if (isMorning) return { top: '#042444', mid: '#073663', bot: '#02182c' };
    return { top: '#022144', mid: '#03448a', bot: '#01162d' };
  }, [isStorm, isNight, isGolden, isMorning]);

  const stars = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 30,
    size: Math.random() * 1.5 + 0.5, delay: Math.random() * 3,
  })), []);

  const clouds = useMemo(() => Array.from({ length: isStorm ? 6 : 4 }).map((_, i) => ({
    id: i, x: Math.random() * 100, y: 5 + Math.random() * 15,
    w: 120 + Math.random() * 180, delay: Math.random() * 10,
    dur: 60 + Math.random() * 40,
  })), [isStorm]);

  const raindrops = useMemo(() => Array.from({ length: isStorm ? 60 : 30 }).map((_, i) => ({
    id: i, x: Math.random() * 100, delay: Math.random() * 1.5, dur: 0.5 + Math.random() * 0.4,
  })), [isStorm]);

  const fishShadows = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
    id: i, y: 55 + Math.random() * 30, delay: Math.random() * 10,
    dur: 15 + Math.random() * 10, size: 8 + Math.random() * 6,
  })), []);

  const birds = useMemo(() => Array.from({ length: weather === 'clear' && !isNight ? 5 : 0 }).map((_, i) => ({
    id: i, y: 8 + Math.random() * 12, delay: Math.random() * 8,
    dur: 20 + Math.random() * 15,
  })), [weather, isNight]);

  const workers = useMemo(() => Array.from({ length: 3 }).map((_, i) => ({
    id: i, x: 15 + i * 12, delay: i * 3, dur: 8 + i * 2,
  })), []);

  // Floating leaves
  const leaves = useMemo(() => Array.from({ length: 4 }).map((_, i) => ({
    id: i, x: Math.random() * 100, delay: Math.random() * 15,
    dur: 20 + Math.random() * 15, size: 6 + Math.random() * 6,
  })), []);

  // Lightning flash state
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!isStorm) return;
    const t = setInterval(() => {
      if (Math.random() > 0.5) {
        setFlash(true);
        setTimeout(() => setFlash(false), 80);
        setTimeout(() => { setFlash(true); setTimeout(() => setFlash(false), 120); }, 150);
      }
    }, 6000);
    return () => clearInterval(t);
  }, [isStorm]);

  // Cursor ripple on water
  const [waterRipples, setWaterRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleIdRef = useRef(0);
  const lastRippleTime = useRef(0);

  const handleWaterHover = useCallback((e: React.MouseEvent) => {
    const now = performance.now();
    if (now - lastRippleTime.current < 200) return;
    lastRippleTime.current = now;
    const id = rippleIdRef.current++;
    setWaterRipples(prev => [...prev.slice(-5), { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setWaterRipples(prev => prev.filter(r => r.id !== id)), 1500);
  }, []);

  // Fish scatter state — when cursor is near, fish swim faster
  const [fishScatter, setFishScatter] = useState(false);
  const scatterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFishProximity = useCallback((e: React.MouseEvent) => {
    setFishScatter(true);
    if (scatterTimeoutRef.current) clearTimeout(scatterTimeoutRef.current);
    scatterTimeoutRef.current = setTimeout(() => setFishScatter(false), 800);
  }, []);

  // Cage positions on the lake
  const cages = farmStatus?.cages || [];
  const cagePositions = [
    { x: 25, y: 45 }, { x: 38, y: 58 }, { x: 32, y: 72 },
    { x: 55, y: 48 }, { x: 67, y: 62 }, { x: 50, y: 78 },
  ];

  return (
    <div
      className="fixed inset-0 -z-50 overflow-hidden bg-slate-950"
      onMouseMove={(e) => {
        handleWaterHover(e);
        handleFishProximity(e);
      }}
    >
      {/* 1. Sky gradient */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: `linear-gradient(to bottom, ${sky.top} 0%, ${sky.mid} 40%, ${sky.bot} 100%)` }}
      />

      {/* 2. Sun / moon glow */}
      {!isStorm && (
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            top: '5%', right: '15%',
            width: 200, height: 200,
            background: isNight ? 'rgba(129,140,248,0.15)' : isGolden ? 'rgba(251,191,36,0.25)' : isMorning ? 'rgba(251,191,36,0.2)' : 'rgba(34,211,238,0.15)',
          }}
        />
      )}

      {/* 3. Stars */}
      {isNight && (
        <>
          {stars.map(s => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 2 + s.delay, repeat: Infinity, delay: s.delay }}
            />
          ))}
        </>
      )}

      {/* 3b. Clouds */}
      {clouds.map(c => (
        <motion.div
          key={c.id}
          className="absolute pointer-events-none"
          style={{ top: `${c.y}%`, width: c.w, height: c.w * 0.35 }}
          initial={{ x: '-20vw' }}
          animate={{ x: '120vw' }}
          transition={{ duration: c.dur, repeat: Infinity, delay: c.delay, ease: 'linear' }}
        >
          <div className="w-full h-full rounded-full opacity-10"
            style={{ background: isStorm ? 'rgba(100,116,139,0.6)' : 'rgba(255,255,255,0.4)', filter: 'blur(20px)' }} />
        </motion.div>
      ))}

      {/* 4. Distant shoreline */}
      <svg className="absolute bottom-[40%] left-0 w-full h-[12%] pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 12">
        <path d="M0,12 L0,6 Q15,3 30,7 Q50,2 70,6 Q85,4 100,7 L100,12 Z"
          fill={isNight ? '#020617' : isGolden ? '#0d1e3a' : '#042444'} opacity="0.6" />
        <path d="M0,12 L0,9 Q20,7 40,10 Q60,6 80,9 Q90,8 100,10 L100,12 Z"
          fill={isNight ? '#010308' : '#02182c'} opacity="0.8" />
      </svg>

      {/* 5. Lake water — animated SVG waves */}
      <div className="absolute bottom-0 left-0 w-full h-[45%] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="lakeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isNight ? '#082f49' : isStorm ? '#0c4a6e' : isGolden ? '#0c4a6e' : '#0e7490'} stopOpacity="0.5" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
            </linearGradient>
            <pattern id="lakeRipples" x="0" y="0" width="20" height="6" patternUnits="userSpaceOnUse">
              <path d="M0,3 Q5,0 10,3 T20,3" stroke="rgba(34,211,238,0.08)" fill="none" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#lakeGrad)" />
          <rect width="100" height="100" fill="url(#lakeRipples)" />
          {/* Animated wave layers */}
          {[0, 1, 2].map(layer => (
            <motion.path
              key={layer}
              d={`M0,${20 + layer * 8} Q25,${18 + layer * 8} 50,${20 + layer * 8} T100,${20 + layer * 8} L100,100 L0,100 Z`}
              fill={`rgba(34,211,238,${0.03 - layer * 0.008})`}
              animate={{ d: [
                `M0,${20 + layer * 8} Q25,${18 + layer * 8} 50,${20 + layer * 8} T100,${20 + layer * 8} L100,100 L0,100 Z`,
                `M0,${20 + layer * 8} Q25,${22 + layer * 8} 50,${20 + layer * 8} T100,${20 + layer * 8} L100,100 L0,100 Z`,
                `M0,${20 + layer * 8} Q25,${18 + layer * 8} 50,${20 + layer * 8} T100,${20 + layer * 8} L100,100 L0,100 Z`,
              ]}}
              transition={{ duration: 6 + layer * 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          {/* Sun/moon reflection on water */}
          {!isStorm && (
            <motion.ellipse
              cx="78" cy="30" rx="8" ry="2"
              fill={isNight ? 'rgba(129,140,248,0.15)' : isGolden ? 'rgba(251,191,36,0.2)' : 'rgba(34,211,238,0.12)'}
              animate={{ opacity: [0.3, 0.6, 0.3], rx: [6, 10, 6] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          )}
        </svg>

        {/* Shimmer particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-200/30 pointer-events-none"
            style={{ top: `${20 + Math.random() * 70}%` }}
            initial={{ x: '-5%', opacity: 0 }}
            animate={{ x: '105%', opacity: [0, 0.4, 0] }}
            transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: i * 0.5, ease: 'linear' }}
          />
        ))}

        {/* Fish shadows beneath cages — scatter on cursor proximity */}
        {fishShadows.map(f => (
          <motion.div
            key={f.id}
            className="absolute pointer-events-none"
            style={{ top: `${f.y}%` }}
            initial={{ x: '-10%' }}
            animate={{ x: '110%' }}
            transition={{
              duration: fishScatter ? f.dur * 0.3 : f.dur,
              repeat: Infinity, delay: f.delay, ease: fishScatter ? 'easeOut' : 'linear',
            }}
          >
            <div className="opacity-20 text-slate-600" style={{ width: f.size, height: f.size * 0.5 }}>
              <svg viewBox="0 0 100 50" fill="currentColor"><path d="M10,25 C30,10 65,10 80,25 C75,28 75,32 80,25 C85,20 95,15 95,25 C95,35 85,30 80,25 C65,40 30,40 10,25 Z" /></svg>
            </div>
          </motion.div>
        ))}

        {/* Cursor ripples on water */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {waterRipples.map(r => (
              <motion.div
                key={r.id}
                initial={{ scale: 0, opacity: 0.4 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute rounded-full border border-cyan-300/30"
                style={{
                  left: r.x - 30,
                  top: r.y - 30,
                  width: 60,
                  height: 60,
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 6. Floating cage grid — buoyancy animation */}
      {cages.slice(0, 6).map((cage, i) => {
        const pos = cagePositions[i % cagePositions.length];
        const healthy = cage.healthScore >= 85;
        return (
          <div
            key={cage.id}
            className="absolute pointer-events-none"
            style={{ left: `${pos.x}%`, top: `${pos.y * 0.45 + 45}%`, transform: 'translate(-50%, -50%)' }}
          >
            <motion.div
              animate={{ y: [0, -3, 0], rotate: [-1, 1, -1] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Cage ring (top-down view) */}
              <div
                className={`rounded-full border-2 ${healthy ? 'border-emerald-400/30' : 'border-orange-400/30'} bg-slate-950/20`}
                style={{ width: 28, height: 28 }}
              >
                <div className={`w-full h-full rounded-full ${healthy ? 'bg-emerald-500/5' : 'bg-orange-500/5'}`} />
              </div>
              {/* Mooring lines */}
              <div className="absolute top-1/2 left-1/2 w-8 h-px bg-cyan-400/10 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'rotate(45deg)' }} />
              <div className="absolute top-1/2 left-1/2 w-8 h-px bg-cyan-400/10 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'rotate(-45deg)' }} />
            </motion.div>
          </div>
        );
      })}

      {/* 7. Boats with wakes */}
      {Array.from({ length: Math.min(boatsActive, 3) }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: `${50 + i * 8}%` }}
          initial={{ x: '-5vw' }}
          animate={{ x: '105vw' }}
          transition={{ duration: 30 + i * 8, repeat: Infinity, delay: i * 5, ease: 'linear' }}
        >
          <motion.div
            animate={{ y: [0, -2, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <div className="w-6 h-3 rounded-sm bg-slate-700/40 border border-cyan-400/20" />
            {/* Wake */}
            <div className="absolute top-1/2 -left-10 w-10 h-px bg-gradient-to-r from-transparent to-cyan-400/15" />
            <div className="absolute top-1/2 -left-8 w-8 h-px bg-gradient-to-r from-transparent to-cyan-400/10" style={{ transform: 'translateY(2px)' }} />
          </motion.div>
        </motion.div>
      ))}

      {/* 8. Onshore infrastructure — isometric buildings */}
      <div className="absolute bottom-[42%] right-[5%] pointer-events-none">
        <svg width="180" height="80" viewBox="0 0 180 80" className="opacity-30">
          {/* Processing building */}
          <g>
            <rect x="10" y="20" width="50" height="35" fill="#1e293b" stroke="#0891b2" strokeWidth="0.5" opacity="0.6" />
            <rect x="10" y="15" width="50" height="6" fill="#0f172a" opacity="0.7" />
            <rect x="20" y="30" width="6" height="8" fill="#22d3ee" opacity="0.4" />
            <rect x="35" y="30" width="6" height="8" fill="#22d3ee" opacity="0.4" />
            <rect x="50" y="30" width="6" height="8" fill="#22d3ee" opacity="0.4" />
            {/* Roof solar panels */}
            <rect x="10" y="12" width="50" height="4" fill="#1e3a5f" opacity="0.5" />
          </g>
          {/* Cold room */}
          <g>
            <rect x="70" y="25" width="30" height="30" fill="#0c4a6e" stroke="#22d3ee" strokeWidth="0.5" opacity="0.5" />
            <rect x="70" y="22" width="30" height="4" fill="#082f49" opacity="0.6" />
            <circle cx="85" cy="40" r="3" fill="#22d3ee" opacity="0.3" />
          </g>
          {/* Research lab */}
          <g>
            <rect x="110" y="28" width="35" height="27" fill="#1e293b" stroke="#14b8a6" strokeWidth="0.5" opacity="0.5" />
            <rect x="110" y="25" width="35" height="4" fill="#0f172a" opacity="0.6" />
            <rect x="118" y="35" width="5" height="6" fill="#2dd4bf" opacity="0.4" />
            <rect x="128" y="35" width="5" height="6" fill="#2dd4bf" opacity="0.4" />
            <rect x="138" y="35" width="5" height="6" fill="#2dd4bf" opacity="0.4" />
          </g>
          {/* Dock */}
          <g>
            <rect x="5" y="55" width="140" height="4" fill="#334155" opacity="0.4" />
            <line x1="10" y1="59" x2="10" y2="65" stroke="#334155" strokeWidth="1" opacity="0.3" />
            <line x1="50" y1="59" x2="50" y2="65" stroke="#334155" strokeWidth="1" opacity="0.3" />
            <line x1="100" y1="59" x2="100" y2="65" stroke="#334155" strokeWidth="1" opacity="0.3" />
            <line x1="140" y1="59" x2="140" y2="65" stroke="#334155" strokeWidth="1" opacity="0.3" />
          </g>
          {/* Trees */}
          <g opacity="0.3">
            <circle cx="160" cy="50" r="8" fill="#0f766e" />
            <rect x="158" y="55" width="4" height="8" fill="#1e293b" />
            <circle cx="3" cy="48" r="6" fill="#0f766e" />
            <rect x="1" y="52" width="3" height="6" fill="#1e293b" />
          </g>
        </svg>
      </div>

      {/* 9. Workers moving on dock */}
      {workers.map(w => (
        <motion.div
          key={w.id}
          className="absolute bottom-[41%] pointer-events-none"
          style={{ left: `${w.x + 75}%` }}
          initial={{ x: 0 }}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: w.dur, repeat: Infinity, delay: w.delay, ease: 'easeInOut' }}
        >
          <div className="w-1 h-2 bg-cyan-300/20 rounded-full" />
        </motion.div>
      ))}

      {/* 10. Birds flying overhead */}
      {birds.map(b => (
        <motion.div
          key={b.id}
          className="absolute pointer-events-none opacity-20"
          style={{ top: `${b.y}%` }}
          initial={{ x: '-5vw' }}
          animate={{ x: '105vw' }}
          transition={{ duration: b.dur, repeat: Infinity, delay: b.delay, ease: 'linear' }}
        >
          <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <svg width="20" height="8" viewBox="0 0 20 8" fill="none" className="text-slate-400">
              <path d="M0 6 Q5 0 10 6 Q15 0 20 6" stroke="currentColor" strokeWidth="0.8" fill="none" />
            </svg>
          </motion.div>
        </motion.div>
      ))}

      {/* 11. Rain overlay */}
      {isRain && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {raindrops.map(r => (
            <motion.div
              key={r.id}
              className="absolute w-px h-4 bg-cyan-200/20"
              style={{ left: `${r.x}%`, top: '-5%' }}
              animate={{ y: '110vh' }}
              transition={{ duration: r.dur, repeat: Infinity, delay: r.delay, ease: 'linear' }}
            />
          ))}
        </div>
      )}

      {/* 12. Lightning flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.1, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white pointer-events-none mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* 13. Ambient light wash — golden hour / morning warmth */}
      {isGolden && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(251,191,36,0.06) 0%, transparent 50%)' }} />
      )}
      {isMorning && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(251,191,36,0.04) 0%, transparent 40%)' }} />
      )}

      {/* 14. Morning mist */}
      {isMorning && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`mist-${i}`}
              className="absolute pointer-events-none"
              style={{ top: `${35 + i * 5}%`, height: '8%', width: '120%' }}
              initial={{ x: '-20%' }}
              animate={{ x: '20%' }}
              transition={{ duration: 25 + i * 5, repeat: Infinity, delay: i * 3, ease: 'easeInOut' }}
            >
              <div className="w-full h-full" style={{ background: 'linear-gradient(to right, transparent, rgba(34,211,238,0.06), transparent)', filter: 'blur(30px)' }} />
            </motion.div>
          ))}
        </>
      )}

      {/* 15. Moonlight shimmer at night */}
      {isNight && (
        <motion.div
          className="absolute pointer-events-none"
          style={{ top: '15%', right: '20%', width: 300, height: 40 }}
          animate={{ opacity: [0.08, 0.15, 0.08], x: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-full" style={{ background: 'linear-gradient(to right, transparent, rgba(129,140,248,0.15), transparent)', filter: 'blur(20px)' }} />
        </motion.div>
      )}

      {/* 16. Floating leaves */}
      {leaves.map(l => (
        <motion.div
          key={`leaf-${l.id}`}
          className="absolute pointer-events-none"
          style={{ left: `${l.x}%`, top: '-5%' }}
          initial={{ y: 0, rotate: 0, opacity: 0 }}
          animate={{ y: '110vh', rotate: 360, opacity: [0, 0.3, 0.3, 0] }}
          transition={{ duration: l.dur, repeat: Infinity, delay: l.delay, ease: 'linear' }}
        >
          <svg width={l.size} height={l.size * 0.6} viewBox="0 0 20 12" fill="none">
            <path d="M2,6 Q10,2 18,6 Q10,10 2,6 Z" fill="rgba(20,184,166,0.3)" stroke="rgba(20,184,166,0.4)" strokeWidth="0.3" />
            <line x1="2" y1="6" x2="18" y2="6" stroke="rgba(20,184,166,0.3)" strokeWidth="0.3" />
          </svg>
        </motion.div>
      ))}

      {/* 17. Vignette for depth */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,6,23,0.4) 100%)' }} />

      {/* 18. Sustainability reef indicator — subtle growth at lake bottom */}
      {sustainabilityScore >= 80 && (
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none flex justify-between px-8 opacity-15">
          <svg width="60" height="80" viewBox="0 0 60 80" style={{ color: '#14b8a6' }}>
            <path d="M10,80 Q15,50 12,25 T16,5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M30,80 Q25,45 32,20 T28,2" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M48,80 Q52,55 46,30 T50,10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <svg width="80" height="100" viewBox="0 0 80 100" style={{ color: '#14b8a6' }}>
            <path d="M15,100 Q22,60 10,35 T18,8" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path d="M40,100 Q48,50 36,30 T42,10" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <path d="M65,100 Q58,70 62,45 T58,20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}
