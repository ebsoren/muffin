import { useState, useEffect } from 'react';

interface DelayedLoadingSpinnerProps {
  isLoading: boolean;
  delay?: number; // Delay in milliseconds before showing spinner
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fallback?: React.ReactNode;
}

export function DelayedLoadingSpinner({
  isLoading,
  delay = 500,
  size = 'md',
  className = '',
  fallback = null
}: DelayedLoadingSpinnerProps) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShouldShow(true);
      }, delay);
    } else {
      setShouldShow(false);
    }

    // Cleanup timeout on unmount or when loading changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, delay]);

  // Don't show anything if not loading or if delay hasn't passed
  if (!isLoading || !shouldShow) {
    return fallback ? <>{fallback}</> : null;
  }

  // Show the spinner after the delay
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };


  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-flat-gold ${sizeClasses[size]}`}></div>
    </div>
  );
}

export default DelayedLoadingSpinner;
