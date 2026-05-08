import { useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getSystemTheme(): EffectiveTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' ? v : 'system';
}

function applyClass(effective: EffectiveTheme) {
  const root = document.documentElement;
  root.classList.toggle('dark', effective === 'dark');
}

// Call once before React renders so first paint matches the user's preference.
export function applyThemeOnInit() {
  const stored = readStoredTheme();
  const effective = stored === 'system' ? getSystemTheme() : stored;
  applyClass(effective);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const [effective, setEffective] = useState<EffectiveTheme>(() =>
    theme === 'system' ? getSystemTheme() : theme
  );

  useEffect(() => {
    const next = theme === 'system' ? getSystemTheme() : theme;
    setEffective(next);
    applyClass(next);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const next: EffectiveTheme = mq.matches ? 'dark' : 'light';
      setEffective(next);
      applyClass(next);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    if (next === 'system') window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  return { theme, effective, setTheme };
}
