import type { Role } from "@/lib/types";
import type { ViewId } from "@/store/app-store";
import {
  LayoutDashboard, Users, School, CalendarCheck, BookOpen,
  Wallet, Bell, BarChart3, GraduationCap,
} from "lucide-react";

export interface NavEntry {
  id: ViewId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

export const navConfig: NavEntry[] = [
  { id: "dashboard",        label: "Dashboard",     icon: LayoutDashboard, roles: ["admin", "teacher"] },
  { id: "parent-dashboard", label: "Dashboard",     icon: LayoutDashboard, roles: ["parent"] },
  { id: "students",         label: "Students",      icon: Users,           roles: ["admin", "teacher"] },
  { id: "classes",          label: "Classes",       icon: School,          roles: ["admin", "teacher"] },
  { id: "attendance",       label: "Attendance",    icon: CalendarCheck,   roles: ["admin", "teacher"] },
  { id: "homework",         label: "Homework",      icon: BookOpen,        roles: ["admin", "teacher", "parent"] },
  { id: "fees",             label: "Fees",          icon: Wallet,          roles: ["admin", "parent"] },
  { id: "notifications",    label: "Notices",       icon: Bell,            roles: ["admin", "teacher", "parent"] },
  { id: "reports",          label: "Reports",       icon: BarChart3,       roles: ["admin", "teacher"] },
];

export function navForRole(role: Role | null): NavEntry[] {
  if (!role) return [];
  return navConfig.filter(n => n.roles.includes(role));
}

export const roleLabels: Record<Role, string> = {
  admin: "Administrator",
  teacher: "Teacher",
  parent: "Parent",
};

export const roleIcons: Record<Role, React.ComponentType<{ className?: string }>> = {
  admin: GraduationCap,
  teacher: BookOpen,
  parent: Users,
};
