import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { supabaseAuthSuccess } from '../../store/slices/authSlice';
import { supabase } from '../../utils/supabaseClient';
import { extractUserDataFromSession } from '../../main';

export function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('AuthCallback: handleAuthCallback called, current state:', { isAuthenticated, user });
      
      try {
        // If user is already authenticated by the global listener, redirect immediately
        if (isAuthenticated && user) {
          console.log('AuthCallback: User already authenticated, redirecting...');
          navigate('/', { replace: true });
          return;
        }

        // Get the session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('AuthCallback: Supabase session check result:', { session, error });
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
          setIsProcessing(false);
          return;
        }

        if (session) {
          // User is authenticated with Supabase
          console.log('AuthCallback: User authenticated with Supabase:', session.user);
          
          try {
            const userData = await extractUserDataFromSession(session);

            console.log('AuthCallback: Dispatching supabaseAuthSuccess with user data:', userData);
            
            // Dispatch auth success
            dispatch(supabaseAuthSuccess({ user: userData, token: session.access_token }));
            
            // Redirect to home page or dashboard
            navigate('/', { replace: true });
          } catch (error) {
            console.error('Error extracting user data in AuthCallback:', error);
            // Redirect to home page anyway, but without updating the store
            navigate('/', { replace: true });
          }
        } else {
          // No session found
          console.log('AuthCallback: No session found');
          setError('Authentication failed. No session found.');
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setError('Authentication failed. Please try again.');
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [dispatch, navigate, isAuthenticated, user]);

  // If user is already authenticated, show loading briefly then redirect
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flat-gold mx-auto"></div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Redirecting...
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              You are successfully authenticated. Redirecting to home page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flat-gold mx-auto"></div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Completing Authentication
            </h2>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Authentication Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {error}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
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
