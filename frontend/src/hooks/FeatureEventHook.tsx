// This hook is used to fetch the featured events from the backend
import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setFeatures } from '../store/slices/featureSlice';
import type { Event } from '../api/types';
import { getFeaturedEvents } from '../api';

export const useFeaturedEvents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const fetchFeaturedEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getFeaturedEvents();
      
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
      
      dispatch(setFeatures(transformedEvents));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching featured events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  return {
    loading,
    error,
    refetch: fetchFeaturedEvents
  };
};
