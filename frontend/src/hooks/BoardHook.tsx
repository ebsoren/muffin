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
      
      // Sort by title hierarchy: Co-President, President, Director, Co-Director, others
      // Then alphabetically by full title within each priority level
      const sortedMembers = transformedMembers.sort((a, b) => {
        const getTitlePriority = (title: string | null | undefined) => {
          if (!title) return 999;
          const lowerTitle = title.toLowerCase();
          if (lowerTitle.includes('co-president')) return 1;
          if (lowerTitle.includes('president') && !lowerTitle.includes('co-')) return 2;
          if (lowerTitle.includes('director') && !lowerTitle.includes('co-')) return 3;
          if (lowerTitle.includes('co-director')) return 4;
          return 5;
        };
        
        const priorityA = getTitlePriority(a.title);
        const priorityB = getTitlePriority(b.title);
        
        // If same priority, sort alphabetically by title
        if (priorityA === priorityB) {
          const titleA = (a.title || '').toLowerCase();
          const titleB = (b.title || '').toLowerCase();
          return titleA.localeCompare(titleB);
        }
        
        return priorityA - priorityB;
      });
      
      dispatch(setBoard(sortedMembers));
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
