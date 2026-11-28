"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ensures clean scroll positioning across route transitions and tab changes:
 * - Automatically resets scroll position to the top on page navigation (unless an anchor hash is present).
 * - Prevents background tab restoration from jumping straight to the footer.
 */
export function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    // If there's an anchor hash (e.g. #services-blueprint), let the browser or element scroll to it
    if (typeof window === "undefined") return;

    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  useEffect(() => {
    // Handle tab switching visibility changes to prevent footer focus leaps
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // If no element was intentionally focused, keep scroll intact
        const active = document.activeElement;
        if (active && (active.tagName === "INPUT" || active.tagName === "BUTTON")) {
          // Check if active element is inside footer when user didn't explicitly interact
          const isFooter = active.closest("footer");
          if (isFooter && !window.location.hash) {
            (active as HTMLElement).blur();
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
