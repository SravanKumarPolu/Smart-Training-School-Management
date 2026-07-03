"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { FeeBadge, PaymentMethodBadge } from "@/components/shared/status-badges";
import { useAppStore } from "@/store/app-store";
import { fees as allFees, fees as initialFees, getClassById, payments } from "@/lib/mock-data";
import {
  Wallet, Receipt, Download, Search, Filter, IndianRupee, CreditCard,
  Smartphone, Building2, CheckCircle2, Clock, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format, parseISO, isPast } from "date-fns";
import type { Fee, PaymentMethod } from "@/lib/types";

const methodConfig: Record<PaymentMethod, { icon: React.ComponentType<{ className?: string }>; label: string; desc: string }> = {
  upi:        { icon: Smartphone,  label: "UPI",         desc: "GPay, PhonePe, Paytm" },
  card:       { icon: CreditCard,  label: "Card",        desc: "Visa, Mastercard, RuPay" },
  netbanking: { icon: Building2,   label: "Net Banking", desc: "All major banks" },
};

export function FeeManagement() {
  const { role } = useAppStore();
  const isParent = role === "parent";

  // Parent sees only their children's fees (s-01, s-02)
  const visibleFees = isParent
    ? allFees.filter(f => ["s-01", "s-02"].includes(f.studentId))
    : allFees;

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payFee, setPayFee] = useState<Fee | null>(null);

  const filtered = useMemo(() => {
    return visibleFees.filter((f) => {
      const q = query.toLowerCase();
      const matchQ = !q || f.studentName.toLowerCase().includes(q) || f.term.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || f.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [visibleFees, query, statusFilter]);

  const totalCollected = allFees.reduce((a, f) => a + f.paidAmount, 0);
  const totalDue = allFees.filter(f => f.status !== "paid").reduce((a, f) => a + (f.amount - f.paidAmount), 0);
  const overdueCount = allFees.filter(f => f.status === "overdue").length;
  const paidCount = allFees.filter(f => f.status === "paid").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Management"
        description={
          isParent
            ? "View and pay fees for your children. Download receipts instantly."
            : "Track fee collection, dues and generate receipts. No real payment gateway — labels only."
        }
        icon={<Wallet className="h-5 w-5" />}
        actions={
          !isParent && (
            <Button variant="outline" size="sm" onClick={() => toast.info("Export would generate CSV")}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )
        }
      />

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Collected", value: `₹${(totalCollected / 1000).toFixed(0)}k`, icon: IndianRupee, accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400" },
          { label: "Pending Dues", value: `₹${(totalDue / 1000).toFixed(0)}k`, icon: Clock, accent: "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400" },
          { label: "Overdue", value: overdueCount, icon: X, accent: "text-rose-600 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-400" },
          { label: "Fully Paid", value: paidCount, icon: CheckCircle2, accent: "text-teal-600 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-400" },
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search student, term…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[260px]">Student</TableHead>
                <TableHead>Term / Category</TableHead>
                <TableHead className="hidden md:table-cell">Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-sm text-muted-foreground">
                    No fee records found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((f) => {
                  const cls = getClassById(f.classId);
                  const overdue = f.status === "overdue" || (f.status !== "paid" && isPast(parseISO(f.dueDate + "T23:59")));
                  return (
                    <TableRow key={f.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {f.studentName.split(" ").map(w => w[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{f.studentName}</p>
                            <p className="text-xs text-muted-foreground">{cls?.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{f.term}</p>
                        <p className="text-xs text-muted-foreground capitalize">{f.category}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        <span className={cn(overdue && "text-rose-600 font-medium")}>
                          {format(parseISO(f.dueDate), "dd MMM yyyy")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-semibold">₹{f.amount.toLocaleString()}</p>
                        {f.paidAmount > 0 && f.paidAmount < f.amount && (
                          <p className="text-xs text-muted-foreground">
                            ₹{f.paidAmount.toLocaleString()} paid
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <FeeBadge status={f.status} />
                          {f.paymentMethod && f.status !== "pending" && f.status !== "overdue" && (
                            <PaymentMethodBadge method={f.paymentMethod} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {f.status === "paid" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.success("Receipt downloaded", { description: `${f.receiptNo} · ${f.studentName}` })}
                            >
                              <Receipt className="mr-1.5 h-3.5 w-3.5" />
                              Receipt
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => setPayFee(f)}>
                              <Wallet className="mr-1.5 h-3.5 w-3.5" />
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {filtered.length > 0 && (
          <div className="border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{filtered.length}</strong> of {visibleFees.length} fee records
          </div>
        )}
      </div>

      {/* Payment dialog */}
      <PaymentDialog fee={payFee} onClose={() => setPayFee(null)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
function PaymentDialog({ fee, onClose }: { fee: Fee | null; onClose: () => void }) {
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [processing, setProcessing] = useState(false);

  if (!fee) return null;
  const due = fee.amount - fee.paidAmount;

  const pay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast.success("Payment successful (demo)", {
        description: `₹${due.toLocaleString()} paid via ${methodConfig[method].label} · Receipt RCPT-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      });
      onClose();
    }, 1200);
  };

  return (
    <Dialog open={!!fee} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Pay Fee</DialogTitle>
          <DialogDescription>{fee.studentName} · {fee.term}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Amount summary */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-medium">₹{fee.amount.toLocaleString()}</span>
            </div>
            {fee.paidAmount > 0 && (
              <div className="flex items-center justify-between text-sm mt-1.5">
                <span className="text-muted-foreground">Already Paid</span>
                <span className="font-medium text-emerald-600">₹{fee.paidAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t mt-2 pt-2 flex items-center justify-between">
              <span className="text-sm font-medium">Amount Due</span>
              <span className="text-xl font-bold text-primary">₹{due.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">SELECT PAYMENT METHOD</Label>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentMethod)} className="gap-2">
              {(Object.keys(methodConfig) as PaymentMethod[]).map((m) => {
                const cfg = methodConfig[m];
                const Icon = cfg.icon;
                const active = method === m;
                return (
                  <label
                    key={m}
                    htmlFor={`pm-${m}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                      active ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/40"
                    )}
                  >
                    <RadioGroupItem value={m} id={`pm-${m}`} className="sr-only" />
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{cfg.label}</p>
                      <p className="text-xs text-muted-foreground">{cfg.desc}</p>
                    </div>
                    <div className={cn(
                      "h-4 w-4 rounded-full border-2",
                      active ? "border-primary bg-primary" : "border-muted-foreground/30"
                    )} />
                  </label>
                );
              })}
            </RadioGroup>
          </div>

          <p className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-500/10 rounded-lg p-2.5 text-amber-800 dark:text-amber-300">
            ⚠️ Demo only — no real payment will be processed. Labels are for illustration.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={pay} disabled={processing}>
            {processing ? "Processing…" : `Pay ₹${due.toLocaleString()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
