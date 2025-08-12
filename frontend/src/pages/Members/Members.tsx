import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { ProfileEditor } from '../../components/ProfileEditor/ProfileEditor';
import { type Member } from '../../store/slices/types/Member';

export function Members() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Fetch current member data when component loads
  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user?.email) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_BASE_URL}/get-member-by-email/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch member data');
        }

        const data = await response.json();
        if (data.success) {
          setMemberData(data.member);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch member data');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.email) {
      fetchMemberData();
    }
  }, [isAuthenticated, user?.email]);

  const handleProfileUpdate = (updatedMember: Member) => {
    setMemberData(updatedMember);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You must be logged in to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Members
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your profile and view member information
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="text-gray-600 dark:text-gray-400">Loading profile data...</div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Editor */}
          <div>
            <ProfileEditor 
              onProfileUpdate={handleProfileUpdate} 
              currentMemberData={memberData}
            />
          </div>

          {/* Current Profile Display */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Current Profile
            </h2>
            
            {memberData ? (
              <div className="space-y-4">
                {memberData.image && (
                  <div className="flex justify-center">
                    <img
                      src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pics/${memberData.image}`}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full border-4 border-flat-gold"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Name
                    </label>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {memberData.name || 'Not set'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Title
                    </label>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {memberData.title || 'Not set'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      LinkedIn
                    </label>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {memberData.linkedIn ?? 'Not set'
                  }
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Board Member
                    </label>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {memberData.board ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>No profile data yet. Use the form to create your profile.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
