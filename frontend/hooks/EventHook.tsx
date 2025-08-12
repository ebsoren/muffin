import { useState, useEffect } from 'react';
import { useAppDispatch } from '../src/store/hooks';
import { setEvents } from '../src/store/slices/eventSlice';
import type { ClubEvent } from '../src/store/slices/types/Event';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useClubEvents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const fetchClubEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/events/club/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match the frontend ClubEvent interface
      const transformedEvents: ClubEvent[] = data.map((event: any) => ({
        id: event.id,
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
      console.error('Error fetching club events:', err);
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
