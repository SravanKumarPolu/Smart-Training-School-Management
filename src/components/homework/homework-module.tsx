"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useAppStore } from "@/store/app-store";
import { homeworks as initial, classes, getClassById } from "@/lib/mock-data";
import type { Homework } from "@/lib/types";
import {
  BookOpen, Plus, Calendar, Paperclip, CheckCircle2, Clock,
  AlertCircle, FileText, X, Download, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format, formatDistanceToNow, parseISO, isPast } from "date-fns";

export function HomeworkModule() {
  const { role } = useAppStore();
  const isParent = role === "parent";
  const [homeworks, setHomeworks] = useState<Homework[]>(initial);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewHw, setViewHw] = useState<Homework | null>(null);

  // For parent — show homework for their children's classes (c-04, c-02)
  const parentClassIds = ["c-04", "c-02"];
  const visible = isParent
    ? homeworks.filter(h => parentClassIds.includes(h.classId))
    : homeworks;

  const handleCreate = (data: Partial<Homework>) => {
    const hw: Homework = {
      id: `hw-${Date.now()}`,
      title: data.title || "Untitled Homework",
      description: data.description || "",
      classId: data.classId || "c-04",
      subject: data.subject || "General",
      teacherId: "t-01",
      teacherName: "Anil Verma",
      dueDate: data.dueDate || format(new Date(), "yyyy-MM-dd"),
      assignedAt: format(new Date(), "yyyy-MM-dd"),
      fileUrl: data.fileUrl,
      attachmentName: data.fileUrl,
      status: "active",
      submissions: [],
    };
    setHomeworks([hw, ...homeworks]);
    setCreateOpen(false);
    toast.success("Homework assigned", {
      description: `${hw.title} → ${getClassById(hw.classId)?.name}`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isParent ? "Homework & Assignments" : "Homework Management"}
        description={
          isParent
            ? "Track homework assigned to your child. View due dates, attachments and submission status."
            : "Create homework, assign to classes and track submissions from students."
        }
        icon={<BookOpen className="h-5 w-5" />}
        actions={
          !isParent && (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Homework
            </Button>
          )
        }
      />

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active", value: visible.filter(h => h.status === "active").length, icon: Clock, accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400" },
          { label: "Closed", value: visible.filter(h => h.status === "closed").length, icon: CheckCircle2, accent: "text-muted-foreground bg-muted" },
          { label: "Due Soon", value: visible.filter(h => h.status === "active" && !isPast(parseISO(h.dueDate + "T23:59"))).length, icon: Calendar, accent: "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400" },
          { label: "Overdue", value: visible.filter(h => h.status === "active" && isPast(parseISO(h.dueDate + "T23:59"))).length, icon: AlertCircle, accent: "text-rose-600 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-400" },
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

      {/* Homework list */}
      {visible.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-5 w-5" />}
          title="No homework yet"
          description={isParent ? "Your child has no assignments at the moment." : "Create your first homework assignment."}
          className="border rounded-xl"
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visible.map((hw) => {
            const cls = getClassById(hw.classId);
            const due = parseISO(hw.dueDate + "T23:59");
            const overdue = hw.status === "active" && isPast(due);
            const submittedCount = hw.submissions.filter(s => s.status === "submitted" || s.status === "graded").length;
            const totalCount = cls?.studentCount ?? 0;

            return (
              <Card key={hw.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="secondary" className="text-[11px]">{hw.subject}</Badge>
                        <Badge variant="outline" className="text-[11px]">{cls?.name}</Badge>
                        {hw.status === "closed" && (
                          <Badge variant="secondary" className="text-[11px] bg-muted text-muted-foreground">Closed</Badge>
                        )}
                        {overdue && (
                          <Badge variant="secondary" className="text-[11px] bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400">Overdue</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-base leading-snug">{hw.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{hw.description}</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Due {format(parseISO(hw.dueDate), "dd MMM")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Assigned {formatDistanceToNow(parseISO(hw.assignedAt), { addSuffix: true })}
                    </span>
                    {hw.fileUrl && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="h-3.5 w-3.5" />
                        {hw.attachmentName}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                          {hw.teacherName.split(" ").map(w => w[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">{hw.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isParent && totalCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {submittedCount}/{totalCount} submitted
                        </span>
                      )}
                      {isParent && (
                        <Badge variant="secondary" className="text-[11px] bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                          Pending
                        </Badge>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setViewHw(hw)}>
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create dialog */}
      <CreateHomeworkDialog open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreate} />

      {/* View dialog */}
      <HomeworkDetailDialog hw={viewHw} isParent={isParent} onClose={() => setViewHw(null)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
function CreateHomeworkDialog({
  open, onOpenChange, onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (data: Partial<Homework>) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("c-04");
  const [subject, setSubject] = useState("Mathematics");
  const [dueDate, setDueDate] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const submit = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    onSubmit({ title, description, classId, subject, dueDate, fileUrl: fileUrl || undefined });
    setTitle(""); setDescription(""); setFileUrl(""); setDueDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto scroll-thin">
        <DialogHeader>
          <DialogTitle>Create Homework</DialogTitle>
          <DialogDescription>Assign a new homework to a class.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Addition Worksheet" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="class">Class</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger id="class"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Mathematics","English","Science","EVS","Art","Hindi","Social Studies","Rhymes"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Instructions for students…" rows={3} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="attach">Attachment (filename)</Label>
            <Input id="attach" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="worksheet.pdf" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Homework
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
function HomeworkDetailDialog({
  hw, isParent, onClose,
}: {
  hw: Homework | null;
  isParent: boolean;
  onClose: () => void;
}) {
  const cls = hw ? getClassById(hw.classId) : null;
  return (
    <Dialog open={!!hw} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto scroll-thin">
        <DialogHeader>
          <DialogTitle>{hw?.title}</DialogTitle>
          <DialogDescription>
            {hw?.subject} · {cls?.name} · Assigned by {hw?.teacherName}
          </DialogDescription>
        </DialogHeader>
        {hw && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{hw.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> Due Date</p>
                <p className="font-medium">{format(parseISO(hw.dueDate), "dd MMMM yyyy")}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Assigned</p>
                <p className="font-medium">{format(parseISO(hw.assignedAt), "dd MMM yyyy")}</p>
              </div>
            </div>
            {hw.fileUrl && (
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{hw.attachmentName}</p>
                    <p className="text-xs text-muted-foreground">PDF · 240 KB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info("Download would start here")}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            )}

            {/* Submissions (teacher view) */}
            {!isParent && hw.submissions.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Submissions</p>
                <div className="space-y-2 max-h-48 overflow-y-auto scroll-thin">
                  {hw.submissions.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between rounded-lg border p-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                            {sub.studentName.split(" ").map(w => w[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{sub.studentName}</span>
                      </div>
                      <Badge variant="secondary" className={cn(
                        "text-[11px]",
                        sub.status === "graded" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
                        sub.status === "submitted" && "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
                        sub.status === "pending" && "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
                        sub.status === "late" && "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
                      )}>
                        {sub.status === "graded" ? `Graded: ${sub.grade}` : sub.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parent action */}
            {isParent && (
              <div className="flex items-center justify-between rounded-lg border bg-amber-50 dark:bg-amber-500/10 p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900 dark:text-amber-300">Submission pending</span>
                </div>
                <Button size="sm" onClick={() => { toast.success("Submission form would open"); onClose(); }}>
                  Submit Homework
                </Button>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
