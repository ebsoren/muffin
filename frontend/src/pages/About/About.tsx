import Board from './components/Board'
import Members from './components/Members';
import { useBoardMembers } from '../../hooks/BoardHook';
import { useMembers } from '../../hooks/MemberHook';

export function About() {
  const { loading: boardLoading, error: boardError } = useBoardMembers();
  const { loading: membersLoading, error: membersError } = useMembers();
  if(boardError || membersError) {
    return (
      <div>
        <p>Error retrieving board members or members</p>
      </div>
    )
  }
  if(boardLoading || membersLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full mx-20 bg-white dark:bg-custom-black duration-200">
      <Board/>
      <Members/>
    </div>
  );
} 