import { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useAppSelector(state => state.status.theme);

  useEffect(() => {
    const root = document.documentElement;
    
    // Explicitly remove any existing dark class first
    root.classList.remove('dark');
    
    // Then add it only if theme is dark
    if (theme === 'dark') {
      root.classList.add('dark');
    }
  }, [theme]);

  return <>{children}</>;
} 