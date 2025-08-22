import { useAppSelector } from '../../../store/hooks';
import { BoardMember } from './BoardMember';

export default function Board() {
  const boardMembers = useAppSelector(state => state.board);
  return (
    <div className="w-full bg-white dark:bg-custom-black duration-200 py-6 sm:py-8 px-4">
        <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-flat-gold dark:text-white mb-6 sm:mb-8 text-center">
          Executive Board
        </div>
        
        {boardMembers.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-flat-gold text-base sm:text-lg">Board information coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pt-6 sm:pt-8 gap-4 sm:gap-6 justify-items-center justify-content-center">
            {boardMembers.map((member, index) => (
              <BoardMember key={index} member={member} />
            ))}
          </div>
        )}
    </div>
  );
} 