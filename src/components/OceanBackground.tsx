import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type TimeOfDay = 'morning' | 'afternoon' | 'golden_hour' | 'sunset' | 'night' | 'midnight';
export type WeatherType = 'clear' | 'storm';

interface OceanBackgroundProps {
  sustainabilityScore: number;
  timeOfDay?: TimeOfDay;
  weather?: WeatherType;
}

export default function OceanBackground({ sustainabilityScore, timeOfDay = 'afternoon', weather = 'clear' }: OceanBackgroundProps) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [lightningFlash, setLightningFlash] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse position for fish repulsion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Stormy weather random lightning flash generator
  useEffect(() => {
    if (weather !== 'storm') {
      setLightningFlash(false);
      return;
    }
    const triggerLightning = () => {
      setLightningFlash(true);
      setTimeout(() => setLightningFlash(false), 80);
      setTimeout(() => {
        setLightningFlash(true);
        setTimeout(() => setLightningFlash(false), 120);
      }, 150);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        triggerLightning();
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [weather]);

  // Generate bubble configurations
  const bubbles = useMemo(() => {
    const count = weather === 'storm' ? 35 : 15;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * (weather === 'storm' ? 12 : 8) + 4,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 10,
      duration: Math.random() * (weather === 'storm' ? 6 : 10) + (weather === 'storm' ? 4 : 10),
    }));
  }, [weather]);

  // Plankton particles (bioluminescent at night)
  const plankton = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * -20,
      durationX: Math.random() * 12 + 8,
      durationY: Math.random() * 15 + 10,
    }));
  }, []);

  // Set visual parameters based on time of day & weather
  const atmosphere = useMemo(() => {
    if (weather === 'storm') {
      return {
        gradient: 'from-[#05111c] via-[#0b1f2e] to-[#020a10]',
        rayColor1: 'rgba(90, 160, 200, 0.08)',
        rayColor2: 'rgba(100, 150, 180, 0.05)',
        rayScale: 1.4,
        planktonColor: 'text-slate-400',
        oceanBrightness: 'brightness-75 contrast-110',
        seaweedColor: '#2d3748', // Bleak / Dark grey-green
      };
    }

    switch (timeOfDay) {
      case 'morning':
        return {
          gradient: 'from-[#042444] via-[#073663] to-[#02182c]',
          rayColor1: 'rgba(251, 191, 36, 0.15)', // soft gold/pink
          rayColor2: 'rgba(236, 72, 153, 0.08)',
          rayScale: 1.0,
          planktonColor: 'text-amber-100/30',
          oceanBrightness: 'brightness-95 contrast-100',
          seaweedColor: '#0f766e',
        };
      case 'afternoon':
        return {
          gradient: 'from-[#022144] via-[#03448a] to-[#01162d]',
          rayColor1: 'rgba(34, 211, 238, 0.22)', // bright cyan
          rayColor2: 'rgba(45, 212, 191, 0.15)', // teal
          rayScale: 1.2,
          planktonColor: 'text-cyan-200/40',
          oceanBrightness: 'brightness-100 contrast-100',
          seaweedColor: '#0d9488',
        };
      case 'golden_hour':
        return {
          gradient: 'from-[#0a2c4e] via-[#0c4c8f] to-[#041c33]',
          rayColor1: 'rgba(245, 158, 11, 0.25)', // warm amber
          rayColor2: 'rgba(249, 115, 22, 0.18)', // orange
          rayScale: 1.1,
          planktonColor: 'text-amber-200/50',
          oceanBrightness: 'brightness-105 contrast-95',
          seaweedColor: '#115e59',
        };
      case 'sunset':
        return {
          gradient: 'from-[#0d1e38] via-[#1a2d52] to-[#061021]',
          rayColor1: 'rgba(225, 29, 72, 0.18)', // crimson
          rayColor2: 'rgba(124, 58, 237, 0.12)', // purple
          rayScale: 1.0,
          planktonColor: 'text-rose-200/40',
          oceanBrightness: 'brightness-90 contrast-105',
          seaweedColor: '#1e1b4b',
        };
      case 'night':
        return {
          gradient: 'from-[#020b14] via-[#031526] to-[#01060a]',
          rayColor1: 'rgba(14, 116, 144, 0.08)', // dim blue-green
          rayColor2: 'rgba(13, 148, 136, 0.05)',
          rayScale: 0.7,
          planktonColor: 'text-cyan-300/60 shadow-[0_0_8px_rgba(34,211,238,0.8)]', // bioluminescent
          oceanBrightness: 'brightness-80 contrast-95',
          seaweedColor: '#042f2e',
        };
      case 'midnight':
      default:
        return {
          gradient: 'from-[#010408] via-[#020b12] to-[#000103]',
          rayColor1: 'rgba(8, 51, 68, 0.05)', // extremely faint
          rayColor2: 'rgba(4, 47, 46, 0.03)',
          rayScale: 0.5,
          planktonColor: 'text-teal-300/80 shadow-[0_0_12px_rgba(20,184,166,0.9)] animate-pulse', // maximum bioluminescence
          oceanBrightness: 'brightness-70 contrast-110',
          seaweedColor: '#021515',
        };
    }
  }, [timeOfDay, weather]);

  // Coral/Seaweed color logic based on sustainability and time of day
  const coralColor = useMemo(() => {
    if (sustainabilityScore >= 85) return '#14b8a6'; // Vibrant cyan-teal
    if (sustainabilityScore >= 75) return '#0d9488'; // Clean ocean teal
    if (sustainabilityScore >= 60) return '#0f766e'; // Deep marine green
    return '#475569'; // bleached slate-grey
  }, [sustainabilityScore]);

  // Occasional deep sea creature silhouettes (e.g. whale at index 0, dolphin at index 1)
  const creatures = useMemo(() => {
    return [
      {
        id: 'whale',
        d: 'M10,25 C30,5 80,10 130,22 C145,26 160,20 170,10 C165,30 180,45 190,48 C155,50 140,40 120,42 C80,45 35,48 10,25 Z',
        viewBox: '0 0 200 60',
        width: 180,
        height: 55,
        duration: 48,
        top: '25%',
        delay: 5,
        scaleY: 1,
      },
      {
        id: 'dolphin',
        d: 'M10,15 C20,8 35,5 50,11 C58,14 62,20 68,23 C72,21 78,16 82,10 C80,18 85,25 90,28 C75,32 68,28 58,26 C40,23 25,25 10,15 Z',
        viewBox: '0 0 100 35',
        width: 90,
        height: 32,
        duration: 28,
        top: '45%',
        delay: 15,
        scaleY: 0.95,
      },
    ];
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-50 overflow-hidden bg-slate-950 transition-all duration-1000 ${atmosphere.oceanBrightness}`}
    >
      {/* Dynamic Gradients */}
      <div className={`absolute inset-0 bg-gradient-to-b ${atmosphere.gradient} transition-all duration-1000`} />

      {/* Lightning Flash Overlay (for Stormy states) */}
      <AnimatePresence>
        {lightningFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0.1, 0.7, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white z-10 pointer-events-none mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* Swaying sunlight / Caustic rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            rotate: [-8, 8, -8],
            x: ['-5%', '5%', '-5%'],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 origin-top flex justify-around opacity-30 mix-blend-color-dodge"
        >
          <div
            className="w-[12%] h-[150vh] blur-[40px] transform rotate-12"
            style={{
              background: `linear-gradient(to bottom, ${atmosphere.rayColor1}, transparent)`,
              transform: `scale(${atmosphere.rayScale})`,
            }}
          />
          <div
            className="w-[16%] h-[150vh] blur-[55px] transform -rotate-6"
            style={{
              background: `linear-gradient(to bottom, ${atmosphere.rayColor2}, transparent)`,
              transform: `scale(${atmosphere.rayScale * 1.1})`,
            }}
          />
          <div
            className="w-[10%] h-[150vh] blur-[35px] transform rotate-3"
            style={{
              background: `linear-gradient(to bottom, ${atmosphere.rayColor1}, transparent)`,
              transform: `scale(${atmosphere.rayScale * 0.9})`,
            }}
          />
        </motion.div>
      </div>

      {/* Floating Plankton (Dynamic sizes and glows) */}
      <div className="absolute inset-0 pointer-events-none">
        {plankton.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute rounded-full bg-cyan-200/40 ${atmosphere.planktonColor}`}
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              x: [0, Math.sin(p.id) * 35, 0],
              y: [0, Math.cos(p.id) * 25, 0],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: p.durationX,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Occasional Marine Megafauna (Whale or Dolphin) */}
      {creatures.map((c) => (
        <motion.div
          key={c.id}
          className="absolute left-[-220px] opacity-[0.06] text-teal-900 pointer-events-none"
          style={{ top: c.top }}
          initial={{ x: '-250px', scaleY: c.scaleY }}
          animate={{ x: '100vw' }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            delay: c.delay,
            ease: 'linear',
          }}
        >
          <svg
            viewBox={c.viewBox}
            width={c.width}
            height={c.height}
            fill="currentColor"
          >
            <path d={c.d} />
          </svg>
        </motion.div>
      ))}

      {/* Interactive Fish School reacting to Cursor */}
      <InteractiveFishSchool
        fishCount={Math.floor((sustainabilityScore / 100) * 12) + 4}
        mousePos={mousePos}
      />

      {/* Rising Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="absolute bottom-[-20px] rounded-full bg-cyan-100/10 border border-white/5 blur-[0.2px] bubble-animation"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Seaweed and ecosystem corals at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none flex justify-between px-10 opacity-30 select-none">
        <div className="flex items-end space-x-2">
          <svg width="70" height="110" viewBox="0 0 70 110" style={{ color: coralColor }}>
            <path d="M12,110 Q20,70 15,35 T20,5" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M35,110 Q28,65 38,30 T32,2" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <path d="M55,110 Q45,85 50,55 T46,15" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex items-end">
          <svg width="90" height="130" viewBox="0 0 90 130" style={{ color: coralColor }}>
            <path d="M20,130 Q28,85 15,45 T22,8" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M45,130 Q54,75 42,45 T48,12" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
            <path d="M72,130 Q62,95 68,65 T65,28" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

interface FishSchoolProps {
  fishCount: number;
  mousePos: { x: number; y: number };
}

function InteractiveFishSchool({ fishCount, mousePos }: FishSchoolProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fishList, setFishList] = useState<
    {
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      angle: number;
    }[]
  >([]);

  // Initialize fish coordinates on mount
  useEffect(() => {
    const list = Array.from({ length: fishCount }).map((_, idx) => ({
      id: idx,
      x: Math.random() * window.innerWidth,
      y: 50 + Math.random() * (window.innerHeight - 150),
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 20 + 15,
      angle: 0,
    }));
    setFishList(list);
  }, [fishCount]);

  // Main animation frame for fish physics & mouse repulsion
  useEffect(() => {
    let active = true;

    const updatePhysics = () => {
      if (!active) return;

      setFishList((prevList) =>
        prevList.map((f) => {
          let nvx = f.vx;
          let nvy = f.vy;

          // Repulsion calculations: if mouse coordinates are active, scatter!
          const dx = f.x - mousePos.x;
          const dy = f.y - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            // Push away proportional to distance
            const force = (180 - dist) / 180;
            const angle = Math.atan2(dy, dx);
            nvx += Math.cos(angle) * force * 5;
            nvy += Math.sin(angle) * force * 3;
          }

          // Bound velocity
          const speed = Math.sqrt(nvx * nvx + nvy * nvy);
          const maxSpeed = dist < 180 ? 6 : 2;
          if (speed > maxSpeed) {
            nvx = (nvx / speed) * maxSpeed;
            nvy = (nvy / speed) * maxSpeed;
          }

          // Drift/drag back towards original slow lateral swimming
          if (dist >= 180) {
            nvx += (1.2 - nvx) * 0.05; // Prefer swimming rightwards
            nvy += (0 - nvy) * 0.05;
          }

          // New position
          let nx = f.x + nvx;
          let ny = f.y + nvy;

          // Wrap horizontally, clamp vertically
          if (nx > window.innerWidth + 50) {
            nx = -50;
            ny = 50 + Math.random() * (window.innerHeight - 150);
            nvx = Math.random() * 1 + 0.8;
            nvy = (Math.random() - 0.5) * 0.5;
          } else if (nx < -50) {
            nx = window.innerWidth + 50;
          }

          if (ny < 30) ny = 30;
          if (ny > window.innerHeight - 80) ny = window.innerHeight - 80;

          // Smooth orientation angle based on velocity
          const targetAngle = Math.atan2(nvy, nvx);
          const diff = targetAngle - f.angle;
          const angle = f.angle + diff * 0.1;

          return { ...f, x: nx, y: ny, vx: nvx, vy: nvy, angle };
        })
      );

      requestAnimationFrame(updatePhysics);
    };

    const animId = requestAnimationFrame(updatePhysics);
    return () => {
      active = false;
      cancelAnimationFrame(animId);
    };
  }, [mousePos]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none select-none">
      {fishList.map((f) => (
        <div
          key={f.id}
          className="absolute opacity-35 text-cyan-300/80 transition-transform duration-100 ease-out"
          style={{
            left: f.x,
            top: f.y,
            width: f.size,
            height: f.size / 2,
            transform: `rotate(${f.angle}rad) scaleX(${f.vx < 0 ? -1 : 1})`,
          }}
        >
          <svg viewBox="0 0 100 50" fill="currentColor" className="w-full h-full">
            <path d="M10,25 C30,10 65,10 80,25 C75,28 75,32 80,25 C85,20 95,15 95,25 C95,35 85,30 80,25 C65,40 30,40 10,25 Z" />
            <path d="M45,28 C48,32 44,35 42,32 Z" fill="rgba(255,255,255,0.4)" />
          </svg>
        </div>
      ))}
    </div>
  );
}
