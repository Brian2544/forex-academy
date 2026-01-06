import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    console.log('[RegisterForm] Submit handler started');
    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = formData;
      console.log('[RegisterForm] Calling register function');
      const result = await register(registerData);
      console.log('[RegisterForm] Register result:', result);
      
      if (!result || !result.success) {
        const errorMsg = result?.error || 'Registration failed. Please try again.';
        setError(errorMsg);
        console.error('[RegisterForm] Registration failed:', errorMsg);
      } else if (result.needsManualLogin) {
        setError('Registration successful! Please check your email and sign in manually.');
        console.log('[RegisterForm] Registration successful but needs manual login');
      } else {
        console.log('[RegisterForm] Registration successful, navigation should happen');
        // Success - navigation happens in register function
      }
    } catch (error) {
      const errorMsg = error.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      console.error('[RegisterForm] Registration error:', error);
      toast.error(errorMsg);
    } finally {
      console.log('[RegisterForm] Setting loading to false');
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
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Create Account</h2>
          <p className="text-slate-400">Start your Forex trading journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="John Doe"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="input"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className={`rounded-lg p-3 ${
              error.includes('successful') 
                ? 'bg-amber-500/10 border border-amber-500/50' 
                : 'bg-red-500/10 border border-red-500/50'
            }`}>
              <p className={`text-sm ${
                error.includes('successful') ? 'text-amber-400' : 'text-red-400'
              }`}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? <Loader size="sm" /> : 'Create Account'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
