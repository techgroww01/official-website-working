"use client";

import React from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

export interface PortalViewTransitionProps {
  children: React.ReactNode;
  transitionKey?: string;
  mode?: "view" | "tab";
  className?: string;
}

export type PortalTransitionProps = PortalViewTransitionProps;

const ARCHITECTURAL_EASE = [0.16, 1, 0.3, 1] as const;

export function PortalViewTransition({
  children,
  transitionKey,
  mode = "view",
  className,
}: PortalViewTransitionProps) {
  return (
    <MotionConfig reducedMotion="user">
      {mode === "tab" && transitionKey !== undefined ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={transitionKey}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: ARCHITECTURAL_EASE }}
            className={className}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          key={transitionKey}
          initial={{ opacity: 0.92, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16, ease: ARCHITECTURAL_EASE }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </MotionConfig>
  );
}

export const PortalTransition = PortalViewTransition;
