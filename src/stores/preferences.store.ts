import { create } from "zustand"
import { persist } from "zustand/middleware"

type PreferencesStore = {
  readonly emailNotifications: boolean
  readonly soundEnabled: boolean
  readonly twoFactorEnabled: boolean
  readonly setEmailNotifications: (enabled: boolean) => void
  readonly setSoundEnabled: (enabled: boolean) => void
  readonly setTwoFactorEnabled: (enabled: boolean) => void
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      emailNotifications: true,
      soundEnabled: true,
      twoFactorEnabled: false,
      setEmailNotifications: (enabled) =>
        set({ emailNotifications: enabled }),
      setSoundEnabled: (enabled) =>
        set({ soundEnabled: enabled }),
      setTwoFactorEnabled: (enabled) =>
        set({ twoFactorEnabled: enabled }),
    }),
    { name: "fiscon-preferences" },
  ),
)
