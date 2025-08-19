import EventsList from './components/EventsList';
import { useClubEvents } from '../../hooks/EventHook';
import DelayedLoadingSpinner from '../../components/DelayedLoadingSpinner';

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
    <DelayedLoadingSpinner isLoading={loading} size="lg" className="h-32" />
  );
} 