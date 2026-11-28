"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Pure interactive & animated Tech Groww official brand mark (derived directly from public/brand/mark.svg).
 * Zero box wrapper, zero card template — floats cleanly in the hero with smooth 3D pointer tilt,
 * gentle levitation, hover facet lift, and click growth-surge ripple.
 */
export function InteractiveHeroLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [surgeKey, setSurgeKey] = useState(0);
  const shouldReduce = useReducedMotion();

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (shouldReduce || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -ny * 20, y: nx * 24 });
  }

  function handlePointerLeave() {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  }

  function handleClick() {
    setSurgeKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={handlePointerLeave}
        className="relative flex h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] items-center justify-center select-none"
        style={{ perspective: "900px" }}
      >
        {/* Subtle architectural ambient radiance matching brand sky & cobalt */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.25)_0%,rgba(2,132,199,0.12)_45%,transparent_72%)] blur-2xl transition-opacity duration-500 ${
            hovered ? "opacity-100 scale-110" : "opacity-70 scale-100"
          }`}
        />

        {/* Click growth ripple */}
        {!shouldReduce && surgeKey > 0 && (
          <motion.div
            key={surgeKey}
            aria-hidden="true"
            initial={{ scale: 0.55, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute h-52 w-52 rounded-full border border-[var(--brand-sky)]/80"
          />
        )}

        {/* Pure interactive logo button — zero box, zero card chrome */}
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Tech Groww interactive brand mark. Tap to pulse, hover to tilt."
          animate={
            shouldReduce
              ? undefined
              : {
                  rotateX: tilt.x,
                  rotateY: tilt.y,
                  y: hovered ? -6 : [0, -8, 0],
                }
          }
          transition={{
            rotateX: { type: "spring", stiffness: 220, damping: 18 },
            rotateY: { type: "spring", stiffness: 220, damping: 18 },
            y: hovered
              ? { type: "spring", stiffness: 240, damping: 20 }
              : { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          }}
          whileTap={shouldReduce ? undefined : { scale: 0.93 }}
          style={{ transformStyle: "preserve-3d" }}
          className="group relative flex h-64 w-64 sm:h-76 sm:w-76 cursor-pointer items-center justify-center rounded-full bg-transparent focus-visible:outline-2 focus-visible:outline-[var(--brand-sky)]"
        >
          <svg
            viewBox="0 0 120 120"
            fill="none"
            className="h-full w-full drop-shadow-[0_18px_42px_rgba(2,132,199,0.38)] transition-[filter] duration-300 group-hover:drop-shadow-[0_24px_60px_rgba(56,189,248,0.55)]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="tg-hero-l" x1="60" y1="12" x2="22" y2="86" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7DD3FC" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id="tg-hero-r" x1="60" y1="12" x2="98" y2="86" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="45%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="tg-hero-wl" x1="12" y1="96" x2="60" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0369A1" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="tg-hero-wr" x1="60" y1="70" x2="108" y2="96" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>

            {/* Upper Delta Arrowhead — surges upward on hover/click */}
            <motion.g
              animate={
                shouldReduce
                  ? undefined
                  : {
                      y: hovered ? -3.5 : 0,
                      scale: surgeKey > 0 ? [1, 1.05, 1] : 1,
                    }
              }
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <polygon points="60,12 20,76 42,76 60,54" fill="url(#tg-hero-l)" />
              <polygon points="60,12 100,76 78,76 60,54" fill="url(#tg-hero-r)" />
              <polygon points="60,54 42,76 60,68" fill="#0369A1" opacity="0.92" />
              <polygon points="60,54 78,76 60,68" fill="#0284C7" />
            </motion.g>

            {/* Lower Splayed Growth Wings — subtle counterweight expansion */}
            <motion.g
              animate={
                shouldReduce
                  ? undefined
                  : {
                      y: hovered ? 2.5 : 0,
                    }
              }
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <polygon points="60,68 42,76 8,96 28,96 60,78" fill="url(#tg-hero-wl)" />
              <polygon points="60,68 78,76 112,96 92,96 60,78" fill="url(#tg-hero-wr)" />
            </motion.g>
          </svg>
        </motion.button>
      </div>

      {/* Subtle interaction cue below the mark */}
      <span className="mt-2 text-[11px] font-medium tracking-wide text-slate-400/80">
        ✨ Interactive mark · Move pointer or tap to pulse
      </span>
    </div>
  );
}
