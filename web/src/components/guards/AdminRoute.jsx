import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const AdminRoute = ({ children, requireSubscription = false }) => {
  const { user, role, subscriptionStatus, loading } = useAuth();
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

  const isAdmin = role && ['ADMIN', 'SUPER_ADMIN', 'OWNER', 'INSTRUCTOR'].includes(role);

  if (!isAdmin) {
    return <Navigate to="/student/dashboard" replace />;
  }

  // Check subscription if required (for premium admin features)
  if (requireSubscription && subscriptionStatus !== 'ACTIVE') {
    return <Navigate to="/pricing" replace />;
  }

  return children;
};

export default AdminRoute;

