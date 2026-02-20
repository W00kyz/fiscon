import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types/auth.ts"

type AuthStore = {
  readonly user: User | null
  readonly isAuthenticated: boolean
  readonly login: (user: User) => void
  readonly logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user: User) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "fiscon-auth" },
  ),
)
