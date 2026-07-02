"use client";

import { useAppStore } from "@/store/app-store";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LoginPage } from "@/components/auth/login-page";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { StudentManagement } from "@/components/students/student-management";
import { ClassManagement } from "@/components/classes/class-management";
import { AttendanceModule } from "@/components/attendance/attendance-module";
import { HomeworkModule } from "@/components/homework/homework-module";
import { FeeManagement } from "@/components/fees/fee-management";
import { ParentDashboard } from "@/components/parent/parent-dashboard";
import { NotificationsPage } from "@/components/notifications/notifications-page";
import { ReportsPage } from "@/components/reports/reports-page";

export default function Home() {
  const { isAuthenticated, activeView, role } = useAppStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderView = () => {
    // Parent role: dashboard view shows parent dashboard
    if (role === "parent" && activeView === "parent-dashboard") {
      return <ParentDashboard />;
    }
    // Guard: parent should not see admin-only views
    if (role === "parent" && ["students", "classes", "attendance", "reports"].includes(activeView)) {
      return <ParentDashboard />;
    }

    switch (activeView) {
      case "dashboard":        return <AdminDashboard />;
      case "students":         return <StudentManagement />;
      case "classes":          return <ClassManagement />;
      case "attendance":       return <AttendanceModule />;
      case "homework":         return <HomeworkModule />;
      case "fees":             return <FeeManagement />;
      case "parent-dashboard": return <ParentDashboard />;
      case "notifications":    return <NotificationsPage />;
      case "reports":          return <ReportsPage />;
      default:                 return <AdminDashboard />;
    }
  };

  return <DashboardShell>{renderView()}</DashboardShell>;
}
