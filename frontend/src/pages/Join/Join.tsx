import Header from "./components/Header";
import Timeline from "./components/Timeline";
import { useRecruitingEvents } from "../../hooks/RecruitingEventHook";
import DelayedLoadingSpinner from "../../components/DelayedLoadingSpinner";

export function Join() {
  const { loading, error } = useRecruitingEvents();
  
  if(error) {
    return (
      <div>
        <p>Error retrieving events</p>
      </div>
    )
  }
  if(loading) {
    return (
      <DelayedLoadingSpinner isLoading={loading} size="lg" className="h-32" />
    )
  }

  return (
    <div className="w-full bg-white dark:bg-custom-black duration-200 px-4 sm:px-6 md:px-8 pt-8 sm:pt-10">
      <div className="mx-auto">
        <Header/>
        <Timeline/>
      </div>
    </div>
  );
} 