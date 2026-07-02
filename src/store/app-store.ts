"use client";

import { create } from "zustand";
import type { Role } from "@/lib/types";
import { users } from "@/lib/mock-data";

export type ViewId =
  | "dashboard"
  | "students"
  | "classes"
  | "attendance"
  | "homework"
  | "fees"
  | "parent-dashboard"
  | "notifications"
  | "reports";

interface AppState {
  // auth
  role: Role | null;
  userName: string;
  userEmail: string;
  userAvatar: string;
  isAuthenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;

  // navigation
  activeView: ViewId;
  setView: (v: ViewId) => void;

  // sidebar (mobile)
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // loading simulation
  isLoading: boolean;
  setLoading: (b: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: null,
  userName: "",
  userEmail: "",
  userAvatar: "",
  isAuthenticated: false,
  login: (role) => {
    const u = users.find(x => x.role === role) ?? users[0];
    set({
      role,
      userName: u.name,
      userEmail: u.email,
      userAvatar: u.avatar,
      isAuthenticated: true,
      activeView: role === "parent" ? "parent-dashboard" : "dashboard",
      isLoading: true,
    });
    // simulate a brief loading state on login
    setTimeout(() => set({ isLoading: false }), 650);
  },
  logout: () =>
    set({
      role: null,
      userName: "",
      userEmail: "",
      userAvatar: "",
      isAuthenticated: false,
      activeView: "dashboard",
      sidebarOpen: false,
    }),

  activeView: "dashboard",
  setView: (v) => {
    set({ activeView: v, isLoading: true, sidebarOpen: false });
    setTimeout(() => set({ isLoading: false }), 450);
  },

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  isLoading: false,
  setLoading: (b) => set({ isLoading: b }),
}));
