"use client";

import Link from "next/link";
import { useAppStore } from "@/store/app-store";
import { navForRole, roleLabels } from "@/lib/nav";
import { tenant } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { GraduationCap, X, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Sidebar() {
  const { role, activeView, setView, sidebarOpen, setSidebarOpen, userName, userAvatar, logout } =
    useAppStore();

  const items = navForRole(role);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between gap-2 border-b border-sidebar-border px-5">
          <Link href="#" className="flex items-center gap-2.5 min-w-0" onClick={() => setView(role === "parent" ? "parent-dashboard" : "dashboard")}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">Smart TSM</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">{tenant.academicYear}</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scroll-thin px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Menu
          </p>
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = activeView === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setView(item.id)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "" : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground")} />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Upgrade card */}
          <div className="mt-6 rounded-xl bg-gradient-to-br from-sidebar-primary/90 to-sidebar-primary p-4 text-sidebar-primary-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <p className="text-sm font-semibold">On the Roadmap</p>
            </div>
            <p className="mt-1.5 text-xs text-sidebar-primary-foreground/80">
              Transport tracking, live PTM booking &amp; AI report cards.
            </p>
            <Button size="sm" variant="secondary" className="mt-3 w-full bg-sidebar-primary-foreground/15 text-sidebar-primary-foreground hover:bg-sidebar-primary-foreground/25">
              Coming Soon
            </Button>
          </div>
        </nav>

        {/* User footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="h-9 w-9 border border-sidebar-border">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
                {userAvatar || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{userName || "Guest"}</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">
                {role ? roleLabels[role] : "Not signed in"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              onClick={logout}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
