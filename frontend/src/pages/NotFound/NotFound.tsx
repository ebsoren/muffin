import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center h-screen mt-50">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg mt-5">We don't have that. Drafting Colston Loveland might make you feel better.</p>
      <Link to="/" className="text-blue-500 hover:text-blue-700 text-2xl mt-20">Go home</Link>
    </div>
  );
};