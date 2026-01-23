import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { paymentService } from '../services/payment.service';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { supabase } from '../config/supabase';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [courseLevel, setCourseLevel] = useState(null);
  const [reference, setReference] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const referenceParam = searchParams.get('reference') || searchParams.get('trxref');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!referenceParam) {
        setStatus('failed');
        setMessage('Missing payment reference. Please try again.');
        return;
      }

      if (!isAuthenticated) {
        sessionStorage.setItem('paystack_return_to', location.pathname + location.search);
        setStatus('failed');
        setMessage('Please sign in to complete payment verification.');
        return;
      }

      const alreadyVerified = sessionStorage.getItem(`paystack_verified_${referenceParam}`);
      if (alreadyVerified) {
        if (!sessionStorage.getItem(`paystack_redirected_${referenceParam}`)) {
          sessionStorage.setItem(`paystack_redirected_${referenceParam}`, 'true');
          navigate('/student/dashboard', { replace: true });
        }
        return;
      }

      setReference(referenceParam);
      try {
        if (import.meta.env.DEV) {
          const { data: { session } } = await supabase.auth.getSession();
          console.debug('[Paystack] Verify request', {
            reference: referenceParam,
            hasAuthToken: !!session?.access_token,
          });
        }
        const response = await paymentService.verifyCoursePayment(referenceParam);
        if (response.success) {
          setStatus('success');
          setCourseLevel(response.data?.courseLevel || null);
          setMessage('Payment verified successfully. Your access is now active.');
          sessionStorage.setItem(`paystack_verified_${referenceParam}`, 'true');
          try {
            await paymentService.getCourseEntitlements();
          } catch (refreshError) {
            console.warn('Entitlement refresh failed:', refreshError);
          }
          toast.success('Payment successful. Course activated.');
          if (!sessionStorage.getItem(`paystack_redirected_${referenceParam}`)) {
            sessionStorage.setItem(`paystack_redirected_${referenceParam}`, 'true');
            navigate('/student/dashboard', { replace: true });
          }
        } else {
          setStatus('failed');
          setMessage(response.message || 'Payment verification failed. Please contact support.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        if (import.meta.env.DEV) {
          console.debug('[Paystack] Verify error response', error.response?.data);
        }
        setStatus('failed');
        setMessage(error.response?.data?.message || error.message || 'Payment verification failed. Please try again.');
      }
    };

    verifyPayment();
  }, [referenceParam, isAuthenticated, location.pathname, location.search, navigate]);

  const courseRoute = courseLevel ? `/student/courses/${courseLevel}` : '/student/dashboard';

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl bg-[#0D1324] border border-white/10 rounded-2xl p-8 shadow-xl"
      >
        {status === 'verifying' && (
          <div className="text-center">
            <Loader size="lg" />
            <p className="text-gray-300 mt-4">Verifying your payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Payment Successful</h1>
            <p className="text-gray-300 mb-6">{message}</p>
            {reference && (
              <div className="text-xs text-gray-400 mb-6">
                Reference: {reference}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(courseRoute)}
                className="px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
              >
                Go to Course
              </button>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center">
            <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Payment Failed</h1>
            <p className="text-gray-300 mb-6">{message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
                >
                  Sign In to Verify
                </button>
              )}
              <button
                onClick={() => navigate('/courses')}
                className="px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
              >
                Retry Payment
              </button>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentStatus;
