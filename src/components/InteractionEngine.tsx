import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform } from 'motion/react';
import { ShoppingCart, Heart, CheckCircle2, ChevronRight, HelpCircle, RefreshCw } from 'lucide-react';

// Common Ocean Spring Physics Configuration
export const springOcean = {
  type: 'spring',
  stiffness: 110,
  damping: 14,
  mass: 0.8,
};

export const springSoft = {
  type: 'spring',
  stiffness: 85,
  damping: 18,
};

export const springBubble = {
  type: 'spring',
  stiffness: 240,
  damping: 12,
};

/**
 * 1. WATER RIPPLE ENGINE
 * Captures clicks/taps and radiates beautiful concentric organic water ripples
 */
interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function WaterRippleEffect() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Create a water ripple at the click position
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples(prev => [...prev, newRipple].slice(-8)); // Limit to max 8 concurrent ripples
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {ripples.map(ripple => (
          <React.Fragment key={ripple.id}>
            {/* Main expanding water ring */}
            <motion.div
              initial={{ x: ripple.x - 4, y: ripple.y - 4, scale: 0, opacity: 0.5 }}
              animate={{
                scale: [1, 10],
                opacity: [0.5, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute w-8 h-8 rounded-full border border-cyan-400/40 pointer-events-none"
            />
            {/* Secondary delayed expanding ring for realism */}
            <motion.div
              initial={{ x: ripple.x - 4, y: ripple.y - 4, scale: 0, opacity: 0.3 }}
              animate={{
                scale: [0.5, 7],
                opacity: [0.3, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
              className="absolute w-8 h-8 rounded-full border border-cyan-500/20 pointer-events-none"
            />
            {/* Tiny ambient floating bubbles */}
            {[...Array(4)].map((_, i) => {
              const angle = (i * Math.PI) / 2 + Math.random() * 0.5;
              const dist = 30 + Math.random() * 40;
              const bx = Math.cos(angle) * dist;
              const by = Math.sin(angle) * dist;

              return (
                <motion.div
                  key={i}
                  initial={{ x: ripple.x, y: ripple.y, scale: 0.5, opacity: 0.7 }}
                  animate={{
                    x: ripple.x + bx,
                    y: ripple.y + by - (20 + Math.random() * 20), // float upwards
                    scale: [0.5, 1.2, 0],
                    opacity: [0.7, 0.4, 0],
                  }}
                  transition={{ duration: 0.7 + Math.random() * 0.4, ease: 'easeOut' }}
                  className="absolute w-2 h-2 rounded-full bg-cyan-300/40 shadow-sm shadow-cyan-400/20 pointer-events-none"
                />
              );
            })}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * 2. FLOATING CARD WITH OCEAN MOTION
 * Rotates, tilts, floats and casts adaptive shadows based on mouse hover/drag velocity
 */
interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
  key?: React.Key;
}

export function FloatingCard({ children, className = '', onClick, id }: FloatingCardProps) {
  const isReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Compute slight rotation and skew based on hover position or natural breathing
  const rotateX = useTransform(y, [-50, 50], [5, -5]);
  const rotateY = useTransform(x, [-50, 50], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(e.clientX - cx);
    y.set(e.clientY - cy);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      id={id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: isReducedMotion ? 0 : rotateX,
        rotateY: isReducedMotion ? 0 : rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={isReducedMotion ? {} : { y: -6, scale: 1.01 }}
      transition={springOcean}
      className={`relative rounded-2xl transition-shadow duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * 3. REUSABLE SWIPE ACTION CONTAINER
 * Allows swipe-left or swipe-right with full inertia, spring physics, and high visual feedback overlays
 */
interface SwipeContainerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftIcon?: React.ReactNode;
  leftText?: string;
  leftBg?: string; // Tailwind class
  rightIcon?: React.ReactNode;
  rightText?: string;
  rightBg?: string; // Tailwind class
  className?: string;
  key?: React.Key;
}

export function SwipeContainer({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftIcon = <Heart className="w-5 h-5" />,
  leftText = 'Save',
  leftBg = 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
  rightIcon = <ShoppingCart className="w-5 h-5" />,
  rightText = 'Add',
  rightBg = 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40',
  className = '',
}: SwipeContainerProps) {
  const dragX = useMotionValue(0);
  const isReducedMotion = useReducedMotion();
  const [swipeState, setSwipeState] = useState<'none' | 'left' | 'right'>('none');

  // Map drag value to background visibility and feedback indicators
  const opacityLeft = useTransform(dragX, [30, 100], [0, 1]);
  const opacityRight = useTransform(dragX, [-100, -30], [1, 0]);
  const scaleLeft = useTransform(dragX, [0, 120], [0.8, 1.1]);
  const scaleRight = useTransform(dragX, [-120, 0], [1.1, 0.8]);

  const handleDrag = () => {
    const val = dragX.get();
    if (val > 60) {
      setSwipeState('right');
    } else if (val < -60) {
      setSwipeState('left');
    } else {
      setSwipeState('none');
    }
  };

  const handleDragEnd = (_e: any, info: any) => {
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Fast flick or crossing threshold triggers action
    if (offset > 100 || (velocity > 300 && offset > 40)) {
      if (onSwipeRight) {
        onSwipeRight();
      }
    } else if (offset < -100 || (velocity < -300 && offset < -40)) {
      if (onSwipeLeft) {
        onSwipeLeft();
      }
    }
    setSwipeState('none');
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl w-full group select-none ${className}`}>
      {/* Swipe Left Overlay (Revealed when dragging Right) */}
      <motion.div
        style={{ opacity: opacityLeft }}
        className={`absolute inset-y-0 left-0 w-24 flex flex-col justify-center items-center rounded-l-2xl z-10 pointer-events-none transition-colors ${rightBg}`}
      >
        <motion.div style={{ scale: scaleLeft }} className="flex flex-col items-center gap-1 font-mono text-[10px] font-bold">
          {rightIcon}
          <span>{rightText}</span>
        </motion.div>
      </motion.div>

      {/* Swipe Right Overlay (Revealed when dragging Left) */}
      <motion.div
        style={{ opacity: opacityRight }}
        className={`absolute inset-y-0 right-0 w-24 flex flex-col justify-center items-center rounded-r-2xl z-10 pointer-events-none transition-colors ${leftBg}`}
      >
        <motion.div style={{ scale: scaleRight }} className="flex flex-col items-center gap-1 font-mono text-[10px] font-bold">
          {leftIcon}
          <span>{leftText}</span>
        </motion.div>
      </motion.div>

      {/* Main Draggable Component */}
      <motion.div
        drag={isReducedMotion ? false : 'x'}
        dragConstraints={{ left: -140, right: 140 }}
        dragElastic={0.4}
        style={{ x: dragX }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        transition={springOcean}
        className="w-full relative z-20 touch-pan-y"
      >
        {children}
      </motion.div>

      {/* Small Swipe Indicator for Desktop / Mobile discovery */}
      <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none text-[8px] font-mono text-cyan-400/40">
        ↔ Swipe Card
      </div>
    </div>
  );
}

/**
 * 4. HIGH-IMPACT SLIDE-TO-CONFIRM
 * Slide horizontally to confirm, featuring swimming fish 🐟 ahead of the thumb, water track fills,
 * and a tactile expanding bubble effect upon trigger. Fully accessible with button fallback!
 */
interface SlideToConfirmProps {
  onConfirm: () => void;
  label?: string;
  successLabel?: string;
  className?: string;
}

export function SlideToConfirm({
  onConfirm,
  label = 'Slide to Confirm Order Dispatch',
  successLabel = 'Order Confirmed! 🌊',
  className = '',
}: SlideToConfirmProps) {
  const isReducedMotion = useReducedMotion();
  const [isSuccess, setIsSuccess] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(240);

  const dragX = useMotionValue(0);

  // Measure track width
  useEffect(() => {
    if (trackRef.current) {
      const trackWidth = trackRef.current.offsetWidth;
      // thumb width is 48px
      setMaxDrag(Math.max(trackWidth - 52, 100));
    }
  }, []);

  // Set up transformed values for responsive styling
  const fillWidth = useTransform(dragX, [0, maxDrag], ['0%', '100%']);
  const fishOpacity = useTransform(dragX, [0, maxDrag * 0.9], [1, 0.4]);
  const bubbleScale = useTransform(dragX, [0, maxDrag], [1, 1.25]);

  const handleDragEnd = () => {
    const currentX = dragX.get();
    if (currentX >= maxDrag * 0.92) {
      setIsSuccess(true);
      dragX.set(maxDrag);
      onConfirm();
      
      // Reset success after 2.5s to allow future confirms if needed
      setTimeout(() => {
        setIsSuccess(false);
        dragX.set(0);
      }, 2500);
    } else {
      // Bounce back
      dragX.set(0);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Slider Core Container */}
      <div
        ref={trackRef}
        className="relative h-14 w-full bg-slate-950/90 rounded-2xl border border-cyan-500/20 overflow-hidden flex items-center p-1 select-none"
      >
        {/* Animated Water Background Fill */}
        <motion.div
          style={{ width: fillWidth }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600/30 to-cyan-400/50 rounded-xl pointer-events-none flex items-center justify-end overflow-hidden"
        >
          {/* Bubbles floating inside the filled area */}
          <div className="flex gap-2 mr-3 opacity-60">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </motion.div>

        {/* Swipe Guidelines Labels */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-12">
          <span className="text-xs font-mono font-bold text-cyan-300/85 tracking-wider text-center animate-pulse">
            {isSuccess ? successLabel : label}
          </span>
        </div>

        {/* Accessible Direct Button Click Trigger (Embedded in the track to keep full visibility) */}
        <button
          onClick={() => {
            setIsSuccess(true);
            onConfirm();
            setTimeout(() => {
              setIsSuccess(false);
            }, 2500);
          }}
          className="absolute right-3.5 z-30 p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-colors text-[9px] font-mono uppercase font-bold cursor-pointer"
          title="Direct click bypass option"
        >
          Click bypass
        </button>

        {/* Draggable Thumb (Floating Fish ahead) */}
        {!isSuccess && (
          <motion.div
            drag={isReducedMotion ? false : 'x'}
            dragConstraints={{ left: 0, right: maxDrag }}
            dragElastic={0.08}
            style={{ x: dragX }}
            onDragEnd={handleDragEnd}
            className="w-11 h-11 rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 flex items-center justify-center z-20 cursor-grab active:cursor-grabbing relative"
          >
            {/* The Handle Thumb */}
            <motion.div style={{ scale: bubbleScale }} className="flex items-center justify-center">
              <ChevronRight className="w-5 h-5 font-bold animate-pulse" />
            </motion.div>

            {/* The Swimming Fish just ahead of the thumb */}
            <motion.div
              style={{ opacity: fishOpacity, x: 25 }}
              className="absolute left-full pointer-events-none text-cyan-200 drop-shadow-[0_2px_8px_rgba(34,211,238,0.4)] font-bold text-lg animate-wiggle"
            >
              🐟
            </motion.div>
          </motion.div>
        )}

        {/* Success Splash Indicator */}
        {isSuccess && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute left-3 w-11 h-11 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center z-20"
          >
            <CheckCircle2 className="w-6 h-6" />
          </motion.div>
        )}
      </div>

      {/* Minimal Screen Reader Accessibility notice */}
      <p className="text-[10px] text-slate-400/80 font-mono text-center">
        💡 Accessibility: Swipe the bubble to trigger, or press the <span className="text-cyan-400 font-bold">"Click bypass"</span> button to verify.
      </p>
    </div>
  );
}

/**
 * 5. FLUID LIQUID PAGINATION INDICATORS
 * Mimics organic water droplets that dynamically stretch and merge when transitioning
 */
interface FluidPaginationIndicatorsProps {
  total: number;
  active: number;
  onChange: (index: number) => void;
  className?: string;
}

export function FluidPaginationIndicators({
  total,
  active,
  onChange,
  className = '',
}: FluidPaginationIndicatorsProps) {
  const isReducedMotion = useReducedMotion();

  return (
    <div className={`flex justify-center items-center gap-3.5 ${className}`}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            className="relative p-1 focus:outline-none cursor-pointer"
            aria-label={`Go to page ${i + 1}`}
          >
            {/* The Liquid Droplet */}
            <motion.div
              animate={{
                width: isActive ? 24 : 8,
                height: 8,
                borderRadius: isActive ? '6px' : '9999px',
                backgroundColor: isActive ? '#06b6d4' : 'rgba(100, 116, 139, 0.4)',
              }}
              whileHover={{ scale: 1.3 }}
              transition={isReducedMotion ? { duration: 0.1 } : springBubble}
              className="shadow-sm"
            />
          </button>
        );
      })}
    </div>
  );
}

/**
 * 6. CARD EXPANSION PORTAL
 * Smoothly expands a small card preview into a rich immersive detail frame
 */
interface CardExpansionProps {
  children: React.ReactNode;
  detailContent: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function CardExpansion({ children, detailContent, isOpen, onClose, title }: CardExpansionProps) {
  const isReducedMotion = useReducedMotion();

  return (
    <>
      {/* Mini Card Target */}
      <div className="h-full">{children}</div>

      {/* Absolute Portal / Dialog overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Ocean Depth Backdrop with swipe dismiss gesture support */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md cursor-zoom-out"
            />

            {/* Expanded Screen Frame with swipe-down to dismiss */}
            <motion.div
              drag={isReducedMotion ? false : 'y'}
              dragConstraints={{ top: 0, bottom: 400 }}
              dragElastic={{ top: 0.1, bottom: 0.7 }}
              onDragEnd={(_e, info) => {
                // If dragged down past 120px, trigger close!
                if (info.offset.y > 120) {
                  onClose();
                }
              }}
              initial={isReducedMotion ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 40 }}
              transition={springOcean}
              className="bg-slate-900 border border-cyan-500/30 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl relative z-10 scrollbar-thin scrollbar-thumb-cyan-500/20"
            >
              {/* Swipe Down Drag bar handle indicator */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-700 rounded-full cursor-row-resize flex items-center justify-center">
                <div className="absolute top-1 text-[8px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 uppercase">Swipe Down</div>
              </div>

              {/* Header and Controls */}
              <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm p-5 border-b border-cyan-500/10 flex justify-between items-center z-10">
                <h3 className="font-display font-bold text-white text-base">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-slate-950 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/30 transition-colors cursor-pointer text-xs font-mono"
                >
                  ✕ Close [ESC]
                </button>
              </div>

              {/* Detail Canvas content */}
              <div className="p-6">{detailContent}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
