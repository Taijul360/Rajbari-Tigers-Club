import { useEffect, ReactNode } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { fetchSettings, isLoading } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (isLoading) {
    return <div className="min-h-screen bg-bone flex items-center justify-center text-tiger-navy font-bangla font-bold">লোড হচ্ছে...</div>;
  }

  return <>{children}</>;
}
