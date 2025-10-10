import { useAppSelector } from '../../../store/hooks';
import { BoardMember } from './BoardMember';

export default function Board() {
  const boardMembers = useAppSelector(state => state.board);
  return (
    <div className="w-full bg-white duration-200 px-4 sm:px-6 md:px-8">
        <div className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-gray-800 mb-12 sm:mb-16 text-center">
          Executive Board
        </div>
        
        {boardMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-flat-gold text-base sm:text-lg">Board information coming soon.</p>
          </div>
        ) : (
          <div className="bg-gray-100 py-8 sm:py-10 md:py-12 px-6 sm:px-8 md:px-10 rounded-2xl sm:rounded-3xl">
            <div className="flex flex-wrap justify-center gap-8 sm:gap-10 md:gap-12">
            {boardMembers.map((member, index) => (
              <div key={index} className="w-40 sm:w-48 md:w-52 flex-shrink-0">
                <BoardMember member={member} />
              </div>
            ))}
            </div>
          </div>
        )}
    </div>
  );
} 