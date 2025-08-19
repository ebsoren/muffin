import { useState, useEffect } from 'react';
import type { Event } from '../../../api/types';
import EventImageUpload from '../../../components/EventImageUpload/EventImageUpload';

interface EventFormProps {
  event: Event | null;
  onSubmit: (eventData: Omit<Event, 'id'> | Event) => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    event_type: '',
    image: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        location: event.location || '',
        event_type: event.event_type || '',
        image: event.image || ''
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.event_type.trim()) {
      alert('Title and Event Type are required fields.');
      return;
    }
    
    const eventData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      date: formData.date || null,
      location: formData.location.trim() || null,
      event_type: formData.event_type.trim(),
      image: formData.image || null
    };

    if (event) {
      onSubmit({ ...eventData, id: event.id } as Event);
    } else {
      onSubmit(eventData as Omit<Event, 'id'>);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        {event ? 'Edit Event' : 'Add New Event'}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Type *
            </label>
            <select
              id="event_type"
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Event Type</option>
              <option value="club">Club Event</option>
              <option value="recruiting">Recruiting Event</option>
              <option value="featured">Featured Event</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-flat-gold focus:border-flat-gold dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Event Image Upload Component */}
        <EventImageUpload
          onImageUploaded={handleImageUploaded}
          currentImage={formData.image}
          eventId={event?.id || null}
        />

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
            {event ? 'Update Event' : 'Add Event'}
          </button>
        </div>
      </form>
    </div>
  );
} 