import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { type Member } from '../../api/types';
import DelayedLoadingSpinner from '../DelayedLoadingSpinner';
import { supabase } from '../../utils/supabaseClient';
import { resizeImageToFitSize } from '../../api/supabaseApi';

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
      // Validate file type - only allow PNG, JPEG, and JPG
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (PNG, JPEG, or JPG only)');
        return;
      }
      
      // Validate file size (200KB limit) and resize if needed
      if (file.size > 200 * 1024) {
        resizeImageToFitSize(file, 200 * 1024).then(resizedFile => {
          setSelectedImage(resizedFile);
          const url = URL.createObjectURL(resizedFile);
          setPreviewUrl(url);
          setError(null);
        }).catch(error => {
          setError(`Failed to resize image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        });
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
    
    if (!user?.table_id) {
      setError('User table ID not found. Please try logging in again.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const BUCKET = 'profile-pics'
      const folder = user?.id
      // Handle image upload first if there's a selected image
      let imageUrl = null;
      if (selectedImage) {
        await supabase.functions.invoke('create-profile-folder', { method: 'POST' });

        // 1) Delete everything currently in the user's folder
        async function deleteAllInFolder(prefix: string) {
          const pageSize = 100;
          let offset = 0;
        
          while (true) {
            const { data: entries, error: listErr } = await supabase
              .storage
              .from(BUCKET)
              .list(prefix, { limit: pageSize, offset });
        
            if (listErr) throw listErr;
            if (!entries || entries.length === 0) break;
        
            // Build full paths to delete (root-level within this folder)
            const paths = entries.map(e => `${prefix}/${e.name}`);
        
            const { error: rmErr } = await supabase.storage.from(BUCKET).remove(paths);
            if (rmErr) throw rmErr;
        
            if (entries.length < pageSize) break;
            offset += pageSize;
          }
        }
        
        // delete everything (including any `.keep` file)
        await deleteAllInFolder(folder);
        
        // 2) Upload the new image
        const objectName = `${Date.now()}_${selectedImage.name}`;
        const objectPath = `${folder}/${objectName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(objectPath, selectedImage, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
        
        imageUrl = uploadData.path; // Store the path, not the full URL
      }
      
      // Update the member record in the database
      const { data: updateData, error: updateError } = await supabase
        .from('members')
        .update({
          name: formData.name.trim(),
          linkedin: formData.linkedIn.trim() || null,
          title: formData.title.trim() || null,
          image: imageUrl || currentMemberData?.image || null
        })
        .eq('id', user?.table_id)
        .select()
        .limit(1);

      if (updateError) {
        throw new Error(`Profile update failed: ${updateError.message}`);
      }

      setSuccess('Profile updated successfully!');
      
      // Call the callback with updated member data
      if (onProfileUpdate && updateData) {
        const updatedMember: Member = {
          id: updateData[0].id,
          name: updateData[0].name,
          linkedIn: updateData[0].linkedin,
          title: updateData[0].title,
          board: updateData[0].board,
          image: updateData[0].image
        };
        onProfileUpdate(updatedMember);
      }
      
      // Clear form
      setSelectedImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err) {
      setError(err instanceof Error ? `${err.message} HELLO` : 'Profile update failed');
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
    <div className="bg-white dark:bg-custom-black shadow rounded-lg p-6">
      <div className="text-2xl font-bold text-custom-black dark:text-white mb-6">
        Edit Profile
      </div>
      
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
          <label htmlFor="name" className="block text-sm font-medium text-custom-black dark:text-white mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-700 text-custom-gray dark:text-white"
            placeholder="Enter your full name"
          />
        </div>

        {/* LinkedIn Field */}
        <div>
          <label htmlFor="linkedIn" className="block text-sm font-medium text-custom-black dark:text-white mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            id="linkedIn"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-700 text-custom-gray dark:text-white"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-custom-black dark:text-white mb-2">
            Title/Position (Optional)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-700 text-custom-gray dark:text-white"
            placeholder="e.g., President, Manager, Data Analyst, etc."
          />
        </div>

        {/* Profile Picture Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-custom-black dark:text-white mb-2">
            Profile Picture
          </label>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageSelect}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-flat-gold file:text-white hover:file:bg-flat-gold-hover"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload a profile picture (PNG, JPEG, JPG only). Max size: 200KB.
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
            {isLoading ? (
              <div className="flex items-center justify-center">
                <DelayedLoadingSpinner size="sm" isLoading={isLoading} />
                <span className="ml-2">Updating...</span>
              </div>
            ) : (
              'Update Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
