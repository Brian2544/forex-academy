import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';
import Dashboard from '../../pages/Dashboard';

/**
 * Component that shows the appropriate dashboard based on user role
 * - OWNER, SUPER_ADMIN, ADMIN, INSTRUCTOR -> redirects to /admin/dashboard
 * - STUDENT -> shows student dashboard (Dashboard component)
 */
const RoleBasedDashboardRedirect = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role from both user object and role state (for redundancy)
  // Prioritize role state as it's updated from /auth/me which gets fresh data from DB
  const userRole = role || user?.role;

  // Admin roles should go to admin dashboard
  if (userRole && ['OWNER', 'SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR'].includes(userRole)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Students see the student dashboard
  // Default fallback: if role is not recognized, show student dashboard
  return <Dashboard />;
};

export default RoleBasedDashboardRedirect;

