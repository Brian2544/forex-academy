import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center shadow-md shadow-primary-500/30 group-hover:scale-110 group-hover:shadow-glow-primary transition-all duration-300">
              <span className="text-white font-black text-xl">FX</span>
            </div>
            <div>
              <span className="text-xl font-black text-neutral-900">Forex Academy</span>
              <div className="text-xs text-secondary-600 font-medium">Learn, Practice & Trade.</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/courses" className="text-neutral-700 hover:text-primary-600 transition font-medium relative group">
              Courses
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/signals" className="text-neutral-700 hover:text-primary-600 transition font-medium relative group">
              Signals
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/live-classes" className="text-neutral-700 hover:text-primary-600 transition font-medium relative group">
              Live Classes
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/pricing" className="text-neutral-700 hover:text-primary-600 transition font-medium relative group">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/trainees" className="text-neutral-700 hover:text-primary-600 transition font-medium relative group">
                  Professionals
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/dashboard" className="text-neutral-700 hover:text-primary-600 transition font-medium relative group">
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/profile" className="text-neutral-700 hover:text-primary-600 transition font-medium relative group">
                  {user?.firstName || user?.email?.split('@')[0] || 'Profile'}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 border-2 border-secondary-500 text-secondary-600 rounded-lg hover:bg-secondary-500 hover:text-white hover:shadow-md transition-all duration-300 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-neutral-700 hover:text-primary-600 transition font-medium relative group">
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/register" className="px-6 py-2 gradient-brand text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-700 hover:text-primary-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 bg-white">
            <div className="flex flex-col space-y-4">
              <Link to="/courses" className="text-neutral-700 hover:text-primary-600 transition font-medium">
                Courses
              </Link>
              <Link to="/signals" className="text-neutral-700 hover:text-primary-600 transition font-medium">
                Signals
              </Link>
              <Link to="/live-classes" className="text-neutral-700 hover:text-primary-600 transition font-medium">
                Live Classes
              </Link>
              <Link to="/pricing" className="text-neutral-700 hover:text-primary-600 transition font-medium">
                Pricing
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/trainees" className="text-neutral-700 hover:text-primary-600 transition font-medium">
                    Professionals
                  </Link>
                  <Link to="/dashboard" className="text-neutral-700 hover:text-primary-600 transition font-medium">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-neutral-700 hover:text-primary-600 transition font-medium">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-neutral-700 hover:text-primary-600 transition font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-neutral-700 hover:text-primary-600 transition font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="px-6 py-2 gradient-brand text-white font-bold rounded-lg text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
