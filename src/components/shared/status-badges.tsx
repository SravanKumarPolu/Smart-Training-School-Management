import { cn } from "@/lib/utils";
import type { AttendanceStatus, FeeStatus } from "@/lib/types";

export function AttendanceBadge({ status }: { status: AttendanceStatus }) {
  const map: Record<AttendanceStatus, { label: string; cls: string }> = {
    present:  { label: "Present",  cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30" },
    absent:   { label: "Absent",   cls: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30" },
    "half-day": { label: "Half Day", cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30" },
  };
  const s = map[status];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", s.cls)}>
      {s.label}
    </span>
  );
}

export function FeeBadge({ status }: { status: FeeStatus }) {
  const map: Record<FeeStatus, { label: string; cls: string }> = {
    paid:    { label: "Paid",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30" },
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30" },
    partial: { label: "Partial", cls: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30" },
    overdue: { label: "Overdue", cls: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30" },
  };
  const s = map[status];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", s.cls)}>
      {s.label}
    </span>
  );
}

export function PaymentMethodBadge({ method }: { method: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    upi:        { label: "UPI",         cls: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400" },
    card:       { label: "Card",        cls: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400" },
    netbanking: { label: "Net Banking", cls: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400" },
  };
  const s = map[method] ?? { label: method, cls: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", s.cls)}>
      {s.label}
    </span>
  );
}
