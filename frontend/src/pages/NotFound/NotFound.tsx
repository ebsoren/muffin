import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center h-screen mt-20 sm:mt-50 px-4 text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-base sm:text-lg mt-3 sm:mt-5">We don't have that. Drafting Colston Loveland might make you feel better.</p>
      <Link to="/" className="text-blue-500 hover:text-blue-700 text-xl sm:text-2xl mt-10 sm:mt-20">Go home</Link>
    </div>
  );
};