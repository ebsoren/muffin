import { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useAppSelector(state => state.status.theme);

  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('dark');
    if (theme === 'dark') {
      root.classList.add('dark');
    }
  }, [theme]);

  return <>{children}</>;
} 