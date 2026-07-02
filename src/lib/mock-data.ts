import type {
  Tenant, User, Parent, Teacher, ClassRoom, Student, AttendanceRecord,
  Homework, Fee, Payment, NotificationItem, DailyActivity,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// TENANT
// ---------------------------------------------------------------------------
export const tenant: Tenant = {
  id: "tn-001",
  tenantId: "SMART-TSM-BLR-01",
  name: "Smart Training & School Management",
  shortName: "SmartTSM",
  type: "Pre-School & Training Centre",
  branch: "Bengaluru — HSR Layout",
  logo: "ST",
  academicYear: "2025–2026",
};

// ---------------------------------------------------------------------------
// USERS — three demo accounts, one per role
// ---------------------------------------------------------------------------
export const users: User[] = [
  {
    id: "u-admin",
    tenantId: "tn-001",
    name: "Priya Sharma",
    email: "admin@smarttsm.edu",
    passwordHash: "argon2id$demo",
    role: "admin",
    phone: "+91 98100 12345",
    status: true,
    avatar: "PS",
  },
  {
    id: "u-teacher",
    tenantId: "tn-001",
    name: "Anil Verma",
    email: "anil.verma@smarttsm.edu",
    passwordHash: "argon2id$demo",
    role: "teacher",
    phone: "+91 98200 22345",
    status: true,
    avatar: "AV",
  },
  {
    id: "u-parent",
    tenantId: "tn-001",
    name: "Meera Iyer",
    email: "meera.iyer@gmail.com",
    passwordHash: "argon2id$demo",
    role: "parent",
    phone: "+91 98300 32345",
    status: true,
    avatar: "MI",
  },
];

// ---------------------------------------------------------------------------
// TEACHERS
// ---------------------------------------------------------------------------
export const teachers: Teacher[] = [
  { id: "t-01", userId: "u-teacher",  tenantId: "tn-001", subjects: ["Mathematics", "Science"],    qualification: "M.Sc, B.Ed",         joinedAt: "2021-06-12", experienceYears: 8 },
  { id: "t-02", userId: "u-teacher2", tenantId: "tn-001", subjects: ["English", "Social Studies"], qualification: "M.A English, B.Ed",   joinedAt: "2020-04-01", experienceYears: 11 },
  { id: "t-03", userId: "u-teacher3", tenantId: "tn-001", subjects: ["Hindi", "Sanskrit"],        qualification: "M.A Hindi",           joinedAt: "2022-07-20", experienceYears: 5 },
  { id: "t-04", userId: "u-teacher4", tenantId: "tn-001", subjects: ["Art", "Craft"],              qualification: "BFA, Dip. Early Childhood", joinedAt: "2019-08-15", experienceYears: 12 },
  { id: "t-05", userId: "u-teacher5", tenantId: "tn-001", subjects: ["Physical Education"],        qualification: "B.P.Ed, M.P.Ed",      joinedAt: "2023-01-10", experienceYears: 4 },
];

// ---------------------------------------------------------------------------
// PARENTS
// ---------------------------------------------------------------------------
export const parents: Parent[] = [
  { id: "p-01", userId: "u-parent",  name: "Meera Iyer",   phone: "+91 98300 32345", email: "meera.iyer@gmail.com",   occupation: "Software Engineer", childIds: ["s-01", "s-02"] },
  { id: "p-02", userId: "u-parent2", name: "Ravi Reddy",   phone: "+91 98400 42345", email: "ravi.reddy@gmail.com",   occupation: "Doctor",            childIds: ["s-03"] },
  { id: "p-03", userId: "u-parent3", name: "Lakshmi Nair", phone: "+91 98500 52345", email: "lakshmi.nair@gmail.com", occupation: "Architect",         childIds: ["s-04"] },
  { id: "p-04", userId: "u-parent4", name: "Suresh Gupta", phone: "+91 98600 62345", email: "suresh.gupta@gmail.com", occupation: "Business Owner",    childIds: ["s-05"] },
  { id: "p-05", userId: "u-parent5", name: "Anita Mehta",  phone: "+91 98700 72345", email: "anita.mehta@gmail.com",  occupation: "Bank Manager",      childIds: ["s-06"] },
];

// ---------------------------------------------------------------------------
// CLASSES
// ---------------------------------------------------------------------------
export const classes: ClassRoom[] = [
  { id: "c-01", tenantId: "tn-001", name: "Play Group",  grade: "PG", section: "A", teacherId: "t-04", room: "B-101", studentCount: 18, capacity: 20, subjects: ["Play", "Rhymes"] },
  { id: "c-02", tenantId: "tn-001", name: "Nursery",     grade: "NS", section: "A", teacherId: "t-03", room: "B-102", studentCount: 22, capacity: 25, subjects: ["English", "Maths", "Rhymes"] },
  { id: "c-03", tenantId: "tn-001", name: "LKG",         grade: "LKG", section: "A", teacherId: "t-02", room: "A-201", studentCount: 26, capacity: 28, subjects: ["English", "Maths", "EVS"] },
  { id: "c-04", tenantId: "tn-001", name: "UKG",         grade: "UKG", section: "A", teacherId: "t-01", room: "A-202", studentCount: 24, capacity: 28, subjects: ["English", "Maths", "Science", "EVS"] },
  { id: "c-05", tenantId: "tn-001", name: "Grade 1",     grade: "G1",  section: "A", teacherId: "t-01", room: "C-301", studentCount: 28, capacity: 30, subjects: ["English", "Maths", "Science", "Social"] },
  { id: "c-06", tenantId: "tn-001", name: "Grade 2",     grade: "G2",  section: "A", teacherId: "t-02", room: "C-302", studentCount: 27, capacity: 30, subjects: ["English", "Maths", "Science", "Social"] },
  { id: "c-07", tenantId: "tn-001", name: "Grade 3",     grade: "G3",  section: "B", teacherId: "t-05", room: "C-303", studentCount: 25, capacity: 30, subjects: ["English", "Maths", "Science", "Social"] },
  { id: "c-08", tenantId: "tn-001", name: "Grade 4",     grade: "G4",  section: "A", teacherId: "t-03", room: "D-401", studentCount: 23, capacity: 30, subjects: ["English", "Maths", "Science", "Social"] },
];

// ---------------------------------------------------------------------------
// STUDENTS
// ---------------------------------------------------------------------------
export const students: Student[] = [
  { id: "s-01", tenantId: "tn-001", admissionNo: "ADM2025-001", name: "Aarav Iyer",     classId: "c-04", parentId: "p-01", phone: "+91 98300 32345", avatar: "AI", dob: "2019-03-14", gender: "male", medicalNotes: "Mild dust allergy; carries inhaler", attendanceStatus: "present", attendancePct: 94, feeStatus: "paid",    feeDue: 0,     bloodGroup: "O+",  address: "12, MG Road, Bengaluru" },
  { id: "s-02", tenantId: "tn-001", admissionNo: "ADM2025-002", name: "Diya Iyer",      classId: "c-02", parentId: "p-01", phone: "+91 98300 32345", avatar: "DI", dob: "2020-07-22", gender: "female", medicalNotes: "No known allergies", attendanceStatus: "present", attendancePct: 91, feeStatus: "pending", feeDue: 12500, bloodGroup: "A+",  address: "12, MG Road, Bengaluru" },
  { id: "s-03", tenantId: "tn-001", admissionNo: "ADM2025-003", name: "Kabir Reddy",    classId: "c-03", parentId: "p-02", phone: "+91 98400 42345", avatar: "KR", dob: "2019-11-02", gender: "male", medicalNotes: "Asthmatic - avoid chalk dust; emergency med in office", attendanceStatus: "absent",  attendancePct: 78, feeStatus: "overdue", feeDue: 24000, bloodGroup: "B+",  address: "45, Brigade Road, Bengaluru" },
  { id: "s-04", tenantId: "tn-001", admissionNo: "ADM2025-004", name: "Ananya Nair",    classId: "c-05", parentId: "p-03", phone: "+91 98500 52345", avatar: "AN", dob: "2018-05-18", gender: "female", medicalNotes: "No known allergies", attendanceStatus: "present", attendancePct: 96, feeStatus: "paid",    feeDue: 0,     bloodGroup: "AB+", address: "78, Indiranagar, Bengaluru" },
  { id: "s-05", tenantId: "tn-001", admissionNo: "ADM2025-005", name: "Vivaan Gupta",   classId: "c-06", parentId: "p-04", phone: "+91 98600 62345", avatar: "VG", dob: "2017-09-30", gender: "male", medicalNotes: "Lactose intolerant - no dairy at snack time", attendanceStatus: "half-day",attendancePct: 88, feeStatus: "partial", feeDue: 8000,  bloodGroup: "O-",  address: "23, Koramangala, Bengaluru" },
  { id: "s-06", tenantId: "tn-001", admissionNo: "ADM2025-006", name: "Ishaan Mehta",   classId: "c-07", parentId: "p-05", phone: "+91 98700 72345", avatar: "IM", dob: "2016-12-05", gender: "male", medicalNotes: "No known allergies", attendanceStatus: "present", attendancePct: 92, feeStatus: "paid",    feeDue: 0,     bloodGroup: "A-",  address: "56, Jayanagar, Bengaluru" },
  { id: "s-07", tenantId: "tn-001", admissionNo: "ADM2025-007", name: "Saanvi Pillai",  classId: "c-04", parentId: "p-02", phone: "+91 98800 82345", avatar: "SP", dob: "2019-02-11", gender: "female", medicalNotes: "No known allergies", attendanceStatus: "present", attendancePct: 95, feeStatus: "paid",    feeDue: 0,     bloodGroup: "B-",  address: "9, HSR Layout, Bengaluru" },
  { id: "s-08", tenantId: "tn-001", admissionNo: "ADM2025-008", name: "Arjun Rao",      classId: "c-05", parentId: "p-03", phone: "+91 98900 92345", avatar: "AR", dob: "2018-06-25", gender: "male", medicalNotes: "No known allergies", attendanceStatus: "absent",  attendancePct: 82, feeStatus: "pending", feeDue: 15000, bloodGroup: "O+",  address: "34, Whitefield, Bengaluru" },
  { id: "s-09", tenantId: "tn-001", admissionNo: "ADM2025-009", name: "Myra Singh",     classId: "c-03", parentId: "p-04", phone: "+91 99010 02345", avatar: "MS", dob: "2019-08-19", gender: "female", medicalNotes: "No known allergies", attendanceStatus: "present", attendancePct: 90, feeStatus: "paid",    feeDue: 0,     bloodGroup: "A+",  address: "67, Electronic City, Bengaluru" },
  { id: "s-10", tenantId: "tn-001", admissionNo: "ADM2025-010", name: "Reyansh Kumar",  classId: "c-06", parentId: "p-05", phone: "+91 99020 12345", avatar: "RK", dob: "2017-04-14", gender: "male", medicalNotes: "No known allergies", attendanceStatus: "half-day",attendancePct: 85, feeStatus: "partial", feeDue: 6000,  bloodGroup: "AB-", address: "11, Marathahalli, Bengaluru" },
  { id: "s-11", tenantId: "tn-001", admissionNo: "ADM2025-011", name: "Aanya Joshi",    classId: "c-07", parentId: "p-01", phone: "+91 99030 22345", avatar: "AJ", dob: "2016-10-08", gender: "female", medicalNotes: "No known allergies", attendanceStatus: "present", attendancePct: 97, feeStatus: "paid",    feeDue: 0,     bloodGroup: "B+",  address: "90, Hebbal, Bengaluru" },
  { id: "s-12", tenantId: "tn-001", admissionNo: "ADM2025-012", name: "Aditya Menon",   classId: "c-08", parentId: "p-02", phone: "+91 99040 32345", avatar: "AM", dob: "2015-03-21", gender: "male", medicalNotes: "No known allergies", attendanceStatus: "present", attendancePct: 89, feeStatus: "pending", feeDue: 18000, bloodGroup: "O+",  address: "5, JP Nagar, Bengaluru" },
  { id: "s-13", tenantId: "tn-001", admissionNo: "ADM2025-013", name: "Kiara Desai",    classId: "c-08", parentId: "p-03", phone: "+91 99050 42345", avatar: "KD", dob: "2015-07-16", gender: "female", medicalNotes: "No known allergies", attendanceStatus: "present", attendancePct: 93, feeStatus: "paid",    feeDue: 0,     bloodGroup: "A-",  address: "28, Banashankari, Bengaluru" },
  { id: "s-14", tenantId: "tn-001", admissionNo: "ADM2025-014", name: "Vihaan Shah",    classId: "c-01", parentId: "p-04", phone: "+91 99060 52345", avatar: "VS", dob: "2021-01-12", gender: "male", medicalNotes: "No known allergies", attendanceStatus: "present", attendancePct: 80, feeStatus: "pending", feeDue: 9000,  bloodGroup: "B+",  address: "44, Yelahanka, Bengaluru" },
  { id: "s-15", tenantId: "tn-001", admissionNo: "ADM2025-015", name: "Anika Bose",     classId: "c-02", parentId: "p-05", phone: "+91 99070 62345", avatar: "AB", dob: "2020-05-09", gender: "female", medicalNotes: "No known allergies", attendanceStatus: "absent",  attendancePct: 76, feeStatus: "overdue", feeDue: 21000, bloodGroup: "O-",  address: "77, Malleshwaram, Bengaluru" },
];

// ---------------------------------------------------------------------------
// ATTENDANCE — daily records for one class (UKG) used in the attendance module
// ---------------------------------------------------------------------------
export const attendanceToday: AttendanceRecord[] = students
  .filter(s => s.classId === "c-04")
  .map((s) => ({
    id: `att-${s.id}`,
    studentId: s.id,
    studentName: s.name,
    classId: s.classId,
    date: new Date().toISOString().slice(0, 10),
    status: s.attendanceStatus,
    late: s.attendanceStatus === "half-day",
    reason: s.attendanceStatus === "absent" ? "Parent informed - fever" : s.attendanceStatus === "half-day" ? "Dental appointment" : undefined,
  }));

// Attendance trend — last 7 working days, school-wide %
export const attendanceTrend = [
  { day: "Mon", present: 186, absent: 14, rate: 93 },
  { day: "Tue", present: 190, absent: 10, rate: 95 },
  { day: "Wed", present: 178, absent: 22, rate: 89 },
  { day: "Thu", present: 192, absent: 8,  rate: 96 },
  { day: "Fri", present: 184, absent: 16, rate: 92 },
  { day: "Sat", present: 175, absent: 25, rate: 87 },
  { day: "Today", present: 188, absent: 12, rate: 94 },
];

// ---------------------------------------------------------------------------
// HOMEWORK
// ---------------------------------------------------------------------------
export const homeworks: Homework[] = [
  {
    id: "hw-01",
    title: "Addition & Subtraction Worksheet",
    description: "Complete exercises 1–12 on page 24. Show working for each problem.",
    classId: "c-04",
    subject: "Mathematics",
    teacherId: "t-01",
    teacherName: "Anil Verma",
    dueDate: "2026-07-04",
    assignedAt: "2026-07-01",
    fileUrl: "math-ws-04.pdf",
    attachmentName: "math-ws-04.pdf",
    status: "active",
    submissions: [
      { id: "sub-01", homeworkId: "hw-01", studentId: "s-01", studentName: "Aarav Iyer",    submittedAt: "2026-07-02T09:14:00", fileUrl: "aarav-hw01.pdf", status: "submitted" },
      { id: "sub-02", homeworkId: "hw-01", studentId: "s-07", studentName: "Saanvi Pillai", submittedAt: "2026-07-02T10:02:00", fileUrl: "saanvi-hw01.pdf", remarks: "Excellent work - neat and accurate!", status: "graded", grade: "A" },
      { id: "sub-03", homeworkId: "hw-01", studentId: "s-09", studentName: "Myra Singh",    submittedAt: "",                     status: "pending" },
    ],
  },
  {
    id: "hw-02",
    title: "My Family — Drawing",
    description: "Draw a picture of your family and label each member.",
    classId: "c-02",
    subject: "Art",
    teacherId: "t-04",
    teacherName: "Ritu Kapoor",
    dueDate: "2026-07-03",
    assignedAt: "2026-06-30",
    fileUrl: "family-template.png",
    attachmentName: "family-template.png",
    status: "active",
    submissions: [],
  },
  {
    id: "hw-03",
    title: "Rhymes Practice — Twinkle Twinkle",
    description: "Practice the rhyme with your parents and recite in class tomorrow.",
    classId: "c-01",
    subject: "Rhymes",
    teacherId: "t-04",
    teacherName: "Ritu Kapoor",
    dueDate: "2026-07-02",
    assignedAt: "2026-07-01",
    status: "active",
    submissions: [],
  },
  {
    id: "hw-04",
    title: "English Cursive — A to E",
    description: "Write each letter 5 times in cursive on ruled paper.",
    classId: "c-03",
    subject: "English",
    teacherId: "t-02",
    teacherName: "Sneha Rao",
    dueDate: "2026-06-30",
    assignedAt: "2026-06-28",
    status: "closed",
    submissions: [],
  },
  {
    id: "hw-05",
    title: "Plants Around Us — Observation",
    description: "List 5 plants you see at home and draw one leaf.",
    classId: "c-05",
    subject: "EVS",
    teacherId: "t-01",
    teacherName: "Anil Verma",
    dueDate: "2026-07-05",
    assignedAt: "2026-07-01",
    fileUrl: "evs-observation.pdf",
    attachmentName: "evs-observation.pdf",
    status: "active",
    submissions: [],
  },
];

// ---------------------------------------------------------------------------
// FEES
// ---------------------------------------------------------------------------
export const fees: Fee[] = [
  { id: "f-01", studentId: "s-02", studentName: "Diya Iyer",     classId: "c-02", term: "Q1 - Tuition",     category: "tuition",  amount: 25000, paidAmount: 12500, dueDate: "2026-07-10", status: "pending",  paymentMethod: "upi" },
  { id: "f-02", studentId: "s-03", studentName: "Kabir Reddy",   classId: "c-03", term: "Q1 - Tuition",     category: "tuition",  amount: 28000, paidAmount: 4000,  dueDate: "2026-06-25", status: "overdue",  paymentMethod: "card" },
  { id: "f-03", studentId: "s-05", studentName: "Vivaan Gupta",  classId: "c-06", term: "Q1 - Tuition",     category: "tuition",  amount: 30000, paidAmount: 22000, dueDate: "2026-07-15", status: "partial",  paymentMethod: "netbanking" },
  { id: "f-04", studentId: "s-08", studentName: "Arjun Rao",     classId: "c-05", term: "Q1 - Tuition",     category: "tuition",  amount: 30000, paidAmount: 15000, dueDate: "2026-07-12", status: "pending",  paymentMethod: "upi" },
  { id: "f-05", studentId: "s-10", studentName: "Reyansh Kumar", classId: "c-06", term: "Transport - Jul",  category: "transport",amount: 6000,  paidAmount: 0,     dueDate: "2026-07-05", status: "pending",  paymentMethod: "upi" },
  { id: "f-06", studentId: "s-12", studentName: "Aditya Menon",  classId: "c-08", term: "Q1 - Tuition",     category: "tuition",  amount: 32000, paidAmount: 14000, dueDate: "2026-07-08", status: "pending",  paymentMethod: "card" },
  { id: "f-07", studentId: "s-14", studentName: "Vihaan Shah",   classId: "c-01", term: "Q1 - Activity",    category: "activity", amount: 9000,  paidAmount: 0,     dueDate: "2026-07-20", status: "pending",  paymentMethod: "upi" },
  { id: "f-08", studentId: "s-15", studentName: "Anika Bose",    classId: "c-02", term: "Q1 - Tuition",     category: "tuition",  amount: 25000, paidAmount: 4000,  dueDate: "2026-06-20", status: "overdue",  paymentMethod: "netbanking" },
  { id: "f-09", studentId: "s-01", studentName: "Aarav Iyer",    classId: "c-04", term: "Q1 - Tuition",     category: "tuition",  amount: 28000, paidAmount: 28000, dueDate: "2026-06-15", status: "paid",     paymentMethod: "upi",     paidAt: "2026-06-10", receiptNo: "RCPT-2026-0451" },
  { id: "f-10", studentId: "s-04", studentName: "Ananya Nair",   classId: "c-05", term: "Q1 - Tuition",     category: "tuition",  amount: 30000, paidAmount: 30000, dueDate: "2026-06-15", status: "paid",     paymentMethod: "card",    paidAt: "2026-06-08", receiptNo: "RCPT-2026-0448" },
  { id: "f-11", studentId: "s-06", studentName: "Ishaan Mehta",  classId: "c-07", term: "Q1 - Tuition",     category: "tuition",  amount: 30000, paidAmount: 30000, dueDate: "2026-06-15", status: "paid",     paymentMethod: "netbanking", paidAt: "2026-06-12", receiptNo: "RCPT-2026-0460" },
  { id: "f-12", studentId: "s-13", studentName: "Kiara Desai",   classId: "c-08", term: "Q1 - Tuition",     category: "tuition",  amount: 32000, paidAmount: 32000, dueDate: "2026-06-15", status: "paid",     paymentMethod: "upi",     paidAt: "2026-06-09", receiptNo: "RCPT-2026-0449" },
];

export const payments: Payment[] = [
  { id: "pay-01", feeId: "f-09", studentId: "s-01", amount: 28000, method: "upi",        transactionId: "UPI-8841230921",  paidAt: "2026-06-10", receiptNo: "RCPT-2026-0451", receiptUrl: "/receipts/RCPT-2026-0451.pdf", status: "success" },
  { id: "pay-02", feeId: "f-10", studentId: "s-04", amount: 30000, method: "card",       transactionId: "CARD-4129558201", paidAt: "2026-06-08", receiptNo: "RCPT-2026-0448", receiptUrl: "/receipts/RCPT-2026-0448.pdf", status: "success" },
  { id: "pay-03", feeId: "f-11", studentId: "s-06", amount: 30000, method: "netbanking", transactionId: "NB-HDFC-7712034",  paidAt: "2026-06-12", receiptNo: "RCPT-2026-0460", receiptUrl: "/receipts/RCPT-2026-0460.pdf", status: "success" },
  { id: "pay-04", feeId: "f-12", studentId: "s-13", amount: 32000, method: "upi",        transactionId: "UPI-5510293847",  paidAt: "2026-06-09", receiptNo: "RCPT-2026-0449", receiptUrl: "/receipts/RCPT-2026-0449.pdf", status: "success" },
  { id: "pay-05", feeId: "f-03", studentId: "s-05", amount: 22000, method: "netbanking", transactionId: "NB-ICICI-3301287", paidAt: "2026-06-20", receiptNo: "RCPT-2026-0470", receiptUrl: "/receipts/RCPT-2026-0470.pdf", status: "success" },
];

// Fee collection summary — last 6 months
export const feeCollectionTrend = [
  { month: "Feb", collected: 185000, pending: 22000 },
  { month: "Mar", collected: 210000, pending: 18000 },
  { month: "Apr", collected: 240000, pending: 30000 },
  { month: "May", collected: 195000, pending: 26000 },
  { month: "Jun", collected: 320000, pending: 42000 },
  { month: "Jul", collected: 145000, pending: 68000 },
];

// Fee category breakdown (for pie/donut)
export const feeCategoryBreakdown = [
  { name: "Tuition",   value: 320000, fill: "var(--chart-1)" },
  { name: "Transport", value: 48000,  fill: "var(--chart-2)" },
  { name: "Activity",  value: 36000,  fill: "var(--chart-3)" },
  { name: "Library",   value: 18000,  fill: "var(--chart-4)" },
  { name: "Exam",      value: 24000,  fill: "var(--chart-5)" },
];

// ---------------------------------------------------------------------------
// NOTIFICATIONS / NOTICES
// ---------------------------------------------------------------------------
export const notifications: NotificationItem[] = [
  {
    id: "n-01",
    type: "emergency",
    title: "Emergency: School Closed Tomorrow",
    message: "Due to heavy rainfall warning, the school will remain closed on 3rd July. Online classes for Grade 3+ via the parent portal.",
    date: "2026-07-01T08:30:00",
    audience: "all",
    read: false,
    priority: "high",
  },
  {
    id: "n-02",
    type: "holiday",
    title: "Holiday — Guru Purnima",
    message: "School will remain closed on 10th July (Friday) on account of Guru Purnima. Classes resume Monday 13th July.",
    date: "2026-06-30T16:00:00",
    audience: "all",
    read: false,
    priority: "medium",
  },
  {
    id: "n-03",
    userId: "u-parent",
    type: "homework",
    title: "Homework Reminder — Aarav (UKG)",
    message: "Mathematics worksheet (Addition & Subtraction) is due on 4th July. Please ensure Aarav completes exercises 1–12.",
    date: "2026-07-01T14:20:00",
    audience: ["parent"],
    read: false,
    priority: "medium",
  },
  {
    id: "n-04",
    userId: "u-parent",
    type: "fee",
    title: "Fee Reminder — Diya (Nursery)",
    message: "Q1 Tuition fee of ₹12,500 is due on 10th July. Pay via UPI, Card, or Net Banking to avoid late charges.",
    date: "2026-07-01T11:00:00",
    audience: ["parent"],
    read: true,
    priority: "high",
  },
  {
    id: "n-05",
    type: "general",
    title: "Parent-Teacher Meeting",
    message: "PTM scheduled for 12th July, 10:00 AM – 1:00 PM. Slot booking opens on the parent portal from 5th July.",
    date: "2026-06-29T10:00:00",
    audience: "all",
    read: true,
    priority: "low",
  },
  {
    id: "n-06",
    userId: "u-parent",
    type: "fee",
    title: "Overdue Fee — Kabir Reddy",
    message: "Q1 Tuition fee of ₹24,000 is overdue since 25th June. Kindly clear the dues at the earliest.",
    date: "2026-06-28T09:15:00",
    audience: ["parent", "admin"],
    read: false,
    priority: "high",
  },
  {
    id: "n-07",
    type: "general",
    title: "Annual Day Auditions",
    message: "Auditions for the Annual Day cultural program begin 7th July. Open to all classes Nursery onwards.",
    date: "2026-06-27T13:30:00",
    audience: ["teacher", "parent"],
    read: true,
    priority: "low",
  },
];

// ---------------------------------------------------------------------------
// DAILY ACTIVITY (for parent dashboard)
// ---------------------------------------------------------------------------
export const dailyActivities: DailyActivity[] = [
  { id: "da-01", studentId: "s-01", date: "2026-07-01", title: "Morning Assembly",        description: "Led the pledge; topic: Kindness",          category: "class",    time: "08:30" },
  { id: "da-02", studentId: "s-01", date: "2026-07-01", title: "Mathematics Class",      description: "Practised 2-digit addition",              category: "class",    time: "09:15" },
  { id: "da-03", studentId: "s-01", date: "2026-07-01", title: "Snack Break",            description: "Ate fruit & sandwich",                    category: "break",    time: "10:30" },
  { id: "da-04", studentId: "s-01", date: "2026-07-01", title: "Art & Craft",           description: "Made a paper frog",                       category: "activity", time: "11:00" },
  { id: "da-05", studentId: "s-01", date: "2026-07-01", title: "Lunch",                  description: "Had rice, dal & vegetables",              category: "meal",     time: "12:30" },
  { id: "da-06", studentId: "s-01", date: "2026-07-01", title: "Story Time",             description: "The Lion and the Mouse",                  category: "activity", time: "13:30" },
  { id: "da-07", studentId: "s-01", date: "2026-07-01", title: "Outdoor Play",           description: "Played on the slides & swings",           category: "activity", time: "14:15" },
];

// ---------------------------------------------------------------------------
// AGGREGATES for admin dashboard
// ---------------------------------------------------------------------------
export const dashboardStats = {
  totalStudents: students.length,
  totalTeachers: teachers.length,
  attendancePct: 94,
  pendingFees: fees.filter(f => f.status !== "paid").reduce((sum, f) => sum + (f.amount - f.paidAmount), 0),
  activeClasses: classes.length,
};

// ---------------------------------------------------------------------------
// Student progress data (for reports)
// ---------------------------------------------------------------------------
export const studentProgress = [
  { subject: "English",    score: 88, previous: 82 },
  { subject: "Maths",      score: 92, previous: 85 },
  { subject: "Science",    score: 85, previous: 80 },
  { subject: "Social",     score: 79, previous: 76 },
  { subject: "Art",        score: 95, previous: 90 },
];

// Class-wise attendance for reports
export const classAttendanceReport = classes.map(c => {
  const cs = students.filter(s => s.classId === c.id);
  const avg = cs.length ? Math.round(cs.reduce((a, s) => a + s.attendancePct, 0) / cs.length) : 0;
  return { class: c.name, attendance: avg, students: cs.length };
});

// Monthly attendance for reports (last 6 months)
export const monthlyAttendance = [
  { month: "Feb", rate: 91 },
  { month: "Mar", rate: 93 },
  { month: "Apr", rate: 90 },
  { month: "May", rate: 88 },
  { month: "Jun", rate: 94 },
  { month: "Jul", rate: 92 },
];

// Helpers
export const getClassById = (id: string) => classes.find(c => c.id === id);
export const getTeacherById = (id: string) => {
  const t = teachers.find(t => t.id === id);
  if (!t) return undefined;
  const u = users.find(u => u.id === t.userId);
  return t && u ? { ...t, name: u.name, avatar: u.avatar, email: u.email } : undefined;
};
export const getStudentById = (id: string) => students.find(s => s.id === id);
