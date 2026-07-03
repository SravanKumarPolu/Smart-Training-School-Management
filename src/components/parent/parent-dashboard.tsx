"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import { AttendanceBadge, FeeBadge } from "@/components/shared/status-badges";
import { useAppStore } from "@/store/app-store";
import {
  students, getClassById, dailyActivities, homeworks, fees, notifications,
  attendanceTrend,
} from "@/lib/mock-data";
import {
  CalendarCheck, BookOpen, Wallet, Bell, ArrowRight, Clock,
  Activity, Cake, Droplet, Phone, MapPin, AlertTriangle, PartyPopper,
  CalendarOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, ResponsiveContainer, Tooltip,
} from "recharts";
import { format, formatDistanceToNow, parseISO } from "date-fns";

const activityColor: Record<string, string> = {
  class:    "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400",
  break:    "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400",
  activity: "text-violet-600 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-400",
  meal:     "text-rose-600 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-400",
  event:    "text-sky-600 bg-sky-50 dark:bg-sky-500/15 dark:text-sky-400",
};

const noticeIcon = {
  holiday: CalendarOff, homework: BookOpen, fee: Wallet,
  emergency: AlertTriangle, general: PartyPopper,
};
const noticeColor = {
  holiday: "text-violet-600 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-400",
  homework: "text-teal-600 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-400",
  fee: "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400",
  emergency: "text-rose-600 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-400",
  general: "text-sky-600 bg-sky-50 dark:bg-sky-500/15 dark:text-sky-400",
};

export function ParentDashboard() {
  const { userName, isLoading, setView } = useAppStore();

  if (isLoading) return <DashboardSkeleton />;

  // Parent (Meera Iyer) has 2 children: Aarav (s-01, UKG) and Diya (s-02, Nursery)
  const myChildren = [students[0], students[1]];
  const primary = myChildren[0]; // Aarav
  const cls = getClassById(primary.classId);
  const childFees = fees.filter(f => f.studentId === primary.id);
  const childHomework = homeworks.filter(h => h.classId === primary.classId);
  const activities = dailyActivities.filter(a => a.studentId === primary.id);
  const childNotices = notifications.slice(0, 4);

  const dueFees = childFees.filter(f => f.status !== "paid");
  const totalDue = dueFees.reduce((a, f) => a + (f.amount - f.paidAmount), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${userName?.split(" ")[0] ?? "Parent"} 👋`}
        description={`Here's an update on ${myChildren.map(c => c.name.split(" ")[0]).join(" & ")} for today, ${format(new Date(), "dd MMMM yyyy")}.`}
      />

      {/* Children selector cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {myChildren.map((child) => {
          const c = getClassById(child.classId);
          const cf = fees.filter(f => f.studentId === child.id);
          const due = cf.filter(f => f.status !== "paid").reduce((a, f) => a + (f.amount - f.paidAmount), 0);
          return (
            <Card key={child.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary/10 text-primary text-base font-semibold">
                      {child.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-base truncate">{child.name}</h3>
                      <AttendanceBadge status={child.attendanceStatus} />
                    </div>
                    <p className="text-sm text-muted-foreground">{c?.name} · Section {c?.section}</p>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg border bg-muted/30 py-2">
                        <p className="text-xs text-muted-foreground">Attendance</p>
                        <p className="text-sm font-semibold text-emerald-600">{child.attendancePct}%</p>
                      </div>
                      <div className="rounded-lg border bg-muted/30 py-2">
                        <p className="text-xs text-muted-foreground">Admission</p>
                        <p className="text-sm font-semibold">{child.admissionNo.split("-")[1]}</p>
                      </div>
                      <div className="rounded-lg border bg-muted/30 py-2">
                        <p className="text-xs text-muted-foreground">Fee Due</p>
                        <p className={cn("text-sm font-semibold", due > 0 ? "text-amber-600" : "text-emerald-600")}>
                          {due > 0 ? `₹${(due/1000).toFixed(0)}k` : "Clear"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Attendance", value: `${primary.attendancePct}%`, icon: CalendarCheck, accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400", view: "attendance" as const },
          { label: "Homework Due", value: childHomework.filter(h => h.status === "active").length, icon: BookOpen, accent: "text-violet-600 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-400", view: "homework" as const },
          { label: "Fee Due", value: totalDue > 0 ? `₹${(totalDue/1000).toFixed(0)}k` : "Clear", icon: Wallet, accent: "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400", view: "fees" as const },
          { label: "Notices", value: childNotices.filter(n => !n.read).length, icon: Bell, accent: "text-rose-600 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-400", view: "notifications" as const },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setView(s.view)}>
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

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left col: attendance chart + homework */}
        <div className="lg:col-span-2 space-y-4">
          {/* Attendance trend */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base">{primary.name.split(" ")[0]}'s Attendance</CardTitle>
                <CardDescription className="text-xs">Weekly trend · this week</CardDescription>
              </div>
              <Badge variant="secondary" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400">
                {primary.attendancePct}% avg
              </Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={attendanceTrend} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gChild" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="rate" stroke="var(--chart-1)" strokeWidth={2} fill="url(#gChild)" name="Attendance %" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Homework due */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Homework &amp; Assignments</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-primary" onClick={() => setView("homework")}>
                View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {childHomework.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No homework assigned.</p>
              ) : (
                childHomework.map((hw) => (
                  <div key={hw.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/40 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                      <BookOpen className="h-[18px] w-[18px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{hw.title}</p>
                      <p className="text-xs text-muted-foreground">{hw.subject} · Due {format(parseISO(hw.dueDate), "dd MMM")}</p>
                    </div>
                    <Badge variant="secondary" className="text-[11px] bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                      Pending
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right col: daily activity + notices */}
        <div className="space-y-4">
          {/* Daily activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Today's Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="max-h-[340px] overflow-y-auto scroll-thin">
              <ol className="relative border-l border-border ml-2 space-y-3">
                {activities.map((a) => (
                  <li key={a.id} className="ml-4">
                    <div className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{a.title}</p>
                          <span className="text-[11px] text-muted-foreground shrink-0">{a.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.description}</p>
                        <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium mt-1 capitalize", activityColor[a.category])}>
                          {a.category}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Notices */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Notices</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-primary" onClick={() => setView("notifications")}>
                All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[280px] overflow-y-auto scroll-thin">
              {childNotices.map((n) => {
                const Icon = noticeIcon[n.type];
                return (
                  <div key={n.id} className="flex items-start gap-2.5 rounded-lg border p-2.5 hover:bg-muted/40 transition-colors">
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", noticeColor[n.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium leading-snug line-clamp-1">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                        {formatDistanceToNow(parseISO(n.date), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fee dues banner */}
      {totalDue > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-500/5 dark:border-amber-500/30">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Pending Fee for {primary.name.split(" ")[0]}</p>
                <p className="text-xs text-muted-foreground">
                  ₹{totalDue.toLocaleString()} due across {dueFees.length} fee(s). Clear before due date to avoid late charges.
                </p>
              </div>
            </div>
            <Button size="sm" onClick={() => setView("fees")}>
              <Wallet className="mr-2 h-4 w-4" />
              Pay Now
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
