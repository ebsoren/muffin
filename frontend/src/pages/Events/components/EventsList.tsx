import { useAppSelector } from '../../../store/hooks';
import { EventBox } from '../../../components/EventBox/EventBox';

export default function EventsList() {
  const events = useAppSelector(state => state.events);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-8 sm:py-10">
      <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-flat-gold text-center mb-8 sm:mb-10">
        Upcoming Events
      </div>
      <div className="justify-center items-center">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-flat-gold text-base sm:text-lg">No events available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {events.map((event, index) => (
              <EventBox key={index} event={event} size={"small"} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 