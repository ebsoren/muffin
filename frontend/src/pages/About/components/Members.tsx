import { useAppSelector } from '../../../store/hooks';
import { MemberBox } from './MemberBox';

export default function Members() {
  const members = useAppSelector(state => state.members);
  return (
    <div className="w-full bg-white dark:bg-custom-black duration-200 mb-6 sm:mb-8 py-6 sm:py-8 px-4">
      <div className="text-xl sm:text-2xl font-bold text-flat-gold dark:text-white m-4 sm:m-8 text-center">
        Members
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
        {members?.map((member, index) => (
          <div key={index} className="w-32 sm:w-36 md:w-40 flex-shrink-0">
            <MemberBox member={member} />
          </div>
        ))}
      </div>

    </div>
  );
} 