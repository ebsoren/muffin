import { useAppSelector } from '../../../store/hooks';
import { EventBox } from '../../components/EventBox';

export default function EventsList() {
  const events = useAppSelector(state => state.events);

  return (
    <div className=" sm:w-6/7 md:w-5/6 lg:w-4/5 justify-center items-center mb-8">
      <h1 className="text-7xl font-bold text-flat-gold text-center m-8">
        Upcoming Events
      </h1>
      <div className="justify-center items-center">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-flat-gold text-lg">No events available at the moment.</p>
            <p className="text-gray-500 dark:text-gray-300 mt-2">Check back soon for exciting events!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
            {events.map((event, index) => (
              <EventBox key={index} event={event} size={"medium"} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 