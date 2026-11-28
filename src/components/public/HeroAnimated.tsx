"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { ArrowUpRight, MessageCircle, Phone, Mail, Sparkles, Check } from "lucide-react";
import { COMPANY_CONFIG } from "@/lib/company-config";

const HIGHLIGHTS = [
  {
    value: "Greater Noida HQ",
    label: "Delhi NCR Studio",
    desc: "Serving ambitious businesses across India & worldwide",
  },
  {
    value: "100% Direct",
    label: "Talk to Builders",
    desc: "No middlemen or account managers translating your ideas",
  },
  {
    value: "6 Capabilities",
    label: "End-to-End Delivery",
    desc: "Websites, Mobile Apps, UI/UX & Smart Business Systems",
  },
];

/**
 * Catchy, plain-English Hero section with zero jargon and effortless contact options.
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
        delayChildren: shouldReduce ? 0 : 0.04,
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
        {/* Friendly Location & Status Eyebrow Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-sky)]/30 bg-[var(--brand-sky)]/10 px-3.5 py-1.5 text-xs font-medium text-[var(--brand-sky)]"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>Greater Noida, Delhi NCR · Websites, Mobile Apps &amp; Custom Software</span>
        </motion.div>

        {/* H1 Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-display mt-4 text-[clamp(2.4rem,5.2vw,4.2rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white"
        >
          Technology that{" "}
          <span className="bg-gradient-to-r from-white via-sky-200 to-[var(--brand-sky)] bg-clip-text text-transparent">
            drives growth.
          </span>
        </motion.h1>

        {/* Plain-English Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300 font-normal"
        >
          We build simple, fast websites, mobile apps, and business software tailored to help
          your company grow — with personal, friendly guidance from our Greater Noida studio.
        </motion.p>

        {/* Clear Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-7 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/contact"
            className="group inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] bg-white px-7 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_2px_12px_rgba(255,255,255,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[0_4px_20px_rgba(56,189,248,0.35)] motion-reduce:transform-none"
          >
            <span>Start a project</span>
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </Link>

          <Link
            href="/contact?service=consultation"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-500/40 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 motion-reduce:transform-none"
          >
            <MessageCircle className="h-4 w-4 text-emerald-200" aria-hidden="true" />
            <span>Direct Project Inquiry</span>
          </Link>

          <a
            href={`mailto:${COMPANY_CONFIG.emails.general}`}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-[var(--radius-pill)] border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 hover:border-white/50 hover:text-white transition-colors"
          >
            <Mail className="h-4 w-4 text-[var(--brand-sky)]" aria-hidden="true" />
            <span>{COMPANY_CONFIG.emails.general}</span>
          </a>
        </motion.div>

        {/* Direct Email & Inquiry Strip */}
        <motion.div
          variants={itemVariants}
          className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-300"
        >
          <a
            href={`mailto:${COMPANY_CONFIG.emails.general}`}
            className="inline-flex min-h-[36px] items-center gap-1.5 hover:text-[var(--brand-sky)] transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-[var(--brand-sky)]" aria-hidden="true" />
            <span>Email us: {COMPANY_CONFIG.emails.general}</span>
          </a>
          <span className="hidden sm:inline text-white/25" aria-hidden="true">|</span>
          <span className="inline-flex items-center gap-1.5 text-slate-400">
            <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span>Free consultation · Response within 2 hours</span>
          </span>
        </motion.div>

        {/* 3-Card Balanced Plain-English Trust Strip */}
        <motion.div
          variants={itemVariants}
          className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 pt-6"
        >
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.value}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-xs transition-colors hover:border-[var(--brand-sky)]/30 hover:bg-white/[0.06]"
            >
              <div className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                {h.value}
              </div>
              <div className="text-xs font-semibold text-[var(--brand-sky)] mt-0.5">
                {h.label}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {h.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
