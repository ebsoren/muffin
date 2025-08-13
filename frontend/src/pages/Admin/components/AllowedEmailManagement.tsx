import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';

interface AllowedEmail {
  id: number;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export default function AllowedEmailManagement() {
  const [allowedEmails, setAllowedEmails] = useState<AllowedEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { token } = useAppSelector(state => state.auth);

  const fetchAllowedEmails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/allowed-emails/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllowedEmails(data);
      } else {
        setError('Failed to fetch allowed emails');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const addAllowedEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setIsAdding(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/allowed-emails/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setAllowedEmails([...allowedEmails, data]);
        setNewEmail('');
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add email');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleEmailStatus = async (emailId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/allowed-emails/${emailId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        setAllowedEmails(allowedEmails.map(email => 
          email.id === emailId ? { ...email, is_active: !currentStatus } : email
        ));
      } else {
        setError('Failed to update email status');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const deleteAllowedEmail = async (emailId: number) => {
    if (!window.confirm('Are you sure you want to delete this email?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/allowed-emails/${emailId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        setAllowedEmails(allowedEmails.filter(email => email.id !== emailId));
      } else {
        setError('Failed to delete email');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  useEffect(() => {
    fetchAllowedEmails();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-flat-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">Allowed Emails</div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add new email form */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <div className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Email</div>
        <form onSubmit={addAllowedEmail} className="flex gap-4">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter email address"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isAdding || !newEmail.trim()}
            className="px-4 py-2 bg-flat-gold text-white rounded-md hover:bg-flat-gold-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Adding...' : 'Add Email'}
          </button>
        </form>
      </div>

      {/* Emails list */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-lg font-medium text-gray-900 dark:text-white">Current Allowed Emails</div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {allowedEmails.length === 0 ? (
            <div className="px-6 py-4 text-gray-500 dark:text-gray-400">
              No allowed emails found.
            </div>
          ) : (
            allowedEmails.map((email) => (
              <div key={email.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{email.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEmailStatus(email.id, email.is_active)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      email.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {email.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => deleteAllowedEmail(email.id)}
                    className="px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 