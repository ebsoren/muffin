import EventsList from './components/EventsList';
import { useClubEvents } from '../../hooks/EventHook';

export function Events() {
  const { loading, error } = useClubEvents(); 
  if(error) {
    return (
      <div>
        <p>Error retrieving events</p>
      </div>
    )
  }
  return !loading ? (
    <EventsList/>
  ) : (
    <div>
      <p>Loading...</p>
    </div>
  );
} 