"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { AttendanceBadge, FeeBadge } from "@/components/shared/status-badges";
import { useAppStore } from "@/store/app-store";
import { students as initialStudents, classes, getClassById } from "@/lib/mock-data";
import type { Student, AttendanceStatus, FeeStatus } from "@/lib/types";
import {
  Users, Search, UserPlus, Filter, Download, MoreHorizontal,
  Phone, Mail, MapPin, X, FileText, HeartPulse,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function StudentManagement() {
  const isLoading = useAppStore((s) => s.isLoading);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [feeFilter, setFeeFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = query.toLowerCase();
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.admissionNo.toLowerCase().includes(q) || s.phone.includes(q);
      const matchClass = classFilter === "all" || s.classId === classFilter;
      const matchFee = feeFilter === "all" || s.feeStatus === feeFilter;
      return matchQ && matchClass && matchFee;
    });
  }, [students, query, classFilter, feeFilter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-72 rounded-lg bg-muted animate-pulse" />
        <TableSkeleton />
      </div>
    );
  }

  const handleAdd = (data: Partial<Student>) => {
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      admissionNo: `ADM2025-${String(students.length + 1).padStart(3, "0")}`,
      name: data.name || "New Student",
      classId: data.classId || "c-04",
      parentId: "p-01",
      phone: data.phone || "",
      avatar: (data.name || "NS").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(),
      dob: data.dob || "2019-01-01",
      gender: (data.gender as "male" | "female") || "male",
      attendanceStatus: "present",
      attendancePct: 100,
      feeStatus: "pending",
      feeDue: 0,
      bloodGroup: "O+",
      address: data.address || "",
      medicalNotes: data.medicalNotes || "No known allergies",
    };
    setStudents([newStudent, ...students]);
    setAddOpen(false);
    toast.success("Student admitted", {
      description: `${newStudent.name} added to ${getClassById(newStudent.classId)?.name}.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Management"
        description={`${students.length} students enrolled across ${classes.length} classes. Search, filter and manage admissions.`}
        icon={<Users className="h-5 w-5" />}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, admission no, phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={feeFilter} onValueChange={setFeeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Fee Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fees</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[280px]">Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="hidden md:table-cell">Parent Phone</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Fee Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-0">
                    <EmptyState
                      icon={<Search className="h-5 w-5" />}
                      title="No students found"
                      description="Try adjusting your search or filters."
                      className="py-12"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s) => {
                  const cls = getClassById(s.classId);
                  return (
                    <TableRow key={s.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {s.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{s.name}</p>
                            <p className="text-xs text-muted-foreground">{s.admissionNo}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {cls?.name ?? "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {s.phone}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AttendanceBadge status={s.attendanceStatus} />
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {s.attendancePct}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FeeBadge status={s.feeStatus} />
                          {s.feeDue > 0 && (
                            <span className="text-xs text-muted-foreground">
                              ₹{(s.feeDue / 1000).toFixed(0)}k due
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setViewStudent(s)}>
                              <FileText className="mr-2 h-4 w-4" /> View profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Edit form would open here")}>
                              Edit details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-rose-600 focus:text-rose-600"
                              onClick={() => toast.info("Deactivate requires confirmation")}
                            >
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
            <span>Showing <strong className="text-foreground">{filtered.length}</strong> of {students.length} students</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* Add student dialog */}
      <AddStudentDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} />

      {/* Student profile dialog */}
      <StudentProfileDialog student={viewStudent} onClose={() => setViewStudent(null)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
function AddStudentDialog({
  open, onOpenChange, onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (data: Partial<Student>) => void;
}) {
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("c-04");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [address, setAddress] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");

  const submit = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    onSubmit({ name, classId, phone, dob, gender, address, medicalNotes });
    setName(""); setPhone(""); setDob(""); setAddress(""); setMedicalNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto scroll-thin">
        <DialogHeader>
          <DialogTitle>Admit New Student</DialogTitle>
          <DialogDescription>
            Fill in the details below. Fields marked * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aarav Iyer" />
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
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={(v) => setGender(v as "male" | "female")}>
                <SelectTrigger id="gender"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Parent Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98…" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House no, street, city" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="medical">Medical Notes</Label>
            <Input id="medical" value={medicalNotes} onChange={(e) => setMedicalNotes(e.target.value)} placeholder="Allergies, conditions, emergency info" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>
            <UserPlus className="mr-2 h-4 w-4" />
            Admit Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
function StudentProfileDialog({
  student, onClose,
}: {
  student: Student | null;
  onClose: () => void;
}) {
  const cls = student ? getClassById(student.classId) : null;
  return (
    <Dialog open={!!student} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
          <DialogDescription>Admission #{student?.admissionNo}</DialogDescription>
        </DialogHeader>
        {student && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {student.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{student.name}</h3>
                <p className="text-sm text-muted-foreground">{cls?.name} · Section {cls?.section}</p>
                <div className="mt-1.5 flex gap-2">
                  <AttendanceBadge status={student.attendanceStatus} />
                  <FeeBadge status={student.feeStatus} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                <p className="font-medium">{student.dob}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">Blood Group</p>
                <p className="font-medium">{student.bloodGroup}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Phone className="h-3 w-3" /> Parent Phone</p>
                <p className="font-medium">{student.phone}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">Attendance</p>
                <p className="font-medium">{student.attendancePct}% cumulative</p>
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</p>
              <p className="text-sm">{student.address}</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-500/5 dark:border-amber-500/30 p-3">
              <p className="text-xs text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1 font-medium">
                <HeartPulse className="h-3 w-3" /> Medical Notes
              </p>
              <p className="text-sm text-amber-900 dark:text-amber-300">{student.medicalNotes}</p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => { onClose(); toast.info("Edit form would open here"); }}>
            Edit Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
