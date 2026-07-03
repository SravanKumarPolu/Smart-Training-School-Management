"use client";

import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; direction: "up" | "down"; positive?: boolean };
  accent?: "emerald" | "amber" | "rose" | "violet" | "teal";
  hint?: string;
}

const accentMap = {
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  amber:   "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  rose:    "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
  violet:  "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  teal:    "bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
};

export function StatCard({ label, value, icon, trend, accent = "emerald", hint }: StatCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              accentMap[accent]
            )}
          >
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium rounded-md px-1.5 py-0.5",
                trend.direction === "up"
                  ? trend.positive !== false
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                    : "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
                  : trend.positive === true
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                    : "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
              )}
            >
              {trend.direction === "up" ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend.value}
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
