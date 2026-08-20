'use client';

import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface AnimatedBackgroundProps {
  /** Optional horizontal shift from mobile carousel drag gestures */
  swipeOffset?: number;
}

export function AnimatedBackground({ swipeOffset = 0 }: AnimatedBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();

  // Desktop Mouse Pointer Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Eased spring motion for desktop pointer parallax (~15px max offset)
  const springConfig = { damping: 30, stiffness: 150, mass: 0.5 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  // Vertical Scroll Parallax
  const { scrollY } = useScroll();
  const scrollBgY = useTransform(scrollY, [0, 1200], [0, -80]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Map pointer x/y to [-15px, +15px]
      const offsetX = ((e.clientX / innerWidth) - 0.5) * 30;
      const offsetY = ((e.clientY / innerHeight) - 0.5) * 30;
      mouseX.set(offsetX);
      mouseY.set(offsetY);
    };

    window.addEventListener('mousemove', handlePointerMove);
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, [mouseX, mouseY, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 via-slate-950 to-teal-950/20 opacity-80" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-slate-950">
      {/* Scroll & Pointer Parallax Container */}
      <motion.div
        style={{
          x: parallaxX,
          y: scrollBgY,
        }}
        animate={{
          x: swipeOffset ? swipeOffset * 0.15 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Blob 1: Nature Emerald Light (Top Left) */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-600/15 blur-[120px]"
        />

        {/* Blob 2: Deep Cyan Light (Top Right) */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute -top-20 -right-20 w-[30rem] h-[30rem] rounded-full bg-cyan-600/15 blur-[140px]"
        />

        {/* Blob 3: Climate Teal Glow (Center Bottom) */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 15, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className="absolute bottom-10 left-1/3 w-[28rem] h-[28rem] rounded-full bg-teal-500/10 blur-[130px]"
        />
      </motion.div>

      {/* Subtle Grain Overlay Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />
    </div>
  );
}
