import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './store/store'
import { supabaseAuthSuccess, supabaseLogout, type User } from './store/slices/authSlice'
import { supabase } from './utils/supabaseClient'
import { checkStatus } from './api'



// Helper function to extract user data from Supabase session
export const extractUserDataFromSession = async (session: any): Promise<User | null> => {
  try {
    // Extract name from user metadata - handle different possible structures
    const userMetadata = session.user.user_metadata || {};
    
    let firstName = '';
    let lastName = '';

    // Try to get name from Google OAuth data
    if (userMetadata.first_name) {
      firstName = userMetadata.first_name;
      lastName = userMetadata.last_name || '';
    } else if (userMetadata.full_name) {
      const nameParts = userMetadata.full_name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    } else if (userMetadata.name) {
      const nameParts = userMetadata.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    } else if (userMetadata.given_name) {
      // Google OAuth specific field
      firstName = userMetadata.given_name || '';
      lastName = userMetadata.family_name || '';
    } else {
      // Fallback to email username
      const email = session.user.email || '';
      firstName = email.split('@')[0] || 'User';
      lastName = '';
    }

    // Query Supabase for admin status and member status (with timeout protection)
    const email = session.user.email || '';
    
    let isAdmin = false;
    let isMember = false;
    
    // Add timeout protection to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('API call timeout')), 5000)
    );
    
    try {
      const authResponse = await Promise.race([
        checkStatus(email),
        timeoutPromise
      ]) as any;
      isAdmin = authResponse.is_admin; 
      isMember = authResponse.is_member;
    
    const userData = {
      id: session.user.id,
      table_id: authResponse.id,
      email: email,
      first_name: firstName,
      last_name: lastName,
      profile_picture: userMetadata.avatar_url || userMetadata.picture || '',
      email_verified: session.user.email_confirmed_at ? true : false,
      is_admin: isAdmin,
      isMember: isMember,
    };

    return userData;
  } catch (error) {
      console.warn('status check failed or timed out, defaulting to false:', error);
      isAdmin = false;
      isMember = false;
    
      return null
    }
  } catch (error) {
    console.error('Error extracting user data from session:', error);
    return null
  }
};

// Function to restore session on app startup
const restoreSession = async () => {
  try {
    // Check if user has explicitly logged out
    const userLoggedOut = localStorage.getItem('user_logged_out');
    if (userLoggedOut === 'true') {
      // User has logged out, don't restore session
      localStorage.removeItem('user_logged_out');
      return;
    }

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return;
    }

    if (session) {
      try {
        // Add timeout protection to prevent hanging
        const userData = await Promise.race([
          extractUserDataFromSession(session),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Session restoration timeout')), 8000))
        ]) as any;
        store.dispatch(supabaseAuthSuccess({ user: userData, token: session.access_token }));
      } catch (userDataError) {
        console.warn('Session restoration failed, continuing without user data:', userDataError);
        // Continue without user data rather than hanging
      }
    }
  } catch (error) {
    console.warn('Session restoration error:', error);
    // Continue without session rather than hanging
  }
};

// Set up global Supabase auth listener
const setupAuthListener = () => {

  supabase.auth.onAuthStateChange(async (event, session) => {
    try {

      if (event === 'SIGNED_IN' && session) {

        const userData = await extractUserDataFromSession(session);
        const token = session.access_token;

        if (userData) {
          store.dispatch(supabaseAuthSuccess({ user: userData, token }));
        }

        // Store the session in localStorage for persistence
        localStorage.setItem('supabase_session', JSON.stringify(session));
      } else if (event === 'SIGNED_OUT') {
        store.dispatch(supabaseLogout());
        localStorage.removeItem('supabase_session');
      }
    } catch (error) {
      // Do nothing
    }
  });
};

// Initialize auth after app renders with timeout protection
setTimeout(() => {
  // Add timeout protection to prevent indefinite hanging
  const initTimeout = setTimeout(() => {
    console.warn('Auth initialization timed out, continuing without session restoration');
  }, 10000);
  
  Promise.race([
    Promise.all([
      restoreSession(),
      setupAuthListener()
    ]),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Auth init timeout')), 10000))
  ]).finally(() => {
    clearTimeout(initTimeout);
  });
}, 100);

createRoot(document.getElementById('root')!).render(
  <App />
)
