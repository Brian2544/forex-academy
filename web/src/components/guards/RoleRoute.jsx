import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const RoleRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, role, isOnboarded } = useAuth();

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

  // Only redirect to onboarding if profile is incomplete
  // This should only happen during registration, not login
  // Skip onboarding check for admin routes - they can access even if profile incomplete
  if (!isOnboarded && !roles.includes('admin') && !roles.includes('owner')) {
    // Only redirect if we're not already on onboarding page
    if (window.location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }
  }

  // Check role (case-insensitive comparison)
  if (roles.length > 0) {
    const roleLower = role?.toLowerCase();
    const rolesLower = roles.map(r => r.toLowerCase());
    if (!rolesLower.includes(roleLower)) {
      // Redirect to appropriate dashboard based on role
      if (roleLower === 'owner') {
        return <Navigate to="/owner/dashboard" replace />;
      } else if (['admin', 'super_admin', 'content_admin', 'support_admin', 'finance_admin'].includes(roleLower)) {
        return <Navigate to="/admin/overview" replace />;
      } else if (roleLower === 'instructor') {
        return <Navigate to="/instructor/overview" replace />;
      } else {
        return <Navigate to="/student/dashboard" replace />;
      }
    }
  }

  return children;
};

export default RoleRoute;

