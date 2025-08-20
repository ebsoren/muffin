import type { Event } from "../../api/types";
import { getEventImageUrl } from "../../utils/supabase";
import { useEffect, useState, useRef } from "react";

interface EventBoxProps {
  event: Event;
  size: string;
}

export function EventBox({ event, size }: EventBoxProps) {
  const imageUrl = getEventImageUrl(event.image);
  const [isVisible, setIsVisible] = useState(false);
  const eventBoxRef = useRef<HTMLDivElement>(null);

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

    // Observe the event box
    if (eventBoxRef.current) {
      observer.observe(eventBoxRef.current);
    }

    return () => {
      if (eventBoxRef.current) {
        observer.unobserve(eventBoxRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={eventBoxRef}
      className={`${size == "large" ? "h-120" : (size == "medium" ? "h-100" : "h-80")} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-1000 ease-out relative group ${
        isVisible 
          ? 'opacity-100' 
          : 'opacity-0'
      }`}
    >
      {/* Background Image */}
      {imageUrl && (
        <div
          className="absolute inset-0 w-full h-full transition-all duration-1000 ease-out"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/100 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col pl-4 pb-4 text-white">
        {/* Spacer to push all text to bottom */}
        <div className="flex-1"></div>

        {/* Title */}
        <div className="text-3xl font-bold leading-tight text-white">
          {event.title}
        </div>

        {/* All text content - moved to bottom */}
        <div className="">

          {/* Description */}
          {event.description && (
            <div>
              <p className="text-base leading-relaxed opacity-90 line-clamp-3">
                {event.description}
              </p>
            </div>
          )}

          {/* Date and Location */}
          <div>
            {event.date && (
              <div className="flex items-center text-base">
                <svg className="w-5 h-5 mr-2 text-flat-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">{event.date}</p>
              </div>
            )}
            {event.location && (
              <div className="flex items-center text-base">
                <svg className="w-5 h-5 mr-2 text-flat-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">{event.location}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 