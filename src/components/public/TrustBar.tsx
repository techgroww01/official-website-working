"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedSection } from "@/components/public/AnimatedSection";

interface TrustBarProps {
  items: {
    icon: React.ReactNode;
    label: string;
    sub: string;
  }[];
}

/**
 * Animated trust / differentiator bar with staggered reveal.
 * Inspired by pele.run minimal feature bars.
 */
export function TrustBar({ items }: TrustBarProps) {
  const shouldReduce = useReducedMotion();

  return (
    <section
      aria-label="Why Tech Groww"
      className="border-y border-[var(--line)] bg-white py-10"
    >
      <div className="container-arch">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <AnimatedSection key={item.label} delay={i * 80} className="flex items-start gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--paper-elevated)] text-[var(--brand-cobalt)]">
                {item.icon}
              </span>
              <div>
                <p className="font-display text-sm font-bold text-[var(--ink)]">{item.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-muted)]">{item.sub}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
