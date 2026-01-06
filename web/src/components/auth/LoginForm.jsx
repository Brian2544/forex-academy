import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission
    
    console.log('[LoginForm] Submit handler started');
    setLoading(true);
    setError('');

    try {
      console.log('[LoginForm] Calling login function');
      const result = await login(formData.email, formData.password);
      console.log('[LoginForm] Login result:', result);
      
      if (!result || !result.success) {
        const errorMsg = result?.error || 'Login failed. Please check your credentials.';
        setError(errorMsg);
        console.error('[LoginForm] Login failed:', errorMsg);
      } else {
        console.log('[LoginForm] Login successful, navigation should happen');
        // Success - navigation happens in login function
        // Loading will be reset in finally, but component may unmount on navigation
      }
    } catch (error) {
      const errorMsg = error.message || 'Login failed. Please try again.';
      setError(errorMsg);
      console.error('[LoginForm] Login error:', error);
      toast.error(errorMsg);
    } finally {
      console.log('[LoginForm] Setting loading to false');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30 hover:scale-110 transition-transform duration-300">
            <span className="text-slate-900 font-bold text-2xl">FX</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Welcome Back</h2>
          <p className="text-slate-400">Sign in to continue your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? <Loader size="sm" /> : 'Sign In'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
