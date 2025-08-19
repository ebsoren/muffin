import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { supabaseAuthSuccess, fetchUserFailure, updateUser } from '../store/slices/authSlice';
import { supabase } from '../utils/supabaseClient';
import { extractUserDataFromSession } from '../main';
import { checkStatus } from '../api';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated, user, isLoading } = useAppSelector(state => state.auth);



  const checkAuth = async () => {
    
    // Check if we have a Supabase session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return;
    }

    if (session && !user) {
      // We have a session but no user in Redux - update the store
      
      try {
        const userData = await extractUserDataFromSession(session);
        if (userData) {
          dispatch(supabaseAuthSuccess({ user: userData, token: session.access_token }));
        }
      } catch (error) {
      }
    } else if (session && user) {
      // We have a session and user - check if member status needs updating
              try {
          const memberResponse = await checkStatus(user.email);
          if (memberResponse.is_member !== user.isMember) {
            dispatch(updateUser({ ...user, isMember: memberResponse.is_member, table_id: memberResponse.id, is_admin: memberResponse.is_admin }));
          }
        } catch (error) {
          // Ignore errors in member status check
        }
    } else if (!session && isAuthenticated) {
      // No session but we think we're authenticated - clear auth state
      dispatch(fetchUserFailure('No valid session found'));
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
