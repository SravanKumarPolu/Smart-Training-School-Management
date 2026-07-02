"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { useAppStore } from "@/store/app-store";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const isLoading = useAppStore((s) => s.isLoading);
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-8 w-64 rounded-lg bg-muted" />
                <div className="h-4 w-96 rounded bg-muted" />
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
