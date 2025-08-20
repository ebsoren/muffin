import { useState, useEffect } from 'react';
import EventForm from './EventForm';
import EventList from './EventList';
import type { Event } from '../../../api/types';
import DelayedLoadingSpinner from '../../../components/DelayedLoadingSpinner';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../../api';

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      setError('Error fetching events');
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id'> | Event) => {
    try {
      const newEvent = await createEvent(eventData as any);
      setEvents([...events, newEvent]);
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      setError('Error adding event');
    }
  };

  const editEvent = async (eventId: number, eventData: Omit<Event, 'id'> | Event) => {
    try {
      const updatedEvent = await updateEvent(eventId, eventData as any);
      setEvents(events.map(event => event.id === eventId ? updatedEvent : event));
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      setError('Error updating event');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await deleteEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      setError('Error deleting event');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  if (isLoading) {
    return <DelayedLoadingSpinner isLoading={isLoading} size="lg" className="h-32" />;
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
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
} 
