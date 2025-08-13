import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import EventForm from './EventForm';
import EventList from './EventList';
import type { ClubEvent } from '../../../types/Event';

export default function EventManagement() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ClubEvent | null>(null);
  const { djangoToken } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    fetchEvents();
  }, [djangoToken]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events/`, {
        headers: {
          'Authorization': `Token ${djangoToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        setError('Failed to fetch events');
      }
    } catch (error) {
      setError('Error fetching events');
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (eventData: Omit<ClubEvent, 'id'> | ClubEvent) => {
    try {
      console.log('Submitting event data:', eventData);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${djangoToken}`,
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const newEvent = await response.json();
        setEvents([...events, newEvent]);
        setShowForm(false);
        setEditingEvent(null);
      } else {
        const errorData = await response.json();
        console.error('Event creation failed:', errorData);
        setError(`Failed to add event: ${errorData.error || errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding event:', error);
      setError('Error adding event');
    }
  };

  const editEvent = async (eventId: number, eventData: Omit<ClubEvent, 'id'> | ClubEvent) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${djangoToken}`,
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents(events.map(event => event.id === eventId ? updatedEvent : event));
        setShowForm(false);
        setEditingEvent(null);
      } else {
        const errorData = await response.json();
        setError(`Failed to update event: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setError('Error updating event');
    }
  };

  const deleteEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${djangoToken}`,
        },
      });

      if (response.ok) {
        setEvents(events.filter(event => event.id !== eventId));
      } else {
        const errorData = await response.json();
        setError(`Failed to delete event: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setError('Error deleting event');
    }
  };

  const handleEdit = (event: ClubEvent) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">Event Management</div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-flat-gold hover:bg-flat-gold-hover text-white px-4 py-2 rounded-md"
        >
          Add Event
        </button>
      </div>

      {showForm ? (
        <EventForm
          event={editingEvent}
          onSubmit={editingEvent ? (data) => editEvent(editingEvent.id, data) : addEvent}
          onCancel={handleCancel}
        />
      ) : (
        <EventList
          events={events}
          onEdit={handleEdit}
          onDelete={deleteEvent}
        />
      )}
    </div>
  );
} 
