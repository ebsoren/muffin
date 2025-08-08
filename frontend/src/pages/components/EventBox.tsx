import type { ClubEvent } from "../../store/slices/types/Event";

interface EventBoxProps {
  event: ClubEvent;
  size: string;
}

export function EventBox({ event, size }: EventBoxProps) {
  return (
    <div className={`${size == "large" ? "h-120" : (size == "medium" ? "h-100" : "h-80")} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.img})` }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300"></div>
      </div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6 text-white">
        {/* Title */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 leading-tight text-flat-gold">
            {event.title}
          </h3>
        </div>
        
        {/* Description */}
        {event.description && (
        <div className="flex-1 mb-4">
          <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
            {event.description}
          </p>
        </div>
        )}
        
        {/* Date and Location */}
        <div className="space-y-2">
        {event.date && (
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 text-flat-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{event.date}</span>
          </div>
        )}
        {event.location && (
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 text-flat-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{event.location}</span>
          </div>
        )}
        </div>
      </div>
    </div>
  );
} 