import Header from "./components/Header";
import Features from "./components/Features";
import GroupMe from "./components/GroupMe";
import { useFeaturedEvents } from "../../../hooks/FeatureEventHook";

export function Home() {
  const { loading, error } = useFeaturedEvents(); 
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
    <div className="w-full text-center bg-white dark:bg-custom-black duration-200">
      <Header/>
      <Features/>
      <GroupMe/>
    </div>
  );
} 