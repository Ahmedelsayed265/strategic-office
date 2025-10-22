import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeInterface {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useThemeStore = create<ThemeInterface>()(
  persist(
    (set) => ({
      open: true,
      setOpen: (open) => set({ open }),
    }),
    {
      name: "sidebar-storage",
    }
  )
);
