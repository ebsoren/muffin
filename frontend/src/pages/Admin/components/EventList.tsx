import type { ClubEvent } from "../../../store/slices/types/Event";
import { getEventImageUrl } from "../../../utils/supabase";


interface EventListProps {
  events: ClubEvent[];
  onEdit: (event: ClubEvent) => void;
  onDelete: (eventId: number) => void;
}

export default function EventList({ events, onEdit, onDelete }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No events found. Add your first event to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-custom-black dark:text-white mb-4">
        Current Events ({events.length})
      </h3>
      
      <div className="grid gap-4">
        {events.map((event) => {
          const imageUrl = getEventImageUrl(event.image);
          
          return (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {imageUrl && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={event.title || 'Event'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-custom-black dark:text-white">
                        {event.title || 'Untitled Event'}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        {event.date && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {event.date}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {event.location}
                          </span>
                        )}
                        <span className="bg-flat-gold text-white px-2 py-1 rounded text-xs">
                          {event.event_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(event)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(event.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 