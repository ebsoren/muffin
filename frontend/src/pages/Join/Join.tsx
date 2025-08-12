import Header from "./components/Header";
import Timeline from "./components/Timeline";
import { useRecruitingEvents } from "../../../hooks/RecruitingEventHook";

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
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-white dark:bg-custom-black duration-200 mb-6">
      <div className="mx-auto">
        <Header/>
        <Timeline/>
      </div>
    </div>
  );
} 