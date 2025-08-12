import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './store/store'
import { supabaseAuthSuccess, supabaseLogout } from './store/slices/authSlice'
import { supabase } from './utils/supabaseClient'

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Function to query backend for admin status
const fetchAdminStatusFromBackend = async (email: string): Promise<boolean> => {
  try {
    console.log('Querying backend for admin status:', email);
    
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
    let firstName = '';
    let lastName = '';
    
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
      // Fallback: use email prefix as first name
      const email = session.user.email || '';
      firstName = email.split('@')[0] || '';
      lastName = '';
    }
    
    // Query Supabase for admin status
    const email = session.user.email || '';
    const isAdmin = await fetchAdminStatusFromBackend(email);
    
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
    const isAdmin = await fetchAdminStatusFromBackend(email);
    
    return {
      id: session.user.id || '',
      email: email,
      first_name: 'User',
      last_name: '',
      profile_picture: '',
      email_verified: false,
      date_joined: new Date().toISOString(),
      is_admin: isAdmin,
    };
  }
};

// Function to restore session on app startup
const restoreSession = async () => {
  console.log('Restoring Supabase session on app startup...');
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error restoring session:', error);
      return;
    }
    
    if (session) {
      
      try {
        const userData = await extractUserDataFromSession(session);
        
        store.dispatch(supabaseAuthSuccess({ user: userData, token: session.access_token }));
        console.log('Session restored successfully');
      } catch (userDataError) {
        console.error('Error extracting user data during session restoration:', userDataError);
        // Continue without restoring the session
      }
    } else {
      console.log('No existing session found');
    }
  } catch (error) {
    console.error('Error in session restoration:', error);
  }
};

// Set up global Supabase auth listener
const setupAuthListener = () => {
  console.log('Setting up Supabase auth listener...');
  
  supabase.auth.onAuthStateChange(async (event, session) => {
    try {
      
      if (event === 'SIGNED_IN' && session) {
        // User signed in - update Redux store
        
        const userData = await extractUserDataFromSession(session);
        
        // For Supabase, we'll use the access token as our token
        const token = session.access_token;
        
        store.dispatch(supabaseAuthSuccess({ user: userData, token }));
        
        
        // Store the session in localStorage for persistence
        localStorage.setItem('supabase_session', JSON.stringify(session));
      } else if (event === 'SIGNED_OUT') {
        // User signed out - clear Redux store
        store.dispatch(supabaseLogout());
        localStorage.removeItem('supabase_session');
      }
    } catch (error) {
      console.error('Error in auth state change handler:', error);
    }
  });
};

// Initialize auth after app renders
setTimeout(() => {
  restoreSession();
  setupAuthListener();
}, 100);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
