import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const AdminRoute = ({ children, requireSubscription = false }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const role = profile?.role;
  const isAdmin = role && ['ADMIN', 'SUPER_ADMIN', 'OWNER', 'INSTRUCTOR', 'CONTENT_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN'].includes(role);

  if (!isAdmin) {
    return <Navigate to="/student/dashboard" replace />;
  }

  // Admin and owner roles bypass subscription requirement
  // Note: requireSubscription flag is deprecated - admins always have access
  return children;
};

export default AdminRoute;

