import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated and is admin
  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'OWNER', 'INSTRUCTOR'].includes(user.role);
      if (isAdmin) {
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      } else {
        // If user is not admin, redirect to student dashboard
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const userData = response.data.data.user;
        
        // Check if user is admin
        const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'OWNER', 'INSTRUCTOR'].includes(userData.role);
        
        if (!isAdmin) {
          toast.error('Access denied. Admin access required.');
          setLoading(false);
          return;
        }

        // Update auth context
        await login(email, password);
        
        toast.success('Login successful!');
        
        // Redirect to intended page or admin dashboard
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 gradient-brand rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-black text-2xl">FX</span>
            </div>
            <div className="text-left">
              <span className="text-2xl font-black text-neutral-900">Forex Academy</span>
              <div className="text-sm text-secondary-600 font-medium">Admin Portal</div>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Login</h1>
          <p className="text-neutral-600">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="admin@forexacademy.com"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Need help?{' '}
              <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact Support
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-warning-50 border border-warning-200 rounded-xl">
          <p className="text-xs text-warning-800 text-center">
            🔒 This is a secure admin area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

