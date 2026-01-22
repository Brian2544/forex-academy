import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-[#F5F7FF] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#B6C2E2] mb-4">Page Not Found</h2>
        <p className="text-[#B6C2E2] mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/40 transition-all duration-300"
          >
            Go Home
          </Link>
          {isAuthenticated && (
            <Link
              to="/student/dashboard"
              className="px-6 py-3 bg-[#0B1220] border-2 border-amber-500 text-amber-500 font-bold rounded-lg hover:bg-amber-500 hover:text-white transition-all duration-300"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
