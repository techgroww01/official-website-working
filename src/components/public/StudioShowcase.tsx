"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, ArrowUpRight, MessageCircle, Phone, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { COMPANY_CONFIG } from "@/lib/company-config";

const GALLERY = [
  {
    src: "/images/client-consultation.jpg",
    title: "Client Consultation & Strategy",
    location: "Greater Noida Studio",
    desc: "Sit down with our makers over chai to map out your software, website, or mobile app from day one.",
    tag: "Direct Consultation",
  },
  {
    src: "/images/team-strategy.jpg",
    title: "Clear Roadmaps, No Jargon",
    location: "Delhi NCR HQ",
    desc: "Every milestone, feature, and timeline planned honestly so you always know what is being built and when.",
    tag: "Milestone Planning",
  },
  {
    src: "/images/studio-collaboration.jpg",
    title: "User-Friendly Design",
    location: "Design Lab",
    desc: "Intuitive screens and flows that your customers and staff can pick up in seconds without a user manual.",
    tag: "UI/UX Design",
  },
  {
    src: "/images/product-workspace.jpg",
    title: "Fast, Reliable Software",
    location: "Engineering Room",
    desc: "Clean code that loads fast, stays secure, and easily scales as your business grows.",
    tag: "Web & Portals",
  },
];

export function StudioShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const shouldReduce = useReducedMotion();

  function togglePlay() {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }

  return (
    <section className="section-rhythm surface-light border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="container-arch">
        {/* Section Header with warm Indian touch */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800">
              <span className="text-sm">🇮🇳</span>
              <span>Rooted in Greater Noida, Uttar Pradesh</span>
            </div>
            <h2 className="font-display mt-3 text-3xl font-extrabold text-[var(--ink)] sm:text-5xl tracking-tight">
              Real craft. Real people. Honest delivery.
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--text-muted)]">
              We are a hands-on digital engineering studio in Delhi NCR. No layers of account managers,
              no outsourced middlemen — just dedicated designers and developers who take personal pride
              in seeing your business grow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact?service=consultation"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-[var(--radius-pill)] bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Direct Studio Inquiry</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line-control)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--ink)] shadow-xs hover:border-[var(--brand-royal)] hover:text-[var(--brand-royal)] transition-colors"
            >
              <span>Book a consultation</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Video & Studio Showcase Card */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
          <div className="grid lg:grid-cols-12">
            {/* Left Column: 1080p Video Reel Player */}
            <div className="relative aspect-video lg:aspect-auto lg:col-span-7 bg-slate-900 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay={!shouldReduce}
                muted
                loop
                playsInline
                aria-label="Tech Groww Greater Noida studio showcase video"
                poster="/images/team-strategy.jpg"
                className="h-full w-full object-cover"
              >
                <source src="/videos/studio-showcase.mp4" type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>

              {/* Video Overlay Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-white border border-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span>Inside Tech Groww Studio</span>
              </div>

              {/* Accessible Play/Pause Control (WCAG 2.2.2) */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause studio showcase video" : "Play studio showcase video"}
                className="absolute bottom-4 right-4 z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/70 backdrop-blur-md text-white transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-white"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Right Column: Studio Highlights & Hospitality */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 bg-[var(--paper-elevated)]">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-link)] uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Greater Noida, Uttar Pradesh</span>
                </div>
                <h3 className="font-display mt-2 text-2xl font-bold text-[var(--ink)] sm:text-3xl">
                  Friendly collaboration, clear answers.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  Whether you are starting a new company, modernizing a family business, or scaling
                  an established enterprise, you can talk to us directly without tech jargon.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-white p-3.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-[var(--ink)]">Direct Team Communication</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Speak directly with the makers — no ticketing queues or automated runaround.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-white p-3.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-[var(--ink)]">Transparent Pricing</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Itemized proposals in plain English with realistic delivery dates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-white p-3.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-[var(--ink)]">Complete Post-Launch Care</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        We teach your team how to manage your website or app and stay on standby.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[var(--line)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  Have an idea? Let&apos;s talk over chai.
                </span>
                <Link
                  href="/contact"
                  className="text-xs font-bold text-[var(--brand-link)] hover:underline inline-flex items-center gap-1"
                >
                  Contact Studio <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Image Editorial Gallery Grid with Indian Touch */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GALLERY.map((item, idx) => (
            <div
              key={item.title}
              className="group tg-card-tactile overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-xs hover:border-[var(--brand-royal)] flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 rounded-md bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-white">
                  {item.tag}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-display text-base font-bold text-[var(--ink)] group-hover:text-[var(--brand-royal)] transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--line)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span>{item.location}</span>
                  <span className="text-emerald-700 font-semibold">Active Studio</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
