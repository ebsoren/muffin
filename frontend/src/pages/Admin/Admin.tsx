import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import EventManagement from './components/EventManagement';
import MemberManagement from './components/MemberManagement';
import AllowedEmailManagement from './components/AllowedEmailManagement';

export function Admin() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (!user?.is_admin) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user?.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You must be an authenticated admin to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 lg:w-1/2 sm:w-4/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage events, members, and system settings
          </p>
        </div>

        <div className="mt-8">
        <EventManagement />
        </div>
        <div className="mt-8">
        <MemberManagement />
        </div>

        <div className="mt-8">
          <AllowedEmailManagement />
        </div>
      </div>
    </div>
  );
}
