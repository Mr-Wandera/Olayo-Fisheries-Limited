import React, { createContext, useContext, useCallback, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/* ============================================================
   LIQUID UX SYSTEM
   Water-inspired interaction language for the entire app.
   - RippleProvider: global click ripples + cursor trail
   - useRipple: programmatic ripple trigger
   - LiquidButton: buoyant, compressing button
   - LiquidPanel: floating panel with cursor light shift
   - NumberRoll: animated number that rolls naturally
   - WaveReveal: water-curtain text/content reveal
   ============================================================ */

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface RippleContextValue {
  triggerRipple: (x: number, y: number, opts?: { size?: number; color?: string }) => void;
}

const RippleContext = createContext<RippleContextValue>({ triggerRipple: () => {} });

export const useRipple = () => useContext(RippleContext);

/* ============ RIPPLE PROVIDER ============ */
export function RippleProvider({ children }: { children: React.ReactNode }) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const idRef = useRef(0);
  const trailIdRef = useRef(0);
  const lastTrailTime = useRef(0);

  const triggerRipple = useCallback((x: number, y: number, opts?: { size?: number; color?: string }) => {
    const id = idRef.current++;
    const size = opts?.size ?? 80;
    const color = opts?.color ?? 'rgba(34,211,238,0.4)';
    setRipples(prev => [...prev, { id, x, y, size, color }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 900);
  }, []);

  // Global click ripple
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't ripple on form elements that handle their own feedback
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;
      triggerRipple(e.clientX, e.clientY);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [triggerRipple]);

  // Cursor trail — gentle wave distortion beneath pointer
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTrailTime.current < 40) return;
      lastTrailTime.current = now;
      const id = trailIdRef.current++;
      setTrail(prev => [...prev.slice(-8), { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => setTrail(prev => prev.filter(t => t.id !== id)), 600);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <RippleContext.Provider value={{ triggerRipple }}>
      {children}
      {/* Cursor trail — subtle water distortion */}
      <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
        <AnimatePresence>
          {trail.map(t => (
            <motion.div
              key={t.id}
              initial={{ scale: 0, opacity: 0.15 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute rounded-full"
              style={{
                left: t.x - 12,
                top: t.y - 12,
                width: 24,
                height: 24,
                background: 'radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%)',
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      {/* Click ripples */}
      <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
        <AnimatePresence>
          {ripples.map(r => (
            <motion.div
              key={r.id}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute rounded-full border-2"
              style={{
                left: r.x - r.size / 2,
                top: r.y - r.size / 2,
                width: r.size,
                height: r.size,
                borderColor: r.color,
                boxShadow: `0 0 20px ${r.color}`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </RippleContext.Provider>
  );
}

/* ============ LIQUID BUTTON ============ */
interface LiquidButtonProps {
  variant?: 'primary' | 'ghost' | 'amber' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  [key: string]: any;
}

export function LiquidButton({ variant = 'primary', size = 'md', children, className = '', onClick, ...rest }: LiquidButtonProps) {
  const { triggerRipple } = useRipple();
  const ref = useRef<HTMLButtonElement>(null);

  const variants = {
    primary: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20',
    ghost: 'bg-slate-950/60 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/10',
    amber: 'bg-amber-500/15 border border-amber-400/30 text-amber-300 hover:bg-amber-500/25',
    emerald: 'bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/25',
  };
  const sizes = { sm: 'px-3 py-1.5 text-[11px]', md: 'px-4 py-2 text-xs', lg: 'px-6 py-3 text-sm' };

  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.95, y: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={(e) => {
        triggerRipple(e.clientX, e.clientY, { size: 60, color: variant === 'amber' ? 'rgba(251,191,36,0.5)' : variant === 'emerald' ? 'rgba(52,211,153,0.5)' : 'rgba(34,211,238,0.5)' });
        onClick?.(e);
      }}
      className={`relative overflow-hidden rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}

/* ============ LIQUID PANEL ============ */
export function LiquidPanel({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setLightPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: glow
          ? `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(34,211,238,0.06), transparent 50%), linear-gradient(135deg, rgba(15,23,42,0.72), rgba(2,6,23,0.78))`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}

/* ============ NUMBER ROLL ============ */
export function NumberRoll({ value, className = '', duration = 1.2 }: { value: number; className?: string; duration?: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    if (start === end) return;
    const startTime = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const t = Math.min(1, elapsed / duration);
      // Ease with slight overshoot for organic feel
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(start + (end - start) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = end;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className={className}>{display.toFixed(value % 1 === 0 ? 0 : 1)}</span>;
}

/* ============ WAVE REVEAL ============ */
export function WaveReveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
      animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============ LIQUID SCROLL WRAPPER ============ */
export function LiquidScroll({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [velocity, setVelocity] = useState(0);
  const lastScroll = useRef(0);
  const lastTime = useRef(0);

  const handleScroll = (e: React.UIEvent) => {
    const el = e.currentTarget;
    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      const v = (el.scrollTop - lastScroll.current) / dt;
      setVelocity(Math.max(-2, Math.min(2, v)));
    }
    lastScroll.current = el.scrollTop;
    lastTime.current = now;
  };

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      className={`overflow-y-auto scrollbar-none ${className}`}
      style={{
        transform: `translateY(${velocity * -2}px)`,
        transition: 'transform 0.15s ease-out',
      }}
    >
      {children}
    </div>
  );
}
