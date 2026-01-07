import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AppNavbar = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    const role = profile?.role?.toLowerCase() || 'student';
    if (role === 'owner') {
      return '/owner/dashboard';
    } else if (['admin', 'super_admin', 'content_admin', 'support_admin', 'finance_admin'].includes(role)) {
      return '/admin/overview';
    } else if (role === 'instructor') {
      return '/instructor/overview';
    } else {
      return '/student/dashboard';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center shadow-md shadow-primary-500/30 group-hover:scale-110 group-hover:shadow-glow-primary transition-all duration-300">
              <span className="text-white font-black text-xl">FX</span>
            </div>
            <div>
              <span className="text-xl font-black text-slate-100">Forex Academy</span>
              <div className="text-xs text-amber-400 font-medium">Learn, Practice & Trade.</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/courses" className="text-slate-300 hover:text-amber-400 transition font-medium relative group">
              Courses
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/signals" className="text-slate-300 hover:text-amber-400 transition font-medium relative group">
              Signals
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/live-classes" className="text-slate-300 hover:text-amber-400 transition font-medium relative group">
              Live Classes
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/pricing" className="text-slate-300 hover:text-amber-400 transition font-medium relative group">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to={getDashboardLink()} className="text-slate-300 hover:text-amber-400 transition font-medium relative group">
              My Portal
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <span className="text-slate-300 font-medium">
              {profile?.first_name || profile?.last_name || user?.email?.split('@')[0] || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="px-6 py-2 border-2 border-amber-400 text-amber-400 rounded-lg hover:bg-amber-400 hover:text-slate-900 hover:shadow-md transition-all duration-300 font-medium"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300 hover:text-amber-400 transition-colors"
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
          <div className="md:hidden py-4 border-t border-slate-700 bg-slate-800">
            <div className="flex flex-col space-y-4">
              <Link to="/courses" className="text-slate-300 hover:text-amber-400 transition font-medium">
                Courses
              </Link>
              <Link to="/signals" className="text-slate-300 hover:text-amber-400 transition font-medium">
                Signals
              </Link>
              <Link to="/live-classes" className="text-slate-300 hover:text-amber-400 transition font-medium">
                Live Classes
              </Link>
              <Link to="/pricing" className="text-slate-300 hover:text-amber-400 transition font-medium">
                Pricing
              </Link>
              <Link to={getDashboardLink()} className="text-slate-300 hover:text-amber-400 transition font-medium">
                My Portal
              </Link>
              <span className="text-slate-300 font-medium">
                {profile?.first_name || profile?.last_name || user?.email?.split('@')[0] || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="text-left text-slate-300 hover:text-amber-400 transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavbar;

