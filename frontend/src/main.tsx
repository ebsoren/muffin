import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './store/store'
import { supabaseAuthSuccess, supabaseLogout } from './store/slices/authSlice'
import { supabase } from './utils/supabaseClient'

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Function to query backend for admin status
const fetchAdminStatus = async (email: string): Promise<boolean> => {
  try {

    const response = await fetch(`${API_BASE_URL}/admin-status/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      console.error('Error querying admin status:', response.status);
      return false;
    }

    const data = await response.json();

    return data.is_admin || false;
  } catch (error) {
    console.error('Error fetching admin status from backend:', error);
    return false;
  }
};

// Helper function to extract user data from Supabase session
export const extractUserDataFromSession = async (session: any) => {
  try {
    // Extract name from user metadata - handle different possible structures
    const userMetadata = session.user.user_metadata || {};
    var firstName = '';
    var lastName = '';

    if (userMetadata.first_name) {
      firstName = userMetadata.first_name;
      lastName = userMetadata.last_name || '';
      console.log('Using first_name/last_name fields:', { firstName, lastName });
    } else if (userMetadata.full_name) {
      const nameParts = userMetadata.full_name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
      console.log('Using full_name field:', { fullName: userMetadata.full_name, firstName, lastName });
    } else if (userMetadata.name) {
      const nameParts = userMetadata.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
      console.log('Using name field:', { name: userMetadata.name, firstName, lastName });
    } else {
      console.log('No name fields found in metadata, using email as fallback');
      const email = session.user.email || '';
      firstName = email.split('@')[0] || '';
      lastName = '';
    }

    // Query Supabase for admin status
    const email = session.user.email || '';
    const isAdmin = await fetchAdminStatus(email);

    const userData = {
      id: session.user.id,
      email: email,
      first_name: firstName,
      last_name: lastName,
      profile_picture: userMetadata.avatar_url || '',
      email_verified: session.user.email_confirmed_at ? true : false,
      is_admin: isAdmin,
    };

    return userData;
  } catch (error) {
    console.error('Error extracting user data from session:', error);
    // Return a minimal user object to prevent crashes
    const email = session.user.email || '';
    const isAdmin = await fetchAdminStatus(email);

    return {
      id: session.user.id || '',
      email: email,
      first_name: 'User',
      last_name: '',
      profile_picture: '',
      email_verified: false,
      is_admin: isAdmin,
    };
  }
};

// Function to restore session on app startup
const restoreSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return;
    }

    if (session) {

      try {
        const userData = await extractUserDataFromSession(session);

        store.dispatch(supabaseAuthSuccess({ user: userData, token: session.access_token }));
      } catch (userDataError) {
        // Do nothing
      }
    }
  } catch (error) {
    // Do nothing
  }
};

// Set up global Supabase auth listener
const setupAuthListener = () => {

  supabase.auth.onAuthStateChange(async (event, session) => {
    try {

      if (event === 'SIGNED_IN' && session) {

        const userData = await extractUserDataFromSession(session);
        const token = session.access_token;

        store.dispatch(supabaseAuthSuccess({ user: userData, token }));

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

// Initialize auth after app renders
setTimeout(() => {
  restoreSession();
  setupAuthListener();
}, 100);

createRoot(document.getElementById('root')!).render(
  <App />
)
