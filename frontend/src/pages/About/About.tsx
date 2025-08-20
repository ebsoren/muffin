import Board from './components/Board'

import { useBoardMembers } from '../../hooks/BoardHook';
import { useMembers } from '../../hooks/MemberHook';
import DelayedLoadingSpinner from '../../components/DelayedLoadingSpinner';

export function About() {
  const { loading: boardLoading, error: boardError } = useBoardMembers();
  const { loading: membersLoading, error: membersError } = useMembers();
  if (boardError || membersError) {
    return (
      <div>
        <p>Error retrieving board members or members</p>
      </div>
    )
  }
  if (boardLoading || membersLoading) {
    return (
      <DelayedLoadingSpinner isLoading={boardLoading || membersLoading} size="lg" className="h-32" />
    )
  }

  return (
    <div className="min-h-screen w-full lg:mx-12 bg-white dark:bg-custom-black duration-200">
      <div className="text-3xl sm:text-4xl lg:text-5xl text-center text-flat-gold m-8">
        Our mission is to approach the sports industry with innovative data analytics and strategic insights that enhance performance, on and off the field.
      </div>

      <Board />
      {/* <Members/> */}
    </div>
  );
} 