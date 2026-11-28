"use client";

import { useEffect, useRef, RefObject } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Lightweight IntersectionObserver scroll-reveal hook.
 * Adds `data-revealed="true"` to the element when in viewport.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { threshold = 0.12, rootMargin = "0px 0px -60px 0px", once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          el.setAttribute("data-revealed", "true");
          if (once) obs.disconnect();
        } else if (!once) {
          el.removeAttribute("data-revealed");
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}
