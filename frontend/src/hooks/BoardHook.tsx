// This hook is used to fetch the board members from the backend
import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setBoard} from '../store/slices/boardSlice';
import type { Member } from '../types/Member';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useBoardMembers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const fetchBoardMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/members/board/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match the frontend Member interface
      const transformedMembers: Member[] = data.map((member: any) => ({
        id: member.id,
        name: member.name,
        image: member.image,
        linkedIn: member.linkedIn,
        title: member.title,
        board: member.board
      }));
      
      dispatch(setBoard(transformedMembers));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching board members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardMembers();
  }, []);

  return {
    loading,
    error,
    refetch: fetchBoardMembers
  };
};
