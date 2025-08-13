import { useAppSelector } from "../../../store/hooks";
import { EventBox } from "../../../components/EventBox/EventBox";

export default function Timeline() {
  const events = useAppSelector((state) => state.recruiting);

  return (
    <div className="relative">
      <div className="text-center mb-16">
        <div className="text-3xl font-bold text-flat-gold mb-8">
          Recruiting Timeline
        </div>
      </div>
      
      {/* Events Timeline */}
      <div className="">
        {events?.map((event, index) => (
          <div key={index} className="relative p-2">
            {/* Timeline Node */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 dark:bg-flat-gold bg-custom-black ${index == 0 ? 'h-full mt-39' : (index == events.length-1 ? 'h-5/11' : 'h-full')}  `}/>
            <div className="absolute left-1/2 bottom-1/2 transform -translate-x-1/2 w-8 h-8 bg-custom-black border-4 border-flat-gold dark:bg-flat-gold rounded-full shadow-lg "/>

            {/* Event Content */}
            <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              {/* Spacer */}
              <div className="w-1/2"></div>

              {/* Event Box */}
              <div className={`w-full ${index % 2 === 0 ? 'lg:pl-120 sm:pl-0' : 'lg:pr-120 sm:pl-0'}`}>
                <EventBox event={event} size={"small"} />
              </div>

              {/* Spacer */}
              <div className="w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-flat-gold text-lg">No events scheduled yet</p>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            Check back soon for upcoming VSBC events and opportunities!
          </p>
        </div>
      )}
    </div>
  );
} 