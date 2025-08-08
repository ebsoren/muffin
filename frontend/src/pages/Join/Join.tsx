import { useAppSelector } from "../../store/hooks";
import type { ClubEvent } from "../../store/slices/types/Event";
import { EventBox } from "../components/EventBox";

export function Join() {
  // const events = useAppSelector((state) => state.recruiting);
  const E: ClubEvent = {title: "hello event here", img: "", description: "Hello description of what we're doing", date:"2025-08-29", location:"500 Building Ten"}
  const events = [E, E, E, E, E]
  

  return (
    <div className="w-full bg-white dark:bg-custom-black duration-200 mb-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-flat-gold my-8">
            Join VSBC
          </h1>

          <div className= "text-xl text-custom-black dark:text-white"> Interested in the intersection of sports, business, and analytics? Come see us at upcoming recruiting events and fill out our interest form. </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-flat-gold mb-8">
              Recruiting Timeline
            </h2>
          </div>
          {/* Events Timeline */}
          <div className="">
            {events?.map((event, index) => (
              <div key={index} className="relative p-2">
                {/* Timeline Node */}
                <div className="absolute left-1/2 bottom-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full border-4 border-gray-900 shadow-lg "/>
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-900 border-4 border-gray-900 ${index == 0 ? 'h-full mt-39' : (index == events.length-1 ? 'h-5/11' : 'h-full')}  `}/>

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
    </div>
  );
} 