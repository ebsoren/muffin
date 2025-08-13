// This hook is used to fetch the non-board members from the backend
import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setMembers } from '../store/slices/memberSlice';
import type { Member } from '../types/Member';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useMembers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/members/non-board/`);
      console.log(response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match the frontend Member interface
      const transformedMembers: Member[] = data.map((member: any) => ({
        id: member.id ?? '',
        name: member.name ?? '',
        image: member.image ?? '',
        linkedIn: member.linkedIn ?? '',
        title: member.title ?? '',
        board: member.board ?? false
      }));
      console.log(`members: ${transformedMembers}` );
      
      dispatch(setMembers(transformedMembers));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    loading,
    error,
    refetch: fetchMembers
  };
};
