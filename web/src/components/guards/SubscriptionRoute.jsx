import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const SubscriptionRoute = ({ children }) => {
  const { user, subscriptionStatus, loading } = useAuth();
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

  // Check if subscription is active
  if (subscriptionStatus !== 'ACTIVE') {
    return <Navigate to="/pricing" state={{ from: location, message: 'Active subscription required' }} replace />;
  }

  return children;
};

export default SubscriptionRoute;

