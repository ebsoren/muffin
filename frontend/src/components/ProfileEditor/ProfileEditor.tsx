import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { type Member } from '../../store/slices/types/Member';

interface ProfileEditorProps {
  onProfileUpdate?: (memberData: Member) => void;
  currentMemberData?: Member | null;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onProfileUpdate, currentMemberData }) => {
  const { user } = useAppSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    linkedIn: '',
    title: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when currentMemberData changes
  useEffect(() => {
    if (currentMemberData) {
      console.log(currentMemberData)
      setFormData({
        name: currentMemberData.name || '',
        linkedIn: currentMemberData.linkedIn || '',
        title: currentMemberData.title || ''
      });
    } else {
      // Fallback to user data from auth store
      setFormData({
        name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}`.trim() : '',
        linkedIn: '',
        title: ''
      });
    }
  }, [currentMemberData, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setError(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', user?.email || '');
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('linkedIn', formData.linkedIn.trim());
      formDataToSend.append('title', formData.title.trim());
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/profile-update/`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Profile update failed');
      }

      const data = await response.json();
      setSuccess('Profile updated successfully!');
      
      if (onProfileUpdate && data.member) {
        onProfileUpdate(data.member);
      }
      
      // Clear form
      setSelectedImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Profile
      </h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-700 dark:text-white"
            placeholder="Enter your full name"
          />
        </div>

        {/* LinkedIn Field */}
        <div>
          <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            id="linkedIn"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-700 dark:text-white"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title/Position (Optional)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-700 dark:text-white"
            placeholder="e.g., Software Engineer, Student, etc."
          />
        </div>

        {/* Profile Picture Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Profile Picture
          </label>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-flat-gold file:text-white hover:file:bg-flat-gold-hover"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload a profile picture (JPG, PNG, GIF). Max size: 5MB.
            </p>
            
            {previewUrl && (
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-flat-gold text-white font-medium rounded-md hover:bg-flat-gold-hover focus:outline-none focus:ring-2 focus:ring-flat-gold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
