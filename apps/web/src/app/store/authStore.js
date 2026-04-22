import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  role: "",
  setUser: (user) => set({ user, role: user?.role || "" }),
  clearUser: () => set({ user: null, role: "" })
}));

