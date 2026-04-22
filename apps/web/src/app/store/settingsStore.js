import { create } from "zustand";

export const useSettingsStore = create((set) => ({
  locale: "ar",
  direction: "rtl",
  setLocale: (locale) => set({ locale }),
  setDirection: (direction) => set({ direction })
}));

