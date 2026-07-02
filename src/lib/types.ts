// Data model types — based on ERD: TENANTS, USERS, PARENTS, TEACHERS,
// CLASSES, STUDENTS, ATTENDANCE, HOMEWORK, HOMEWORK_SUBMISSIONS,
// FEES, PAYMENTS, NOTIFICATIONS.

export type Role = "admin" | "teacher" | "parent";

export type AttendanceStatus = "present" | "absent" | "half-day";

export type FeeStatus = "paid" | "pending" | "overdue" | "partial";

export type PaymentMethod = "upi" | "card" | "netbanking";

export type NoticeType = "holiday" | "homework" | "fee" | "emergency" | "general";

export interface Tenant {
  id: string;
  tenantId: string;       // ERD: tenant_id (human-readable code)
  name: string;
  shortName: string;      // display abbreviation
  type: string;            // ERD: type (e.g. "Pre-School", "Training Centre")
  branch: string;          // ERD: branch (e.g. "Bengaluru - HSR")
  logo: string;
  academicYear: string;    // ERD: academic_year
}

export interface User {
  id: string;
  tenantId: string;        // ERD: tenant_id FK
  name: string;
  email: string;
  passwordHash?: string;   // ERD: password_hash (never shown)
  role: Role;              // ERD: role enum
  phone: string;
  status: boolean;         // ERD: status (active/inactive)
  avatar: string;
}

export interface Parent {
  id: string;
  userId: string;          // ERD: user_id FK → USERS
  name: string;            // ERD: name (denormalised for display)
  phone: string;           // ERD: phone
  email: string;           // ERD: email
  occupation: string;      // extra display field
  childIds: string[];
}

export interface Teacher {
  id: string;
  userId: string;          // ERD: user_id FK → USERS
  tenantId: string;        // ERD: tenant_id FK
  subjects: string[];      // ERD: subject (diagram singular; we support multiple)
  qualification: string;   // ERD: qualification
  joinedAt: string;
  experienceYears: number;
}

export interface ClassRoom {
  id: string;
  tenantId: string;        // ERD: tenant_id FK
  name: string;            // ERD: class_name (e.g. "Grade 3")
  grade: string;
  section: string;         // ERD: section
  teacherId: string;       // ERD: teacher_id FK → TEACHERS
  room: string;            // ERD: room
  studentCount: number;
  capacity: number;
  subjects: string[];
}

export interface Student {
  id: string;
  userId?: string;         // ERD: user_id FK → USERS (login account, if any)
  tenantId: string;        // ERD: tenant_id FK
  admissionNo: string;
  name: string;
  classId: string;         // ERD: class_id FK → CLASSES
  parentId: string;        // ERD: parent_id FK → PARENTS
  phone: string;
  avatar: string;
  dob: string;             // ERD: dob
  gender: "male" | "female"; // ERD: gender enum
  medicalNotes: string;    // ERD: medical_notes (allergies, conditions — critical for pre-school)
  attendanceStatus: AttendanceStatus;   // today's status (for table display)
  attendancePct: number;                // cumulative %
  feeStatus: FeeStatus;
  feeDue: number;
  bloodGroup: string;
  address: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;      // ERD: student_id FK → STUDENTS
  studentName: string;
  classId: string;        // ERD: class_id FK → CLASSES
  date: string;           // ERD: attendance_date
  status: AttendanceStatus; // ERD: status enum
  late: boolean;          // ERD: late
  reason?: string;        // ERD: reason (absence/late reason)
}

export interface Homework {
  id: string;
  classId: string;        // ERD: class_id FK → CLASSES
  teacherId: string;      // ERD: teacher_id FK → TEACHERS
  title: string;          // ERD: title
  description: string;    // ERD: description
  fileUrl?: string;       // ERD: file_url (attachment)
  attachmentName?: string;
  dueDate: string;        // ERD: due_date
  subject: string;
  teacherName: string;
  assignedAt: string;
  status: "active" | "closed";
  submissions: HomeworkSubmission[];
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;     // ERD: homework_id FK → HOMEWORK
  studentId: string;      // ERD: student_id FK → STUDENTS
  studentName: string;
  fileUrl?: string;       // ERD: file_url (submitted file)
  remarks?: string;       // ERD: remarks (teacher feedback)
  submittedAt: string;    // ERD: submitted_at
  status: "submitted" | "pending" | "late" | "graded";
  grade?: string;
}

export interface Fee {
  id: string;
  studentId: string;      // ERD: student_id FK → STUDENTS
  studentName: string;
  classId: string;
  term: string;           // e.g. "Q1 - Tuition"
  category: "tuition" | "transport" | "library" | "activity" | "exam";
  amount: number;         // ERD: amount
  paidAmount: number;
  dueDate: string;        // ERD: due_date
  status: FeeStatus;      // ERD: status enum
  paymentMethod?: PaymentMethod;
  paidAt?: string;
  receiptNo?: string;
}

export interface Payment {
  id: string;
  feeId: string;          // ERD: fee_id FK → FEES
  studentId: string;
  amount: number;         // ERD: amount
  method: PaymentMethod;  // ERD: payment_method
  transactionId: string;  // ERD: transaction_id
  paidAt: string;         // ERD: paid_at
  receiptNo: string;
  receiptUrl: string;     // ERD: receipt_url
  status: "success" | "pending" | "failed";
}

export interface NotificationItem {
  id: string;
  userId?: string;        // ERD: user_id FK → USERS (null/omitted = broadcast)
  type: NoticeType;       // ERD: type
  title: string;          // ERD: title
  message: string;        // ERD: message
  date: string;           // ERD: created_at
  audience: Role[] | "all"; // derived routing helper
  read: boolean;          // ERD: read_status
  priority: "low" | "medium" | "high";
}

export interface DailyActivity {
  id: string;
  studentId: string;
  date: string;
  title: string;
  description: string;
  category: "class" | "break" | "activity" | "meal" | "event";
  time: string;
}

// Navigation
export interface NavItem {
  id: string;
  label: string;
  icon: string;       // lucide icon name
  roles: Role[];
  badge?: number;
}
