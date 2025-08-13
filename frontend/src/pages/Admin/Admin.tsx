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
    setTimeout(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (!user?.is_admin) {
      navigate('/');
      return;
    }
  }, 1000);
  }, [isAuthenticated, user, navigate]);

  return ( isAuthenticated && user?.is_admin &&
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 lg:w-1/2 sm:w-4/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </div>
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
