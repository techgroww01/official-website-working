"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Server, ShieldCheck, Database, LayoutGrid, CheckCircle2 } from "lucide-react";

interface LayerInfo {
  id: string;
  number: string;
  name: string;
  tech: string;
  status: string;
  highlight: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LAYERS: LayerInfo[] = [
  {
    id: "client",
    number: "01",
    name: "Client & Presentation",
    tech: "Next.js 16 · React 19 · Tailwind v4 · PWA",
    status: "Active · Edge Cached",
    highlight: "Sub-50ms TTFB across regional edge points with strict WCAG 2.2 AA accessibility.",
    icon: LayoutGrid,
  },
  {
    id: "security",
    number: "02",
    name: "Multi-Portal RBAC Core",
    tech: "NextAuth v5 · JWT Sessions · CSRF · DPDP",
    status: "Guarded · Zero-Trust",
    highlight: "5 isolated enterprise portals (Client, Intern, Sales, Recruiter, Admin) with granular RLS.",
    icon: ShieldCheck,
  },
  {
    id: "workflows",
    number: "03",
    name: "Workflows & Integrations",
    tech: "Salesforce OmniStudio · Webhooks · REST APIs",
    status: "Synchronized",
    highlight: "Bidirectional enterprise sync for CRM leads, custom business objects, and approval pipelines.",
    icon: Server,
  },
  {
    id: "data",
    number: "04",
    name: "Data Engine & Cloud",
    tech: "PostgreSQL · Redis Cache · Docker · Automated CI",
    status: "Encrypted at Rest",
    highlight: "Normalized schemas, ACID compliance, signed private media vaults, and daily immutable backups.",
    icon: Database,
  },
];

export function ArchitectureVisualizer() {
  const [activeLayer, setActiveLayer] = useState<string>("security");
  const shouldReduce = useReducedMotion();
  const current = LAYERS.find((l) => l.id === activeLayer) ?? LAYERS[1]!;

  return (
    <div className="relative w-full max-w-md lg:max-w-none">
      {/* Outer ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[var(--brand-royal)]/20 via-[var(--brand-sky)]/15 to-transparent blur-xl"
      />

      {/* Main Glass Console Card */}
      <div className="relative rounded-2xl border border-white/15 bg-[#0B1528]/90 p-5 shadow-2xl backdrop-blur-md">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono-tech text-[11px] text-slate-400">
              techgroww_architecture.live
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono-tech text-[10px] text-[var(--brand-sky)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>99.98% SLA</span>
          </div>
        </div>

        {/* Stack Layers List */}
        <div className="mt-4 space-y-2" role="tablist" aria-label="System Architecture Layers">
          {LAYERS.map((layer) => {
            const isSelected = layer.id === activeLayer;
            const Icon = layer.icon;

            return (
              <button
                key={layer.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveLayer(layer.id)}
                className={`group flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-[var(--brand-sky)]/50 bg-[var(--brand-sky)]/[0.08] shadow-sm"
                    : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      isSelected
                        ? "border-[var(--brand-sky)]/40 bg-[var(--brand-sky)]/20 text-[var(--brand-sky)]"
                        : "border-white/10 bg-white/5 text-slate-400 group-hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tech text-[10px] font-semibold text-slate-400">
                        {layer.number}
                      </span>
                      <span className="font-display text-xs sm:text-sm font-semibold text-white">
                        {layer.name}
                      </span>
                    </div>
                    <p className="font-mono-tech text-[11px] text-slate-400 line-clamp-1">
                      {layer.tech}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end">
                  <span
                    className={`font-mono-tech text-[10px] ${
                      isSelected ? "text-[var(--brand-sky)] font-medium" : "text-slate-500"
                    }`}
                  >
                    {layer.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Layer Deep Dive Preview Box */}
        <div className="mt-4 rounded-xl border border-white/10 bg-[#070D19]/80 p-3.5">
          <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span className="flex items-center gap-1.5 text-[var(--brand-sky)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Layer {current.number} Verified</span>
            </span>
            <span>Latency: &lt;45ms</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            {current.highlight}
          </p>
        </div>

        {/* Footer Metrics Hairline Bar */}
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] font-mono-tech text-slate-400">
          <span>Framework: Next.js 16 + React 19</span>
          <span className="text-[var(--brand-sky)]">Verified Zero Fake Claims</span>
        </div>
      </div>
    </div>
  );
}
