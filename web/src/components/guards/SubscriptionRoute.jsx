import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const SubscriptionRoute = ({ children }) => {
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin and owner roles bypass subscription requirement
  const userRole = profile?.role?.toLowerCase();
  const isAdminOrOwner = ['admin', 'super_admin', 'owner', 'content_admin', 'support_admin', 'finance_admin'].includes(userRole);
  
  if (isAdminOrOwner) {
    return children;
  }

  // For students, subscription check is handled by backend middleware
  // Frontend just allows access - backend will enforce if needed
  return children;
};

export default SubscriptionRoute;

