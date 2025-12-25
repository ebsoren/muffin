import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { supabase } from './utils/supabaseClient'
import { store } from './store/store'
import { supabaseAuthSuccess, supabaseLogout } from './store/slices/authSlice'

// Set up global Supabase auth listener
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session && session.user) {
    const userData = {
      id: session.user.id,
      table_id: '',
      email: session.user.email || '',
      first_name: session.user.user_metadata?.first_name || '',
      last_name: session.user.user_metadata?.last_name || '',
      email_verified: !!session.user.email_confirmed_at,
      is_admin: false,
      isMember: false,
    };
    store.dispatch(supabaseAuthSuccess({ user: userData, token: session.access_token }));
  } else if (event === 'SIGNED_OUT') {
    store.dispatch(supabaseLogout());
  }
});

createRoot(document.getElementById('root')!).render(
  <App />
)
