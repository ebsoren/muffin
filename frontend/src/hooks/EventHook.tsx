// This hook is used to fetch the club events from the backend
import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setEvents } from '../store/slices/eventSlice';
import type { Event } from '../api/types';
import { getClubEvents } from '../api';

export const useClubEvents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const fetchClubEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getClubEvents();
      
      // Transform the data to match the frontend Event interface
      const transformedEvents: Event[] = data.map((event) => ({
        id: event.id || 0,
        title: event.title,
        image: event.image,
        description: event.description,
        date: event.date,
        location: event.location,
        event_type: event.event_type
      }));
      dispatch(setEvents(transformedEvents));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubEvents();
  }, []);

  return {
    loading,
    error,
    refetch: fetchClubEvents
  };
};
