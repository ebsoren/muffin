import { useAppSelector } from "../../../store/hooks";
import { EventBox } from "../../../components/EventBox/EventBox";
import { useEffect, useState, useRef } from "react";

export default function Features() {
  const features = useAppSelector((state)=>state.features)
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

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

    // Observe the features container
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={featuresRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100' 
          : 'opacity-0'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-2 sm:m-4">
        {features.map((event, index) => (
          <EventBox key={index} event={event} size={"large"} />
        ))}
      </div>
    </div>
  );
} 