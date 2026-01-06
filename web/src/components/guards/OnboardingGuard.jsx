import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

/**
 * Guard for onboarding page - only allows access if profile is incomplete
 * If profile is complete, redirects to appropriate dashboard
 */
const OnboardingGuard = ({ children }) => {
  const { isAuthenticated, loading, isOnboarded, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If profile is already complete, redirect to dashboard
  if (isOnboarded) {
    if (['admin', 'owner'].includes(role)) {
      return <Navigate to="/admin/overview" replace />;
    } else if (role === 'instructor') {
      return <Navigate to="/instructor/overview" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  // Profile is incomplete, allow onboarding
  return children;
};

export default OnboardingGuard;

