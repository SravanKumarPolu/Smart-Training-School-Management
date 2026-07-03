"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import {
  monthlyAttendance, classAttendanceReport, feeCollectionTrend,
  feeCategoryBreakdown, studentProgress, students, fees,
} from "@/lib/mock-data";
import {
  BarChart3, Download, TrendingUp, Users, Wallet, GraduationCap,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ReportsPage() {
  const [tab, setTab] = useState("attendance");
  const [period, setPeriod] = useState("6m");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive insights into attendance, fees and student performance. Export-ready summaries for board meetings."
        icon={<BarChart3 className="h-5 w-5" />}
        actions={
          <>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last month</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => toast.info("PDF export would generate here")}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </>
        }
      />

      {/* Summary KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Avg Attendance", value: "92%", trend: "+1.5%", up: true, icon: TrendingUp, accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400" },
          { label: "Fee Collection", value: "78%", trend: "+4.2%", up: true, icon: Wallet, accent: "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400" },
          { label: "Active Students", value: students.length, trend: "+3", up: true, icon: Users, accent: "text-violet-600 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-400" },
          { label: "Avg Performance", value: "87%", trend: "-0.8%", up: false, icon: GraduationCap, accent: "text-teal-600 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", s.accent)}>
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <span className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium rounded-md px-1.5 py-0.5",
                    s.up ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
                  )}>
                    {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {s.trend}
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        {/* ATTENDANCE REPORT */}
        <TabsContent value="attendance" className="space-y-4 mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Monthly trend */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Monthly Attendance Rate</CardTitle>
                <CardDescription className="text-xs">School-wide attendance % over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlyAttendance} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => `${v}%`} />
                    <Line type="monotone" dataKey="rate" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--chart-1)" }} activeDot={{ r: 6 }} name="Attendance %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Attendance Summary</CardTitle>
                <CardDescription className="text-xs">Current term</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Above 90%", count: 9, color: "bg-emerald-500" },
                  { label: "75% – 90%", count: 5, color: "bg-amber-500" },
                  { label: "Below 75%", count: 1, color: "bg-rose-500" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-medium">{s.count} students</span>
                    </div>
                    <Progress value={(s.count / students.length) * 100} className="h-2" />
                  </div>
                ))}
                <div className="rounded-lg border bg-muted/30 p-3 mt-2">
                  <p className="text-xs text-muted-foreground">Best performing class</p>
                  <p className="text-sm font-semibold mt-0.5">Grade 1 · 96% avg</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Class-wise attendance table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Class-wise Attendance Report</CardTitle>
              <CardDescription className="text-xs">Average attendance % per class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead>Class</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead className="w-[200px]">Attendance Rate</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classAttendanceReport.map((row) => (
                      <TableRow key={row.class} className="hover:bg-muted/40">
                        <TableCell className="font-medium">{row.class}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.students}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={row.attendance} className="h-2 flex-1" />
                            <span className="text-xs font-medium w-10 text-right">{row.attendance}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className={cn(
                            "text-[11px]",
                            row.attendance >= 90 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" :
                            row.attendance >= 80 ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" :
                            "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
                          )}>
                            {row.attendance >= 90 ? "Excellent" : row.attendance >= 80 ? "Good" : "Needs Attention"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FEE REPORT */}
        <TabsContent value="fees" className="space-y-4 mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Collection trend */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Fee Collection Trend</CardTitle>
                <CardDescription className="text-xs">Collected vs pending · last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={feeCollectionTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="collected" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Collected" />
                    <Bar dataKey="pending" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Fee by Category</CardTitle>
                <CardDescription className="text-xs">This term</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={feeCategoryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                      {feeCategoryBreakdown.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1">
                  {feeCategoryBreakdown.map((c) => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.fill }} />
                        <span className="text-muted-foreground">{c.name}</span>
                      </span>
                      <span className="font-medium">₹{(c.value/1000).toFixed(0)}k</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fee summary table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Fee Status Summary</CardTitle>
              <CardDescription className="text-xs">Breakdown by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Billed", value: fees.reduce((a, f) => a + f.amount, 0), count: fees.length, color: "text-sky-600 bg-sky-50 dark:bg-sky-500/15 dark:text-sky-400" },
                  { label: "Collected", value: fees.reduce((a, f) => a + f.paidAmount, 0), count: fees.filter(f => f.status === "paid").length, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400" },
                  { label: "Pending", value: fees.filter(f => f.status === "pending" || f.status === "partial").reduce((a, f) => a + (f.amount - f.paidAmount), 0), count: fees.filter(f => f.status === "pending" || f.status === "partial").length, color: "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400" },
                  { label: "Overdue", value: fees.filter(f => f.status === "overdue").reduce((a, f) => a + (f.amount - f.paidAmount), 0), count: fees.filter(f => f.status === "overdue").length, color: "text-rose-600 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-400" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border p-3">
                    <div className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg mb-2", s.color)}>
                      <Wallet className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-lg font-semibold mt-0.5">₹{(s.value / 1000).toFixed(0)}k</p>
                    <p className="text-[11px] text-muted-foreground">{s.count} fees</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROGRESS REPORT */}
        <TabsContent value="progress" className="space-y-4 mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Radar chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Student Performance — Aarav Iyer</CardTitle>
                <CardDescription className="text-xs">Subject-wise scores vs previous term</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={studentProgress}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                    <Radar name="Current" dataKey="score" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.4} strokeWidth={2} />
                    <Radar name="Previous" dataKey="previous" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.15} strokeWidth={2} strokeDasharray="4 4" />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subject scores */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Subject Scores</CardTitle>
                <CardDescription className="text-xs">Current vs previous term</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {studentProgress.map((s) => {
                  const diff = s.score - s.previous;
                  return (
                    <div key={s.subject}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium">{s.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground line-through">{s.previous}%</span>
                          <span className="font-semibold">{s.score}%</span>
                          <span className={cn(
                            "inline-flex items-center gap-0.5 text-[10px] font-medium rounded px-1 py-0.5",
                            diff >= 0 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
                          )}>
                            {diff >= 0 ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                            {Math.abs(diff)}%
                          </span>
                        </div>
                      </div>
                      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                        <div className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/30" style={{ width: `${s.previous}%` }} />
                        <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${s.score}%` }} />
                      </div>
                    </div>
                  );
                })}
                <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-500/10 p-3 mt-3">
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Overall improvement: +4.2%</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400/80 mt-0.5">Aarav shows consistent growth across all subjects this term.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top performers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top Performers — This Term</CardTitle>
              <CardDescription className="text-xs">Students with highest attendance &amp; progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="w-[50px]">Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden sm:table-cell">Class</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead className="text-right">Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...students]
                      .sort((a, b) => b.attendancePct - a.attendancePct)
                      .slice(0, 6)
                      .map((s, i) => (
                        <TableRow key={s.id} className="hover:bg-muted/40">
                          <TableCell>
                            <span className={cn(
                              "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                              i === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                              i === 1 ? "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300" :
                              i === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400" :
                              "bg-muted text-muted-foreground"
                            )}>
                              {i + 1}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium text-sm">{s.name}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                            {students.find(x => x.id === s.id)?.classId ? classAttendanceReport.find(c => c.class.includes("UKG"))?.class : "UKG"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-[11px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                              {s.attendancePct}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-sm font-semibold">{Math.min(99, s.attendancePct - 3)}%</span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
