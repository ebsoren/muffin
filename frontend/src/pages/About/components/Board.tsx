import { useAppSelector } from '../../../store/hooks';
import type { Member } from '../../../store/slices/types/Member';
import { BoardMember } from './BoardMember';

export default function Board() {
  // const boardMembers = useAppSelector(state => state.board);
  const M: Member = {name: "Adam Burns", img: "", linkedIn: "https://www.linkedin.com/in/adamburns27/", title: "President"}
  const boardMembers: Member[] = [M,M,M,M,M]
  return (
    <div className="w-full bg-white dark:bg-custom-black duration-200 py-8">
        <h1 className="text-2xl font-bold text-flat-gold dark:text-white mb-8 text-center">
          Executive Board
        </h1>
        
        {boardMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-flat-gold text-lg">Board information coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pt-8">
            {boardMembers.map((member, index) => (
              <BoardMember key={index} member={member} />
            ))}
          </div>
        )}
    </div>
  );
} 