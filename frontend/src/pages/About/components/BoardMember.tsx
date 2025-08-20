import type { Member } from "../../../api/types";
import { getProfileImageUrl } from "../../../utils/supabase";
import { useEffect, useState, useRef } from "react";

interface BoardMemberProps {
  member: Member;
}

export function BoardMember({ member }: BoardMemberProps) {
  const imageUrl = getProfileImageUrl(member.image);
  const [isVisible, setIsVisible] = useState(false);
  const boardMemberRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '50px' // Start animation 50px before element comes into view
      }
    );

    // Observe the board member
    if (boardMemberRef.current) {
      observer.observe(boardMemberRef.current);
    }

    return () => {
      if (boardMemberRef.current) {
        observer.unobserve(boardMemberRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={boardMemberRef}
      className={`flex flex-col items-center text-center transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100' 
          : 'opacity-0'
      }`}
    >
      {/* Circular Image */}
      <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-50 md:h-50 rounded-full overflow-hidden mb-3 sm:mb-4 shadow-lg">
        <img
          src={imageUrl || '/default-avatar.svg'}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name with LinkedIn Link */}
      <div className="flex items-center justify-center mb-2 px-2">
        <div className="text-base sm:text-lg font-semibold text-custom-black dark:text-white mr-2">
          {member.name}
        </div>
        {member.linkedIn && (
        <a
          href={member.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        )}
      </div>

      {/* Title */}
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium px-2">
        {member.title}
      </p>
    </div>
  );
} 