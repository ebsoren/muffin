import { useAppSelector } from '../../../store/hooks';
import { MemberBox } from './MemberBox';

export default function Members() {
  const members = useAppSelector(state => state.members);
  return (
    <div className="w-full bg-white dark:bg-custom-black duration-200 mb-6 sm:mb-8 py-6 sm:py-8 px-4">
      <div className="text-xl sm:text-2xl font-bold text-flat-gold dark:text-white m-4 sm:m-8 text-center">
        Members
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {members?.map((member, index) => (
          <MemberBox key={index} member={member} />
        ))}
      </div>

    </div>
  );
} 