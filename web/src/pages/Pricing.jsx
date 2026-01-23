import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import { paymentService } from '../services/payment.service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getIcon } from '../utils/icons';

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

  const handleSubscribe = async (planKey) => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe');
      return;
    }

    if (planKey === 'free') {
      toast.success('Free plan is already active!');
      return;
    }

    // Find plan ID from plans object
    const plan = plans[planKey];
    if (!plan || !plan.id) {
      toast.error('Plan not found');
      return;
    }

    try {
      const { data } = await paymentService.initiatePayment(plan.id);
      if (data.success && data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        toast.error('Failed to initialize payment');
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
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 via-primary-500/5 to-accent-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl font-bold text-white mb-4">
              Choose Your <span className="bg-gradient-to-r from-accent-500 to-primary-500 bg-clip-text text-transparent">Trading Plan</span>
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Select the perfect plan for your trading journey. From free beginner courses to premium 
              lifetime access, we have options for every trader at every stage.
            </p>
          </div>
        </div>

        {/* Plan Comparison Info */}
        <div className="card mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Why Choose Our Academy?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { iconName: 'graduation', title: 'Expert Instructors', desc: 'Learn from professional traders with years of market experience' },
              { iconName: 'chart', title: 'Proven Strategies', desc: 'Access tested trading strategies used by successful traders' },
              { iconName: 'community', title: 'Community Support', desc: 'Join a community of traders sharing knowledge and experiences' }
            ].map((item, idx) => {
              const IconComponent = getIcon(item.iconName);
              return (
                <div key={idx} className="text-center">
                  <div className="mb-3 flex justify-center">
                    {IconComponent && (
                      <IconComponent className="w-10 h-10 text-primary-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {planOrder.map((planKey) => {
            const plan = plans[planKey];
            if (!plan) return null;

            const isPopular = planKey === 'premium';

            return (
              <div
                key={planKey}
                className={`card relative hover:shadow-xl transition-all ${isPopular ? 'border-2 border-accent-500' : 'hover:border-accent-500'}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-accent-600">
                      {new Intl.NumberFormat('en-KE', {
                        style: 'currency',
                        currency: 'KES',
                        maximumFractionDigits: 0,
                      }).format(Number(plan.price || 0))}
                    </span>
                    {planKey !== 'free' && planKey !== 'lifetime' && (
                      <span className="text-gray-600">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => {
                    const CheckIcon = getIcon('check');
                    return (
                      <li key={index} className="flex items-start">
                        {CheckIcon && <CheckIcon className="w-5 h-5 text-accent-600 mr-2 flex-shrink-0 mt-0.5" />}
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    );
                  })}
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

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I change my plan later?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 7-day money-back guarantee for all paid plans. Contact support for assistance.'
              },
              {
                q: 'Are the courses updated regularly?',
                a: 'Yes, we continuously update our courses with new strategies, market insights, and trading techniques.'
              },
              {
                q: 'Can I access content on mobile?',
                a: 'Absolutely! Our platform is fully responsive and works on all devices - desktop, tablet, and mobile.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="card">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 card bg-yellow-500/10 border-yellow-500/50 max-w-3xl mx-auto">
          <p className="text-yellow-400 text-sm text-center">
            <span className="inline-flex items-center gap-1">
              {(() => {
                const WarningIcon = getIcon('warning');
                return WarningIcon ? (
                  <WarningIcon className="w-4 h-4" />
                ) : null;
              })()}
              <strong>Risk Disclaimer:</strong>
            </span> Trading forex involves substantial risk of loss. 
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

