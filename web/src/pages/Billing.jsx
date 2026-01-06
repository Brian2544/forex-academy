import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { CheckCircle2, Lock } from 'lucide-react';

const Billing = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  // Handle Paystack redirect
  useEffect(() => {
    if (reference || trxref) {
      // Payment was successful, show success message
      toast.success('Payment successful! Your subscription is being activated...');
      // Refetch access status
      setTimeout(() => {
        window.location.href = '/student/dashboard';
      }, 2000);
    }
  }, [reference, trxref]);

  const { data: plansData, isLoading: plansLoading } = useQuery({
    queryKey: ['billing-plans'],
    queryFn: async () => {
      try {
        const response = await api.get('/billing/plans');
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching plans:', error);
        return [];
      }
    },
  });

  const { data: accessData } = useQuery({
    queryKey: ['student-access'],
    queryFn: async () => {
      try {
        const response = await api.get('/student/access');
        return response.data.data;
      } catch (error) {
        return { access: 'inactive' };
      }
    },
    enabled: isAuthenticated,
  });

  const handleCheckout = async (planId) => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/payments/checkout', { planId });
      if (response.data.success && response.data.data.authorization_url) {
        window.location.href = response.data.data.authorization_url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
    }
  };

  const access = accessData?.access || 'inactive';
  const isActive = access === 'active';

  if (plansLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a subscription plan to access all training materials, live classes, and exclusive content.
          </p>
          {isActive && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Your subscription is active</span>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plansData && plansData.length > 0 ? (
            plansData.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-primary-300 hover:shadow-lg transition-all"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary-600">
                      ${plan.price_usd.toLocaleString()}
                    </span>
                    {plan.interval === 'monthly' && (
                      <span className="text-gray-600">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Access to all courses (Beginner, Intermediate, Advanced)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Live classes and webinars</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Market analysis and insights</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Member-only discussion forums</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Blog articles and resources</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={isActive}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    isActive
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isActive ? 'Active Subscription' : 'Pay Now'}
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-600">No plans available at the moment.</p>
            </div>
          )}
        </div>

        {/* Payment Info */}
        <div className="mt-12 max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Information</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Payments are processed securely through Paystack</li>
            <li>• All prices are in US Dollars (USD)</li>
            <li>• Your subscription will be activated immediately after successful payment</li>
            <li>• You can access all content once your payment is confirmed</li>
          </ul>
        </div>

        {/* Risk Disclaimer */}
        <div className="mt-8 max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Disclaimer</h3>
          <p className="text-sm text-gray-700">
            Trading forex involves substantial risk of loss. We do not guarantee profits. 
            Past performance is not indicative of future results. Only trade with money you can afford to lose.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Billing;

