"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";

interface StatCounterProps {
  value: string;
  label: string;
  delay?: number;
}

function StatCounter({ value, label, delay = 0 }: StatCounterProps) {
  const shouldReduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), shouldReduce ? 0 : delay);
    return () => clearTimeout(t);
  }, [delay, shouldReduce]);

  const transition: Transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={transition}
      className="flex flex-col"
    >
      <span className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {value}
      </span>
      <span className="mt-1 font-mono-tech text-xs tracking-widest text-slate-400 uppercase">
        {label}
      </span>
    </motion.div>
  );
}

/**
 * Animated hero with architectural grid background, staggered text reveal.
 */
export function HeroAnimated() {
  const shouldReduce = useReducedMotion();

  const baseTransition: Transition = {
    duration: 0.55,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.085,
        delayChildren: shouldReduce ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduce ? {} : { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: baseTransition },
  };

  return (
    <div className="relative overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <motion.p variants={itemVariants} className="eyebrow text-[var(--brand-sky)] font-medium tracking-[0.2em]">
          Greater Noida, Uttar Pradesh · Engineering Studio
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="font-display mt-4 text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white"
        >
          Technology that
          <br />
          <span className="text-white">drives growth.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-xl text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-slate-300 font-normal"
        >
          Engineering software, Salesforce workflows, and digital products around
          real business bottlenecks — direct principal accountability from scope to
          support.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <a
            href="/contact"
            className="group inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] bg-white px-7 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_4px_16px_rgba(255,255,255,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[0_2px_6px_rgba(0,0,0,0.15),0_8px_24px_rgba(56,189,248,0.3)] motion-reduce:transform-none"
          >
            Start a project
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true">
              <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#services-blueprint"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] border border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xs transition-colors hover:border-white hover:bg-white/10"
          >
            Explore blueprint
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M8 3H13M13 3V8M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>

        <motion.dl
          variants={itemVariants}
          className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6"
        >
          <StatCounter value="2026" label="Established" delay={400} />
          <StatCounter value="Delhi NCR" label="Greater Noida HQ" delay={500} />
          <StatCounter value="6 Disciplines" label="Full-Stack & Cloud" delay={600} />
        </motion.dl>
      </motion.div>
    </div>
  );
}
