"use client";

import React, { ReactNode, ElementType } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  as?: ElementType;
}

/**
 * Scroll-reveal wrapper. Uses CSS-only animation (no JS motion lib overhead).
 * Pairs with .reveal-on-scroll styles in globals.css.
 * prefers-reduced-motion: immediately visible (no animation).
 */
export function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  as: Tag = "div",
}: AnimatedSectionProps) {
  const ref = useScrollReveal<HTMLDivElement>();
  const dirClass =
    direction === "up"
      ? "reveal-up"
      : direction === "left"
      ? "reveal-left"
      : direction === "right"
      ? "reveal-right"
      : "reveal-fade";

  return (
    <Tag
      ref={ref}
      className={`reveal-on-scroll ${dirClass} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
