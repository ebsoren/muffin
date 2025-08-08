import { useAppSelector } from '../../../store/hooks';
import type { Member } from '../../../store/slices/types/Member';
import { MemberBox } from './MemberBox';

export default function Members() {
  //const members = useAppSelector(state => state.members);
  const M: Member = {name: "Adam Burns", img: "", linkedIn: "https://www.linkedin.com/in/adamburns27/", title: "President"}
  const members: Member[] = [M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M]

  return (
    <div className="w-full bg-white dark:bg-custom-black duration-200 mb-8 py-8">
        <h1 className="text-2xl font-bold text-flat-gold dark:text-white m-8 text-center">
          Members
        </h1>
        
        {members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-flat-gold text-lg">Board information coming soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-6 lg:gap-6 md:gap-3 sm:gap-2">
            {members.map((member, index) => (
              <MemberBox key={index} member={member} />
            ))}
          </div>
        )}
    </div>
  );
} 