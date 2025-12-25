import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginStart, loginFailure, supabaseAuthSuccess } from '../../store/slices/authSlice';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      if (isSignUp) {
        // Sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: firstName,
            },
          },
        });

        if (signUpError) {
          dispatch(loginFailure(signUpError.message));
          return;
        }

        if (data.session && data.user) {
          const userData = {
            id: data.user.id,
            table_id: '',
            email: data.user.email || '',
            first_name: firstName || data.user.user_metadata?.first_name || '',
            last_name: '',
            email_verified: false,
            is_admin: false,
            isMember: false,
          };
          dispatch(supabaseAuthSuccess({ user: userData, token: data.session.access_token }));
        } else {
          // Email confirmation required
          alert('Please check your email to confirm your account.');
        }
      } else {
        // Sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          dispatch(loginFailure(signInError.message));
          return;
        }

        if (data.session && data.user) {
          const userData = {
            id: data.user.id,
            table_id: '',
            email: data.user.email || '',
            first_name: data.user.user_metadata?.first_name || '',
            last_name: data.user.user_metadata?.last_name || '',
            email_verified: !!data.user.email_confirmed_at,
            is_admin: false,
            isMember: false,
          };
          dispatch(supabaseAuthSuccess({ user: userData, token: data.session.access_token }));
        }
      }
    } catch (err: any) {
      dispatch(loginFailure(err.message || 'An error occurred'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Sign up' : 'Sign in'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            {isSignUp && (
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required={isSignUp}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isSignUp ? 'rounded-none' : 'rounded-t-md'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : isSignUp ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                if (!isSignUp) {
                  setFirstName('');
                }
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

