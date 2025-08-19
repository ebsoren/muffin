import { useState, useEffect } from 'react';
import DelayedLoadingSpinner from '../../../components/DelayedLoadingSpinner';
import { createAllowedEmail, deleteAllowedEmail, checkAllowedEmail } from '../../../api';

export default function AllowedEmailManagement() {

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [deleteEmail, setDeleteEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);




  const addAllowedEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setIsAdding(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Check if email already exists
      const existingEmail = await checkAllowedEmail();
      if (existingEmail) {
        setError('This email is already in the allowed list');
        return;
      }
      
      await createAllowedEmail({ email: newEmail.trim() });
      setSuccess(`Email "${newEmail.trim()}" added successfully!`);
      setNewEmail('');
    } catch (error: any) {
      setError(error.message || 'Failed to add email');
    } finally {
      setIsAdding(false);
    }
  };



  const handleDeleteAllowedEmail = async (deleteEmail: string) => {
    if (!window.confirm('Are you sure you want to delete this email?')) return;

    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteAllowedEmail(deleteEmail);
      setSuccess(`Email "${deleteEmail}" removed successfully!`);
      setDeleteEmail('');
    } catch (error: any) {
      setError(error.message || 'Failed to remove email');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(false);
    };
    initialize();
  }, []);

  if (isLoading) {
    return (
      <DelayedLoadingSpinner isLoading={isLoading} size="md" className="h-32" />
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

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

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

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="text-lg font-medium text-gray-900 dark:text-white mb-4">Remove Allowed Email</div>
          <form onSubmit={(e) => { e.preventDefault(); handleDeleteAllowedEmail(deleteEmail); }} className="flex gap-4">
            <input
              type="email"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
              placeholder="Enter email address to remove"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isDeleting || !deleteEmail.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Removing...' : 'Remove Email'}
            </button>
          </form>
        </div>
    </div>
  );
} 