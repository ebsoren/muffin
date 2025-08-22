import { GROUPME_URL } from "../../../utils/constants";

export default function Header() {
  return (
    <div className="text-center mb-12 sm:mb-16 px-4">
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-flat-gold my-6 sm:my-8">
        Join VSBAC
      </div>

      <div className="text-lg sm:text-xl text-custom-black dark:text-white">
        Come see us at upcoming events and join our <a href={GROUPME_URL} className="text-blue-500 hover:text-blue-600">GroupMe</a>.
      </div>
    </div>
  );
} 