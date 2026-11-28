"use client";

import React from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";

const STATS = [
  {
    value: "2026",
    label: "Founded in Greater Noida",
    desc: "Delhi NCR Engineering Studio",
  },
  {
    value: "6",
    label: "Core Disciplines",
    desc: "Web, Mobile, Salesforce & Cloud",
  },
  {
    value: "100%",
    label: "Principal Access",
    desc: "Engineers who build your product",
  },
];

/**
 * Editorial Dark Ink Hero with modern typography, calibrated spacing, and zero layout shift.
 */
export function HeroAnimated() {
  const shouldReduce = useReducedMotion();

  const baseTransition: Transition = {
    duration: 0.5,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.08,
        delayChildren: shouldReduce ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduce ? {} : { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: baseTransition },
  };

  return (
    <div className="relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Sleek Status Eyebrow Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-sky)]/30 bg-[var(--brand-sky)]/10 px-3.5 py-1 text-xs font-mono-tech text-[var(--brand-sky)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>GREATER NOIDA HQ · ENGINEERING STUDIO</span>
        </motion.div>

        {/* H1 Heading */}
        <motion.h1
          variants={itemVariants}
          className="font-display mt-5 text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white"
        >
          Technology that{" "}
          <span className="bg-gradient-to-r from-white via-sky-200 to-[var(--brand-sky)] bg-clip-text text-transparent">
            drives growth.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300 font-normal"
        >
          Engineering custom web applications, mobile platforms, and Salesforce
          workflows around real business bottlenecks — direct principal accountability
          from initial architecture to production support.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <a
            href="/contact"
            className="group inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] bg-white px-7 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_4px_16px_rgba(255,255,255,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[0_2px_6px_rgba(0,0,0,0.15),0_8px_24px_rgba(56,189,248,0.3)] motion-reduce:transform-none"
          >
            <span>Start a project</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
          </a>
          <a
            href="#services-blueprint"
            className="group inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] border border-white/25 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white backdrop-blur-xs transition-colors hover:border-white hover:bg-white/10"
          >
            <span>Explore blueprint</span>
            <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
          </a>
        </motion.div>

        {/* 3-Card Balanced Architectural Specs Grid */}
        <motion.div
          variants={itemVariants}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 border-t border-white/10 pt-8"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xs transition-colors hover:border-[var(--brand-sky)]/30 hover:bg-white/[0.05]"
            >
              <div className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 font-mono-tech text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-sky)]">
                {stat.label}
              </div>
              <div className="mt-0.5 text-xs text-slate-400 leading-snug">
                {stat.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
