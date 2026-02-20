import { create } from "zustand"
import { persist } from "zustand/middleware"

type SidebarStore = {
  readonly collapsed: boolean
  readonly toggle: () => void
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      collapsed: false,
      toggle: () => set((state) => ({ collapsed: !state.collapsed })),
    }),
    { name: "fiscon-sidebar" },
  ),
)
