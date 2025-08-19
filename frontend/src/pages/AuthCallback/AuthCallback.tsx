import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { supabaseAuthSuccess } from '../../store/slices/authSlice';
import { supabase } from '../../utils/supabaseClient';

export function AuthCallback() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Prevent multiple executions
      if (hasProcessed) {
        return;
      }
      
      try {
        // If user is already authenticated by the global listener, redirect immediately
        if (isAuthenticated && user) {
          setHasProcessed(true);
          window.location.href = '/';
          return;
        }

        // Get the session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
          setIsProcessing(false);
          return;
        }

        if (session) {
          const userData = {
            id: session.user.id || '',
            table_id: '',
            email: session.user.email || '',
            first_name: session.user.user_metadata?.given_name || session.user.user_metadata?.first_name || 'User',
            last_name: session.user.user_metadata?.family_name || session.user.user_metadata?.last_name || '',
            profile_picture: session.user.user_metadata?.picture || session.user.user_metadata?.avatar_url || '',
            email_verified: session.user.email_confirmed_at ? true : false,
            is_admin: false,
            isMember: false, // Will be updated by the global auth listener
          };
          
          dispatch(supabaseAuthSuccess({ user: userData, token: session.access_token }));
          setHasProcessed(true);
          window.location.href = '/';
        } else {
          setHasProcessed(true);
          setError('Authentication failed.');
          setIsProcessing(false);
        }
      } catch (error) {
        setHasProcessed(true);
        setError('Authentication failed. Please try again.');
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [dispatch, isAuthenticated, user]);

  // If user is already authenticated, redirect immediately
  if (isAuthenticated && user) {
    window.location.href = '/';
    return null;
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flat-gold mx-auto"></div>
            <div className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Completing Authentication
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please wait while we complete your Google authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 w-1/2">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Authentication Failed
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {error}
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-flat-gold hover:bg-flat-gold-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flat-gold"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
