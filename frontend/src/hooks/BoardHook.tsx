// This hook is used to fetch the board members from the backend
import { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setBoard} from '../store/slices/boardSlice';
import type { Member } from '../api/types';
import { getBoardMembers } from '../api';

export const useBoardMembers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const fetchBoardMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getBoardMembers();
      
      // Transform the data to match the frontend Member interface
      const transformedMembers: Member[] = data.map((member) => ({
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
