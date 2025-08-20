import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout, clearError } from '../../store/slices/authSlice';
import { LoginModal } from '../Auth/LoginModal';
import { supabase } from '../../utils/supabaseClient';

export function NavBar() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(state => state.auth);
  const isMember = user?.isMember;
  const location = useLocation();
  

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);



  const handleLogout = async () => {
    // Sign out from Supabase first
    try {
      await supabase.auth.signOut();
    } catch (error) {
    }
    
    dispatch(logout());
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setShowMobileMenu(false);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <>
      <nav className="w-full bg-white dark:bg-flat-gold border-b border-flat-gold px-4 py-4 shadow-sm duration-200">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold text-flat-gold dark:text-custom-black"
            >
              VSBC
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
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
            {isAuthenticated && !isLoading && isMember &&(
            <Link 
              to="/members" 
              className={`text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors ${
                location.pathname === '/members' ? 'font-bold' : ''
              }`}
            >
              Members
            </Link>
            )}
            {isAuthenticated && !isLoading && user?.is_admin && (
              <Link 
                to="/admin" 
                className={`text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors ${
                  location.pathname === '/admin' ? 'font-bold' : ''
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {error ? (
              <div className="flex items-center gap-2 px-3 py-2 text-red-600 text-sm">
                <span>Auth Error</span>
                <button 
                  onClick={() => dispatch(clearError())}
                  className="text-xs underline hover:no-underline"
                >
                  Dismiss
                </button>
              </div>
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2"
                >
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center relative">
                    {user?.profile_picture && user.profile_picture.trim() !== '' && (
                      <img
                        src={user.profile_picture}
                        alt={user.first_name}
                        className="w-6 h-6 rounded-full absolute inset-0"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          // Hide the broken image, initials will show through
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        onLoad={() => {
                        }}
                      />
                    )}
                    <span className="text-flat-gold font-bold text-sm">
                      {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="text-black dark:text-white font-medium">
                    {user?.first_name || user?.email}
                  </span>
                  <svg className="w-4 h-4 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50" ref={userMenuRef}>
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                      <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                      <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div >
                <button
                  onClick={handleLoginClick}
                  className="px-2 py-2 text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-flat-gold dark:text-custom-black p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-flat-gold dark:border-custom-black">
            <div className="flex flex-col space-y-4 pt-4">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className={`text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors ${
                  location.pathname === '/' ? 'font-bold' : ''
                }`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                onClick={closeMobileMenu}
                className={`text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors ${
                  location.pathname === '/about' ? 'font-bold' : ''
                }`}
              >
                About
              </Link>
              <Link 
                to="/events" 
                onClick={closeMobileMenu}
                className={`text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors ${
                  location.pathname === '/events' ? 'font-bold' : ''
                }`}
              >
                Events
              </Link>
              <Link 
                to="/join" 
                onClick={closeMobileMenu}
                className={`text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors ${
                  location.pathname === '/join' ? 'font-bold' : ''
                }`}
              >
                Join
              </Link>
              {isAuthenticated && !isLoading && isMember &&(
              <Link 
                to="/members" 
                onClick={closeMobileMenu}
                className={`text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors ${
                  location.pathname === '/members' ? 'font-bold' : ''
                }`}
              >
                Members
              </Link>
              )}
              {isAuthenticated && !isLoading && user?.is_admin && (
                <Link 
                  to="/admin" 
                  onClick={closeMobileMenu}
                  className={`text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors ${
                    location.pathname === '/admin' ? 'font-bold' : ''
                  }`}
                >
                  Admin
                </Link>
              )}
              
              {/* Mobile Auth */}
              {error ? (
                <div className="flex items-center gap-2 px-3 py-2 text-red-600 text-sm">
                  <span>Auth Error</span>
                  <button 
                    onClick={() => dispatch(clearError())}
                    className="text-xs underline hover:no-underline"
                  >
                    Dismiss
                  </button>
                </div>
              ) : isAuthenticated ? (
                <div className="pt-2 border-t border-flat-gold dark:border-custom-black">
                  <div className="px-3 py-2 text-sm text-flat-gold dark:text-custom-black">
                    <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                    <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-md text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-flat-gold dark:border-custom-black">
                  <button
                    onClick={handleLoginClick}
                    className="block w-full text-left py-2 text-md text-flat-gold hover:text-flat-gold-hover dark:text-custom-black dark:hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
} 