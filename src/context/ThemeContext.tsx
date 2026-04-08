import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
  colors: typeof darkColors;
}

const darkColors = {
  bg: '#0a0a0a',
  card: '#141418',
  border: '#1f1f23',
  accent: '#22c55e',
  text: '#ffffff',
  subtext: '#6b7280',
  input: '#1a1a1e',
  navBg: '#0d0d0d',
  navBorder: '#1f1f23',
  loginBg: '#0a0a0a',
  formContainer: '#141418',
  roleInactive: '#1a1a1e',
  roleSelected: '#166534',
  buttonBg: '#141418',
  buttonText: '#22c55e',
};

const lightColors = {
  bg: '#f8faf8',
  card: '#ffffff',
  border: '#e5e7eb',
  accent: '#16a34a',
  text: '#111827',
  subtext: '#6b7280',
  input: '#f3f4f6',
  navBg: '#ffffff',
  navBorder: '#e5e7eb',
  loginBg: '#f0fdf4',
  formContainer: '#ffffff',
  roleInactive: '#f9fafb',
  roleSelected: '#dcfce7',
  buttonBg: '#15803d',
  buttonText: '#ffffff',
};

const THEME_STORAGE_KEY = 'agripresyo_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return (stored === 'light' || stored === 'dark') ? stored : 'dark';
    } catch {
      return 'dark';
    }
  });

  const isDark = theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
