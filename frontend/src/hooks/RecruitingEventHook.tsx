// This hook is used to fetch the recruiting events from the backend
import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setRecruitingEvents } from '../store/slices/recruitingSlice';
import type { ClubEvent } from '../types/Event';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useRecruitingEvents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const fetchRecruitingEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/events/recruiting/`);

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
