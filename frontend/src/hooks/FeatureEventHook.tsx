// This hook is used to fetch the featured events from the backend
import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setFeatures } from '../store/slices/featureSlice';
import type { ClubEvent } from '../types/Event';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useFeaturedEvents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const fetchFeaturedEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/events/featured/`);
      
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
