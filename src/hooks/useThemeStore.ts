import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTheme = 'sunset' | 'midnight' | 'forest';

interface ThemeStore {
  mode: 'light' | 'dark';
  theme: AppTheme;
  setMode: (mode: 'light' | 'dark') => void;
  setTheme: (theme: AppTheme) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      theme: 'sunset',
      setMode: (mode: 'light' | 'dark') => set({ mode }),
      setTheme: (theme: AppTheme) => set({ theme }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'cognito-theme-storage',
    }
  )
);
