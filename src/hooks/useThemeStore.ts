import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTheme = 'sunset' | 'midnight' | 'forest';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface ThemeStore {
  mode: 'light' | 'dark';
  theme: AppTheme;
  fontSize: FontSize;
  offlineMode: boolean;
  setMode: (mode: 'light' | 'dark') => void;
  setTheme: (theme: AppTheme) => void;
  setFontSize: (fontSize: FontSize) => void;
  setOfflineMode: (enabled: boolean) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      theme: 'sunset',
      fontSize: 'medium',
      offlineMode: false,
      setMode: (mode: 'light' | 'dark') => set({ mode }),
      setTheme: (theme: AppTheme) => set({ theme }),
      setFontSize: (fontSize: FontSize) => set({ fontSize }),
      setOfflineMode: (offlineMode: boolean) => set({ offlineMode }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'cognito-theme-storage',
    }
  )
);
