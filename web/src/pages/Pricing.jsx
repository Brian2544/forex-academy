import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import { paymentService } from '../services/payment.service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await paymentService.getPlans();
      setPlans(data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe');
      return;
    }

    if (plan === 'free') {
      toast.success('Free plan is already active!');
      return;
    }

    try {
      const { data } = await paymentService.initiatePayment(plan);
      if (data.paymentLink) {
        window.location.href = data.paymentLink;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment initialization failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const planOrder = ['free', 'monthly', 'premium', 'lifetime'];

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-gray-400 text-lg">
            Select the plan that best fits your trading journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {planOrder.map((planKey) => {
            const plan = plans[planKey];
            if (!plan) return null;

            const isPopular = planKey === 'premium';

            return (
              <div
                key={planKey}
                className={`card relative ${isPopular ? 'border-2 border-primary-500' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-dark-950 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary-500">
                      ${plan.price}
                    </span>
                    {planKey !== 'free' && planKey !== 'lifetime' && (
                      <span className="text-gray-400">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-500 mr-2">✓</span>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(planKey)}
                  className={`btn w-full ${
                    isPopular ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  {planKey === 'free' ? 'Get Started' : 'Subscribe'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 card bg-yellow-500/10 border-yellow-500/50 max-w-3xl mx-auto">
          <p className="text-yellow-400 text-sm text-center">
            <strong>Risk Disclaimer:</strong> Trading forex involves substantial risk of loss. 
            We do not guarantee profits. Past performance is not indicative of future results. 
            Only trade with money you can afford to lose.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;

