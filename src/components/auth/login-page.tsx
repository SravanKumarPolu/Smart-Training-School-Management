"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { tenant, dashboardStats } from "@/lib/mock-data";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  GraduationCap, Shield, BookOpen, Users, ArrowRight, Loader2,
  CheckCircle2, TrendingUp, CalendarCheck, Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roles: {
  id: Role;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  email: string;
  accent: string;
}[] = [
  {
    id: "admin",
    label: "Administrator",
    desc: "Full control · students, fees, reports",
    icon: Shield,
    email: "admin@smarttsm.edu",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    id: "teacher",
    label: "Teacher",
    desc: "Attendance, homework & class management",
    icon: BookOpen,
    email: "anil.verma@smarttsm.edu",
    accent: "from-violet-500 to-purple-600",
  },
  {
    id: "parent",
    label: "Parent",
    desc: "Child progress, fees & daily updates",
    icon: Users,
    email: "meera.iyer@gmail.com",
    accent: "from-amber-500 to-orange-600",
  },
];

export function LoginPage() {
  const login = useAppStore((s) => s.login);
  const [selected, setSelected] = useState<Role>("admin");
  const [email, setEmail] = useState("admin@smarttsm.edu");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (r: Role) => {
    setSelected(r);
    const found = roles.find(x => x.id === r);
    if (found) setEmail(found.email);
  };

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login(selected);
    }, 700);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left — brand / hero panel */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-sidebar p-12 text-sidebar-foreground">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">{tenant.name}</p>
            <p className="text-xs text-sidebar-foreground/60">{tenant.type} · {tenant.branch}</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-3xl font-bold leading-tight">
            One platform for your entire school.
          </h1>
          <p className="mt-4 text-sm text-sidebar-foreground/70 leading-relaxed">
            Manage admissions, attendance, homework, fees and parent communication — all from a single, beautiful dashboard built for modern pre-schools and training centres.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { icon: Users,        label: "Students",  value: `${dashboardStats.totalStudents}+` },
              { icon: TrendingUp,   label: "Attendance", value: `${dashboardStats.attendancePct}%` },
              { icon: CalendarCheck,label: "Active Classes", value: `${dashboardStats.activeClasses}` },
              { icon: Wallet,       label: "Fee Tracking", value: "Real-time" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl border border-sidebar-border/60 bg-sidebar-accent/40 p-4">
                  <Icon className="h-5 w-5 text-sidebar-primary" />
                  <p className="mt-2 text-xl font-semibold">{s.value}</p>
                  <p className="text-xs text-sidebar-foreground/60">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-sidebar-foreground/60">
          <CheckCircle2 className="h-4 w-4 text-sidebar-primary" />
          Trusted by 120+ schools · SOC 2 ready · 99.9% uptime
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-semibold">{tenant.name}</p>
              <p className="text-xs text-muted-foreground">{tenant.academicYear}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a role and sign in to explore the demo dashboard.
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-5">
            <Label className="mb-2 block text-xs font-medium text-muted-foreground">
              SELECT ROLE
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const active = selected === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all",
                      active
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                        : "border-border hover:border-primary/40 hover:bg-muted/40"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm",
                        r.accent,
                        !active && "opacity-80 group-hover:opacity-100"
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </div>
                    <span className={cn("text-xs font-medium", active ? "text-primary" : "text-foreground")}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {roles.find(r => r.id === selected)?.desc}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button className="text-xs font-medium text-primary hover:underline">
                  Forgot?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10"
              />
            </div>

            <Button
              className="h-10 w-full text-sm font-medium"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in as {roles.find(r => r.id === selected)?.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="h-10 w-full text-sm font-medium"
              onClick={handleLogin}
              disabled={loading}
            >
              Try demo account
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo only · no real authentication · mock data
          </p>
        </div>
      </div>
    </div>
  );
}
