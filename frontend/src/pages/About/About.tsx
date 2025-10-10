import Board from './components/Board'
import { WeWorkHere } from '../Home/components/WeWorkHere';

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
    <div className="min-h-screen w-full lg:mx-12 bg-white duration-200">
      <div className="text-xl sm:text-2xl lg:text-3xl text-center text-flat-gold py-8 sm:py-10 px-6 font-medium">
        Our mission is to approach the sports industry with innovative data analytics and strategic insights that enhance performance, on and off the field.
      </div>

      <Board />
      <WeWorkHere />
      {/* <Members/> */}
    </div>
  );
} 