import { create } from 'zustand';
import { fetchApi } from '../lib/api/client';

interface SettingsState {
  settings: any | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: any) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: true,
  error: null,
  fetchSettings: async () => {
    try {
      const data = await fetchApi<any>('/settings/public');
      set({ settings: data, isLoading: false, error: null });
      // Apply theme to DOM
      applyTheme(data?.theme);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateSettings: async (newSettings) => {
    try {
      set({ isLoading: true });
      const data = await fetchApi<any>('/settings', {
        method: 'PATCH',
        body: JSON.stringify(newSettings),
      });
      set({ settings: data, isLoading: false, error: null });
      // Apply theme to DOM
      applyTheme(data?.theme);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

function applyTheme(theme: any) {
  if (!theme) return;
  const root = document.documentElement;
  if (theme.navy) root.style.setProperty('--theme-tiger-navy', theme.navy);
  if (theme.royal) root.style.setProperty('--theme-tiger-royal', theme.royal);
  if (theme.orange) root.style.setProperty('--theme-tiger-orange', theme.orange);
  if (theme.gold) root.style.setProperty('--theme-tiger-gold', theme.gold);
  if (theme.bone) root.style.setProperty('--theme-bone', theme.bone);
  if (theme.ink) root.style.setProperty('--theme-ink', theme.ink);
  if (theme.radiusScale) root.style.setProperty('--theme-radius-scale', theme.radiusScale);
}
