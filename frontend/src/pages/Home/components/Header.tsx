import { useState, useEffect, useRef } from 'react';
import { JoinUs } from './JoinUs';
import { SUPABASE_MEDIA_BUCKET, SUPABASE_URL } from "../../../utils/constants"


const AnimatedText = () => {
  const words = ['business', 'mentorship', 'analytics', 'management', 'networking', 'innovation', 'consulting', 'finance', 'fantasy football'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsTransitioning(false);
      }, 500); // Wait for fade out before changing word
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-9xl font-bold text-flat-gold flex items-center justify-center">
      <span
        className={`transition-all duration-400 ease-in-out ${isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}
      >
        {words[currentIndex]}
      </span>
    </div>
  );
};

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

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

    // Observe the header
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div 
        ref={headerRef}
        className={`h-[95vh] flex flex-col justify-center items-center relative transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100' 
            : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_MEDIA_BUCKET}/frontpage.jpeg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Semi-transparent black overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content with relative positioning to appear above overlay */}
        <div className="relative z-10 text-7xl text-white justify-center">
          <span className="text-7xl">VSBC</span><span> is sports and</span>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center gap-20">
          <AnimatedText />
          <JoinUs opt="Us" />
        </div>
      </div>
      <div className="bg-gray-300 border-y-6 border-flat-gold text-custom-black text-4xl text-left lg:px-30 md:px-20 sm:px-10 py-20">
        VSBC is the place to break into the sports industry. We help motivated students connect with industry professionals and impactful speakers, provide mentorship and networking opportunities, and offer a space to explore and enjoy sports business, analytics, management, and finance.
      </div>
    </div>
  );
} 