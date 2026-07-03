"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useAppStore } from "@/store/app-store";
import { notifications as initial } from "@/lib/mock-data";
import type { NoticeType, NotificationItem } from "@/lib/types";
import {
  Bell, AlertTriangle, CalendarOff, BookOpen, Wallet, PartyPopper,
  CheckCheck, Filter, Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format, formatDistanceToNow, parseISO } from "date-fns";

const typeConfig: Record<NoticeType, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  emergency: { icon: AlertTriangle, color: "text-rose-600 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-400 border-rose-200 dark:border-rose-500/30", label: "Emergency" },
  holiday:   { icon: CalendarOff,   color: "text-violet-600 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-400 border-violet-200 dark:border-violet-500/30", label: "Holiday" },
  homework:  { icon: BookOpen,      color: "text-teal-600 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-400 border-teal-200 dark:border-teal-500/30", label: "Homework" },
  fee:       { icon: Wallet,        color: "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400 border-amber-200 dark:border-amber-500/30", label: "Fee" },
  general:   { icon: PartyPopper,   color: "text-sky-600 bg-sky-50 dark:bg-sky-500/15 dark:text-sky-400 border-sky-200 dark:border-sky-500/30", label: "General" },
};

const filters: { id: NoticeType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "emergency", label: "Emergency" },
  { id: "holiday", label: "Holiday" },
  { id: "homework", label: "Homework" },
  { id: "fee", label: "Fee" },
  { id: "general", label: "General" },
];

export function NotificationsPage() {
  const { role } = useAppStore();
  const [items, setItems] = useState<NotificationItem[]>(initial);
  const [filter, setFilter] = useState<NoticeType | "all">("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((n) => {
      const typeMatch = filter === "all" || n.type === filter;
      const readMatch = !unreadOnly || !n.read;
      const audienceMatch = n.audience === "all" || (role && n.audience.includes(role));
      return typeMatch && readMatch && audienceMatch;
    });
  }, [items, filter, unreadOnly, role]);

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const toggleRead = (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Notices"
        description="Stay updated with school announcements, homework reminders, fee alerts and emergency notices."
        icon={<Bell className="h-5 w-5" />}
        actions={
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total", value: items.length, icon: Megaphone, accent: "text-sky-600 bg-sky-50 dark:bg-sky-500/15 dark:text-sky-400" },
          { label: "Unread", value: unreadCount, icon: Bell, accent: "text-rose-600 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-400" },
          { label: "Emergency", value: items.filter(n => n.type === "emergency").length, icon: AlertTriangle, accent: "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400" },
          { label: "This Week", value: items.filter(n => Date.now() - parseISO(n.date).getTime() < 7 * 86400000).length, icon: CalendarOff, accent: "text-violet-600 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-semibold mt-1">{s.value}</p>
                </div>
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", s.accent)}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-muted/60 text-muted-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button
          variant={unreadOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setUnreadOnly(!unreadOnly)}
        >
          <Filter className="mr-1.5 h-3.5 w-3.5" />
          {unreadOnly ? "Showing unread" : "Unread only"}
        </Button>
      </div>

      {/* Notices list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-5 w-5" />}
          title="No notifications"
          description="You're all caught up! New notices will appear here."
          className="border rounded-xl"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const cfg = typeConfig[n.type];
            const Icon = cfg.icon;
            return (
              <Card
                key={n.id}
                className={cn(
                  "overflow-hidden transition-all hover:shadow-md",
                  !n.read && "ring-1 ring-primary/20"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border", cfg.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h3 className="text-sm font-semibold leading-snug">{n.title}</h3>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                          </div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Badge variant="outline" className={cn("text-[10px] font-medium", cfg.color)}>
                              {cfg.label}
                            </Badge>
                            {n.priority === "high" && (
                              <Badge variant="secondary" className="text-[10px] bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400">
                                High Priority
                              </Badge>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {formatDistanceToNow(parseISO(n.date), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{n.message}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-[11px] text-muted-foreground">
                          {format(parseISO(n.date), "dd MMM yyyy, h:mm a")}
                        </span>
                        <button
                          onClick={() => toggleRead(n.id)}
                          className="text-[11px] font-medium text-primary hover:underline"
                        >
                          {n.read ? "Mark unread" : "Mark read"}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
