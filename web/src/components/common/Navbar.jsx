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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-dark-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/50 group-hover:scale-110 transition-transform">
              <span className="text-dark-950 font-black text-xl">FX</span>
            </div>
            <div>
              <span className="text-xl font-black text-white">Forex Academy</span>
              <div className="text-xs text-primary-400 font-medium">Learn. Practice. Trade.</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/courses" className="text-gray-300 hover:text-primary-500 transition font-medium">
              Courses
            </Link>
            <Link to="/signals" className="text-gray-300 hover:text-primary-500 transition font-medium">
              Signals
            </Link>
            <Link to="/live-classes" className="text-gray-300 hover:text-primary-500 transition font-medium">
              Live Classes
            </Link>
            <Link to="/pricing" className="text-gray-300 hover:text-primary-500 transition font-medium">
              Pricing
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-primary-500 transition font-medium">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-300 hover:text-primary-500 transition font-medium">
                  {user?.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 border-2 border-primary-500/50 text-primary-400 rounded-lg hover:bg-primary-500/10 hover:border-primary-500 transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-primary-500 transition font-medium">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2 gradient-gold text-dark-950 font-bold rounded-lg hover:shadow-lg hover:shadow-primary-500/50 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-primary-500"
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
          <div className="md:hidden py-4 border-t border-dark-800">
            <div className="flex flex-col space-y-4">
              <Link to="/courses" className="text-gray-300 hover:text-primary-500 transition font-medium">
                Courses
              </Link>
              <Link to="/signals" className="text-gray-300 hover:text-primary-500 transition font-medium">
                Signals
              </Link>
              <Link to="/live-classes" className="text-gray-300 hover:text-primary-500 transition font-medium">
                Live Classes
              </Link>
              <Link to="/pricing" className="text-gray-300 hover:text-primary-500 transition font-medium">
                Pricing
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-primary-500 transition font-medium">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-gray-300 hover:text-primary-500 transition font-medium">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-300 hover:text-primary-500 transition font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-primary-500 transition font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="px-6 py-2 gradient-gold text-dark-950 font-bold rounded-lg text-center">
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
