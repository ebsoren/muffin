// This hook is used to fetch the recruiting events from the backend
import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setRecruitingEvents } from '../store/slices/recruitingSlice';
import type { Event } from '../api/types';
import { getRecruitingEvents } from '../api';

export const useRecruitingEvents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const fetchRecruitingEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getRecruitingEvents();
      
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
      
      dispatch(setRecruitingEvents(transformedEvents));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching recruiting events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruitingEvents();
  }, []);

  return {
    loading,
    error,
    refetch: fetchRecruitingEvents
  };
};
