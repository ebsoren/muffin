import { useAppSelector } from "../../../store/hooks";
import { EventBox } from "../../../components/EventBox/EventBox";

export default function Features() {
  const features = useAppSelector((state)=>state.features)

  return (
    <div>
      <div className="text-5xl font-bold text-flat-gold m-8">
        What is VSBC?
      </div>
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4 m-4">
        {features.map((event, index) => (
          <EventBox key={index} event={event} size={"large"} />
        ))}
      </div>
    </div>
  );
} 