import Header from "./components/Header";
import Features from "./components/Features";
import GroupMe from "./components/GroupMe";
import { useFeaturedEvents } from "../../hooks/FeatureEventHook";
import DelayedLoadingSpinner from "../../components/DelayedLoadingSpinner";

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
      <DelayedLoadingSpinner isLoading={loading} size="lg" className="h-32" />
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