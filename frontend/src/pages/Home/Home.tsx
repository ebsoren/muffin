import { useAppSelector } from "../../store/hooks";
import type { ClubEvent } from "../../store/slices/types/Event";
import { EventBox } from "../components/EventBox";

export function Home() {
  // const features = useAppSelector((state)=>state.features)
  const E: ClubEvent = { title: "hello event here", img: "", description: "Hello description of what we're doing", date: "", location: "" }
  const features = [E, E, E, E]
  return (
    <div className="w-full text-center bg-white dark:bg-custom-black duration-200">
      <h1 className="text-5xl font-bold text-flat-gold m-8">
        Vanderbilt Sports Business Club
      </h1>
      <p className="text-xl text-custom-black dark:text-white leading-relaxed mx-auto">
        Our mission is to approach the sports industry using innovative data analytics and strategic insights that enhance performance, on and off the field.
      </p>
      <h1 className="text-5xl font-bold text-flat-gold m-8">
        What We Do
      </h1>
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4 m-4">
        {features.map((event, index) => (
          <EventBox key={index} event={event} size={"large"} />
        ))}
      </div>
      <h1 className="text-5xl font-bold text-flat-gold m-8">
        Join Our Groupme
      </h1>
    </div>
  );
} 