import { useState, useEffect } from 'react';
import type { Member } from '../../../api/types';
import MemberImageUpload from '../../../components/MemberImageUpload/MemberImageUpload';

interface MemberFormProps {
  member: Member | null;
  onSubmit: (memberData: Member) => void;
  onCancel: () => void;
}

export default function MemberForm({ member, onSubmit, onCancel }: MemberFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    title: '',
    linkedIn: '',
    image: '',
    board: false,
  });

  useEffect(() => {
    if (member) {
      setFormData({
        id: member.id,
        name: member.name || '',
        title: member.title || '',
        linkedIn: member.linkedIn || '',
        image: member.image || '',
        board: member.board || false,
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const memberData = {
      ...formData,
      image: formData.image || null,
      linkedIn: formData.linkedIn || null,
      title: formData.title || null,
    };

    if (member) {
      onSubmit(memberData as Member);
    } else {
      onSubmit(memberData as Member);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUploaded = (filename: string) => {
    setFormData(prev => ({
      ...prev,
      image: filename
    }));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
      <div className="text-xl font-semibold text-custom-black dark:text-white mb-4">
        {member ? 'Edit Member' : 'Add New Member'}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedIn"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Image Upload Component */}
        <MemberImageUpload
          onImageUploaded={handleImageUploaded}
          currentImage={formData.image}
          memberId={member?.id?.toString() || 'new-member'}
        />
        

        <div className="flex items-center">
          <input
            type="checkbox"
            id="board"
            name="board"
            checked={formData.board}
            onChange={handleChange}
            className="h-4 w-4 text-flat-gold focus:ring-flat-gold border-gray-300 rounded"
          />
          <label htmlFor="board" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Board Member
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-flat-gold text-white rounded-md hover:bg-yellow-600 transition-colors"
          >
            {member ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
} 