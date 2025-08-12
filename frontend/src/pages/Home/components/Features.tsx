import { useAppSelector } from "../../../store/hooks";
import { EventBox } from "../../components/EventBox";

export default function Features() {
  const features = useAppSelector((state)=>state.features)

  return (
    <div>
      <h1 className="text-5xl font-bold text-flat-gold m-8">
        What We Do
      </h1>
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4 m-4">
        {features.map((event, index) => (
          <EventBox key={index} event={event} size={"large"} />
        ))}
      </div>
    </div>
  );
} 