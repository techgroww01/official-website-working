"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import {
  ArcSpinner,
  PortalEmptyState,
  PortalStatusDot,
  PortalTableSkeleton,
  PortalViewTransition,
} from "@/components/portal";

interface NotificationItem {
  id: string;
  portal: string | null;
  title: string;
  body: string | null;
  link_href: string | null;
  read_at: string | null;
  created_at: string;
}

type FilterMode = "all" | "unread";

export function NotificationsClient() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [markingIds, setMarkingIds] = useState<Set<string>>(new Set());
  const [markingAll, setMarkingAll] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const res = await fetch("/api/v1/notifications?limit=50", {
          cache: "no-store",
        });
        const json = (await res.json()) as {
          ok?: boolean;
          data?: {
            notifications?: NotificationItem[];
            unreadCount?: number;
            demoMode?: boolean;
          };
          error?: { message?: string };
        };

        if (cancelled) return;

        if (!res.ok || !json.ok) {
          setErrorMsg(json.error?.message || "Failed to load notifications.");
          setNotifications([]);
          setUnreadCount(0);
        } else {
          const list = json.data?.notifications ?? [];
          setNotifications(list);
          setUnreadCount(
            typeof json.data?.unreadCount === "number"
              ? json.data.unreadCount
              : list.filter((n) => !n.read_at).length
          );
          setDemoMode(Boolean(json.data?.demoMode));
        }
      } catch {
        if (!cancelled) {
          setErrorMsg("Network error loading notifications.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  async function markRead(ids: string[]) {
    if (ids.length === 0) return;
    setErrorMsg(null);
    if (ids.length > 1) {
      setMarkingAll(true);
    } else {
      setMarkingIds((prev) => new Set(prev).add(ids[0]!));
    }

    try {
      const res = await fetch("/api/v1/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: ids }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: { message?: string };
      };
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error?.message || "Unable to mark notifications as read.");
        return;
      }

      const nowIso = new Date().toISOString();
      const idSet = new Set(ids);
      const newlyReadCount = notifications.filter(
        (item) => idSet.has(item.id) && !item.read_at
      ).length;
      setNotifications((prev) =>
        prev.map((item) =>
          idSet.has(item.id) && !item.read_at
            ? { ...item, read_at: nowIso }
            : item
        )
      );
      if (newlyReadCount > 0) {
        setUnreadCount((prev) => Math.max(0, prev - newlyReadCount));
      }
    } catch {
      setErrorMsg("Network error updating notifications.");
    } finally {
      setMarkingAll(false);
      setMarkingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }
  }

  const visibleItems =
    filter === "unread"
      ? notifications.filter((n) => !n.read_at)
      : notifications;
  const unreadIds = notifications.filter((n) => !n.read_at).map((n) => n.id);

  return (
    <div className="space-y-6">
      {demoMode && (
        <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--portal-surface)] px-4 py-3 text-xs text-[var(--text-muted)]">
          Live notification storage requires a configured Supabase database connection. Activity updates will appear here once connected.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter notifications"
          className="inline-flex rounded-[var(--radius-pill)] border border-[var(--line-control)] bg-[var(--portal-surface)] p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            onClick={() => setFilter("all")}
            className={`min-h-[36px] rounded-[var(--radius-pill)] px-4 text-xs font-semibold transition-colors ${
              filter === "all"
                ? "bg-[var(--brand-royal)] text-white"
                : "text-[var(--text-muted)] hover:text-[var(--ink)]"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === "unread"}
            onClick={() => setFilter("unread")}
            className={`min-h-[36px] rounded-[var(--radius-pill)] px-4 text-xs font-semibold transition-colors ${
              filter === "unread"
                ? "bg-[var(--brand-royal)] text-white"
                : "text-[var(--text-muted)] hover:text-[var(--ink)]"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <button
          type="button"
          disabled={unreadIds.length === 0 || markingAll || loading}
          onClick={() => void markRead(unreadIds)}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line-control)] bg-[var(--portal-surface)] px-4 py-2 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--brand-cobalt)] hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {markingAll ? (
            <ArcSpinner size="sm" label="Marking all notifications read" />
          ) : (
            <CheckCheck className="h-3.5 w-3.5 text-[var(--brand-royal)]" />
          )}
          <span>Mark all as read</span>
        </button>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="rounded-[var(--radius-sm)] border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-[var(--status-danger)]"
        >
          {errorMsg}
        </div>
      )}

      {loading ? (
        <PortalTableSkeleton rows={4} />
      ) : (
        <PortalViewTransition mode="tab" transitionKey={filter}>
          {visibleItems.length === 0 ? (
            <PortalEmptyState
              variant="notifications"
              icon={Bell}
              badge={filter === "unread" ? "STATE · ALL_READ" : "STATE · INBOX_CLEAR"}
              title={
                filter === "unread"
                  ? "All caught up"
                  : "No notifications yet"
              }
              description={
                filter === "unread"
                  ? "Every notification across your accessible Tech Groww portals has been marked as read."
                  : "Workspace alerts for approvals, deliverables, interviews, and cohort tasks will appear here."
              }
              action={
                filter === "unread" && notifications.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className="min-h-[40px] rounded-[var(--radius-pill)] bg-[var(--brand-royal)] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1e40af]"
                  >
                    View all notifications
                  </button>
                ) : undefined
              }
            />
          ) : (
            <ul className="divide-y divide-[var(--line)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line-control)] bg-[var(--portal-surface)] shadow-xs">
              {visibleItems.map((item) => {
                const isUnread = !item.read_at;
                const isMarking = markingIds.has(item.id);
                const safeHref =
                  item.link_href &&
                  item.link_href.startsWith("/") &&
                  !item.link_href.startsWith("//") &&
                  !item.link_href.startsWith("/\\")
                    ? item.link_href
                    : null;

                return (
                  <li
                    key={item.id}
                    className={`flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-start ${
                      isUnread ? "bg-sky-50/40" : "bg-[var(--portal-surface)]"
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <PortalStatusDot
                          tone={isUnread ? "info" : "neutral"}
                          pulse={isUnread}
                          label={isUnread ? "Unread" : "Read"}
                        />
                        {item.portal && (
                          <span className="rounded-full border border-[var(--line)] bg-[var(--portal-bg)] px-2.5 py-0.5 font-mono-tech text-[10px] font-semibold text-[var(--text-muted)] uppercase">
                            {item.portal}
                          </span>
                        )}
                        <time
                          dateTime={item.created_at}
                          className="font-mono-tech text-[11px] text-[var(--text-muted)] tabular-nums"
                        >
                          {new Date(item.created_at).toLocaleString()}
                        </time>
                      </div>

                      <h2 className="font-display text-sm font-bold text-[var(--ink)]">
                        {item.title}
                      </h2>

                      {item.body && (
                        <p className="text-sm text-[var(--text-muted)]">
                          {item.body}
                        </p>
                      )}

                      {safeHref && (
                        <div className="pt-1">
                          <Link
                            href={safeHref}
                            className="inline-flex text-xs font-semibold text-[var(--brand-link)] hover:underline"
                          >
                            Open workspace item
                          </Link>
                        </div>
                      )}
                    </div>

                    {isUnread && (
                      <button
                        type="button"
                        disabled={isMarking}
                        onClick={() => void markRead([item.id])}
                        className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--line-control)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--brand-cobalt)] hover:bg-stone-50 disabled:opacity-50"
                      >
                        {isMarking && <ArcSpinner size="sm" label="Marking read" />}
                        <span>Mark read</span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </PortalViewTransition>
      )}
    </div>
  );
}
