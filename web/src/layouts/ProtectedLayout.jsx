import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import AppNavbar from '../components/common/AppNavbar';

const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30">
      <AppNavbar />
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;

