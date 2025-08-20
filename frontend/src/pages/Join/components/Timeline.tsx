import { useAppSelector } from "../../../store/hooks";
import { EventBox } from "../../../components/EventBox/EventBox";
import { useEffect, useState, useRef } from "react";

export default function Timeline() {
  const events = useAppSelector((state) => state.recruiting);
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

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

    // Observe the timeline container
    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);

  // Staggered animation: show timeline elements after events fade in
  useEffect(() => {
    if (isVisible) {
      // Wait for events to fade in, then show timeline elements
      setShowTimeline(true);

    } else {
      setShowTimeline(false);
    }
  }, [isVisible]);

  return (
    <div ref={timelineRef} className="relative">
      <div className="text-center mb-12 sm:mb-16">
        <div className="text-2xl sm:text-3xl font-bold text-flat-gold mb-6 sm:mb-8">
          Recruiting Timeline
        </div>
      </div>

      {/* Events Timeline */}
      <div className="">
        {events?.map((event, index) => (
          <div key={index} className="relative p-2 ">
            {/* Timeline Node */}
            {events.length > 1 &&
              <div className={`transition-all duration-300 ease-out z-0 lg:z-20 hidden sm:hidden md:hidden lg:block ${showTimeline
                ? 'opacity-100'
                : 'opacity-0'
                }`}>
                <div className={`absolute left-1/2 bottom-0 transform -translate-x-1/2 h-full ${index == 0 ? 'h-1/2!' : ''} ${index == events.length - 1 ? 'h-1/2! -translate-y-42' : ''} w-4 bg-flat-gold border-4 border-flat-gold dark:bg-flat-gold shadow-lg ${showTimeline ? 'opacity-100' : 'opacity-0'
                  }`} />
                <div className={`absolute left-1/2 bottom-2/5 transform -translate-x-1/2 w-10 h-10 border-4 border-flat-gold bg-flat-gold rounded-full hidden lg:block shadow-lg ${showTimeline ? 'opacity-100' : 'opacity-0'
                  }`} />
              </div>
            }

            {/* Event Content */}
            <div className={`flex items-center z-0 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              {/* Spacer */}
              <div className="w-1/2 z-0"></div>

              {/* Event Box */}
              <div className={`w-full z-20 ${index % 2 === 0 ? 'lg:pl-120 sm:pl-0' : 'lg:pr-120 sm:pl-0'}`}>
                <EventBox event={event} size={"small"} />
              </div>

              {/* Spacer */}
              <div className="w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      {events.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-flat-gold text-base sm:text-lg">No events scheduled yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
} 