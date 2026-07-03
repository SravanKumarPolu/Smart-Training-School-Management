"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useAppStore } from "@/store/app-store";
import { classes, students as allStudents } from "@/lib/mock-data";
import type { AttendanceStatus } from "@/lib/types";
import {
  CalendarCheck, Users, Check, X, Clock, Save, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

interface Row {
  studentId: string;
  name: string;
  avatar: string;
  admissionNo: string;
  status: AttendanceStatus;
}

const statusConfig: Record<AttendanceStatus, { label: string; icon: React.ComponentType<{ className?: string }>; cls: string; activeCls: string }> = {
  present: {
    label: "Present",
    icon: Check,
    cls: "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-500/15",
    activeCls: "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:border-emerald-600",
  },
  absent: {
    label: "Absent",
    icon: X,
    cls: "border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/15",
    activeCls: "bg-rose-500 text-white border-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:border-rose-600",
  },
  "half-day": {
    label: "Half Day",
    icon: Clock,
    cls: "border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-500/15",
    activeCls: "bg-amber-500 text-white border-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:border-amber-600",
  },
};

export function AttendanceModule() {
  const [classId, setClassId] = useState("c-04");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Row[]>(() =>
    allStudents
      .filter(s => s.classId === "c-04")
      .map(s => ({
        studentId: s.id, name: s.name, avatar: s.avatar,
        admissionNo: s.admissionNo, status: s.attendanceStatus,
      }))
  );

  // Rebuild rows when class changes
  const changeClass = (id: string) => {
    setClassId(id);
    setRows(
      allStudents
        .filter(s => s.classId === id)
        .map(s => ({
          studentId: s.id, name: s.name, avatar: s.avatar,
          admissionNo: s.admissionNo, status: s.attendanceStatus,
        }))
    );
  };

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setRows(prev => prev.map(r => r.studentId === studentId ? { ...r, status } : r));
  };

  const markAll = (status: AttendanceStatus) => {
    setRows(prev => prev.map(r => ({ ...r, status })));
    toast.success(`All students marked ${statusConfig[status].label.toLowerCase()}`);
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter(r => !q || r.name.toLowerCase().includes(q) || r.admissionNo.toLowerCase().includes(q));
  }, [rows, query]);

  const summary = useMemo(() => ({
    present: rows.filter(r => r.status === "present").length,
    absent: rows.filter(r => r.status === "absent").length,
    halfDay: rows.filter(r => r.status === "half-day").length,
    total: rows.length,
  }), [rows]);

  const rate = summary.total ? Math.round(((summary.present + summary.halfDay * 0.5) / summary.total) * 100) : 0;

  const save = () => {
    toast.success("Attendance saved", {
      description: `${summary.present} present, ${summary.absent} absent, ${summary.halfDay} half-day · ${getClass(classId)}`,
    });
  };

  const getClass = (id: string) => classes.find(c => c.id === id)?.name ?? "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Module"
        description="Mark daily attendance class-wise. Tap Present, Absent, or Half Day for each student."
        icon={<CalendarCheck className="h-5 w-5" />}
        actions={
          <Button size="sm" onClick={save}>
            <Save className="mr-2 h-4 w-4" />
            Save Attendance
          </Button>
        }
      />

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Present", value: summary.present, icon: Check, accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400" },
          { label: "Absent", value: summary.absent, icon: X, accent: "text-rose-600 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-400" },
          { label: "Half Day", value: summary.halfDay, icon: Clock, accent: "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400" },
          { label: "Rate", value: `${rate}%`, icon: Users, accent: "text-teal-600 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-400" },
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

      {/* Controls */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-3 flex-1">
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Class</label>
              <Select value={classId} onValueChange={changeClass}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} · {c.section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Search Student</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Name or ID…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground mr-1">Mark all:</span>
            <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => markAll("present")}>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Present
            </Button>
            <Button size="sm" variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => markAll("absent")}>
              <X className="mr-1.5 h-3.5 w-3.5" /> Absent
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[280px]">Student</TableHead>
                <TableHead className="hidden sm:table-cell">Admission No</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-0">
                    <EmptyState title="No students in this class" description="Try a different class or search term." className="py-10" />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.studentId} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {r.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{r.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {r.admissionNo}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        {(Object.keys(statusConfig) as AttendanceStatus[]).map((st) => {
                          const cfg = statusConfig[st];
                          const Icon = cfg.icon;
                          const active = r.status === st;
                          return (
                            <button
                              key={st}
                              onClick={() => setStatus(r.studentId, st)}
                              className={cn(
                                "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                                active ? cfg.activeCls : cfg.cls
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">{cfg.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
            <span>{filtered.length} students · {getClass(classId)}</span>
            <span>Auto-saved drafts · click <strong className="text-foreground">Save Attendance</strong> to confirm</span>
          </div>
        )}
      </div>
    </div>
  );
}
