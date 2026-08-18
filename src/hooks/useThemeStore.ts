import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTheme = 'sunset' | 'midnight' | 'forest';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface ThemeStore {
  mode: 'light' | 'dark';
  theme: AppTheme;
  fontSize: FontSize;
  setMode: (mode: 'light' | 'dark') => void;
  setTheme: (theme: AppTheme) => void;
  setFontSize: (fontSize: FontSize) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      theme: 'sunset',
      fontSize: 'medium',
      setMode: (mode: 'light' | 'dark') => set({ mode }),
      setTheme: (theme: AppTheme) => set({ theme }),
      setFontSize: (fontSize: FontSize) => set({ fontSize }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'cognito-theme-storage',
    }
  )
);
