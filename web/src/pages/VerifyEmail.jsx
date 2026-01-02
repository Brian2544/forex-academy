import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      toast.error('Verification token is missing');
      return;
    }

    authService.verifyEmail(token)
      .then(({ data }) => {
        setStatus('success');
        toast.success(data.message || 'Email verified successfully!');
        
        // Auto-login user if token and user data are returned
        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          updateUser(data.user); // Update AuthContext immediately
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          // Fallback to login if no auto-login
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      })
      .catch((error) => {
        setStatus('error');
        toast.error(error.response?.data?.message || 'Verification failed');
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          {status === 'verifying' && (
            <>
              <Loader size="lg" />
              <p className="text-gray-400 mt-4">Verifying your email...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-400 text-4xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-gray-400">Redirecting to your dashboard...</p>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-4xl">✗</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
              <p className="text-gray-400 mb-4">Invalid or expired token</p>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary"
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmail;

