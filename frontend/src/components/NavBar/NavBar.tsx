import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleTheme } from '../../store/slices/statusSlice';

export function NavBar() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.status.theme);
  const location = useLocation();

  return (
    <nav className="w-full bg-white dark:bg-flat-gold border-b border-flat-gold px-4 py-4 shadow-sm duration-200">
      <div className="flex justify-between items-center">
        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors ${
              location.pathname === '/' ? 'font-bold' : ''
            }`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors ${
              location.pathname === '/about' ? 'font-bold' : ''
            }`}
          >
            About
          </Link>
          <Link 
            to="/events" 
            className={`text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors ${
              location.pathname === '/events' ? 'font-bold' : ''
            }`}
          >
            Events
          </Link>
          <Link 
            to="/join" 
            className={`text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors ${
              location.pathname === '/join' ? 'font-bold' : ''
            }`}
          >
            Join
          </Link>
        </div>
        
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg bg-flat-gold hover:bg-flat-gold-hover dark:bg-custom-black dark:hover:bg-custom-black-hover"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            // Moon icon for dark mode - black since navbar is flat-gold
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            // Sun icon for light mode - flat-gold since navbar is white
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
} 