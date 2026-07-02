"use client";

import { useAppStore } from "@/store/app-store";
import { tenant, notifications } from "@/lib/mock-data";
import { roleLabels } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Menu, Search, Bell, Sun, Moon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

export function Navbar() {
  const { role, setSidebarOpen, userName, userAvatar, setView, logout } = useAppStore();
  const { theme, setTheme } = useTheme();
  // next-themes resolves on the client; show a neutral icon until then
  const isDark = theme === "dark";

  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/80 backdrop-blur-md px-4 sm:px-6">
      {/* Mobile menu */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="relative hidden sm:block w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search students, classes, homework…"
          className="h-9 pl-9 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-border"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          onClick={() => setView("notifications")}
        >
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 gap-2 px-1.5 sm:px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {userAvatar || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-tight">{userName || "Guest"}</p>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {role ? roleLabels[role] : ""}
                </p>
              </div>
              <ChevronDown className="hidden md:block h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground">{tenant.shortName}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setView(role === "parent" ? "parent-dashboard" : "dashboard")}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView("notifications")}>
              Notifications
              {unread > 0 && (
                <Badge variant="secondary" className="ml-auto text-[10px]">{unread}</Badge>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView("reports")} className={cn(role === "parent" && "hidden")}>
              Reports
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-rose-600 focus:text-rose-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
