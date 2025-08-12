import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { supabaseAuthSuccess, fetchUserFailure } from '../store/slices/authSlice';
import { supabase } from '../utils/supabaseClient';
import { extractUserDataFromSession } from '../main';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated, user, isLoading } = useAppSelector(state => state.auth);

  const checkAuth = async () => {
    console.log('useAuth: checkAuth called, current state:', { token, isAuthenticated, user });
    
    // Check if we have a Supabase session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    console.log('useAuth: Supabase session check result:', { session, error });
    
    if (error) {
      console.error('Error checking Supabase session:', error);
      return;
    }

    if (session && !user) {
      console.log('useAuth: Found session but no user in Redux, updating store');
      // We have a session but no user in Redux - update the store
      
      try {
        const userData = await extractUserDataFromSession(session);
        
        console.log('useAuth: Dispatching supabaseAuthSuccess with user data:', userData);
        dispatch(supabaseAuthSuccess({ user: userData, token: session.access_token }));
      } catch (error) {
        console.error('Error extracting user data in useAuth:', error);
        // Continue without updating the store
      }
    } else if (!session && isAuthenticated) {
      console.log('useAuth: No session but authenticated, clearing auth state');
      // No session but we think we're authenticated - clear auth state
      dispatch(fetchUserFailure('No valid session found'));
    } else {
      console.log('useAuth: No action needed, session and user state are consistent');
    }
  };

  useEffect(() => {
    // Check auth on component mount
    checkAuth();
  }, []);

  return {
    checkAuth,
    isLoading,
    isAuthenticated,
    user,
    token
  };
};
