import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

// Pages
import Home from '../pages/Home';
import Courses from '../pages/Courses';
import Dashboard from '../pages/Dashboard';
import Signals from '../pages/Signals';
import LiveClasses from '../pages/LiveClasses';
import Pricing from '../pages/Pricing';
import Profile from '../pages/Profile';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import VerifyEmail from '../pages/VerifyEmail';
import Terms from '../pages/legal/Terms';
import Privacy from '../pages/legal/Privacy';
import Disclaimer from '../pages/legal/Disclaimer';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<Courses />} />
      <Route path="/signals" element={<Signals />} />
      <Route path="/live-classes" element={<LiveClasses />} />
      <Route path="/pricing" element={<Pricing />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      
      {/* Legal Routes */}
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      <Route path="/legal/disclaimer" element={<Disclaimer />} />
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
