import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, CheckCircle2, XCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      try {
        const response = await api.get('/student/dashboard');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        return {
          access: 'inactive',
          whatsapp_channel_url: null,
          counts: { new_lessons: 0, upcoming_classes: 0, announcements: 0 },
          next_sessions: [],
        };
      }
    },
  });

  const { data: plansData } = useQuery({
    queryKey: ['billing-plans'],
    queryFn: async () => {
      try {
        const response = await api.get('/billing/plans');
        return response.data.data || [];
      } catch (error) {
        return [];
      }
    },
  });

  const access = dashboardData?.access || 'inactive';
  const isActive = access === 'active';

  const handleCheckout = async (planId) => {
    try {
      const response = await api.post('/payments/checkout', { planId });
      if (response.data.success && response.data.data.authorization_url) {
        window.location.href = response.data.data.authorization_url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
    }
  };

  const handleCardClick = (e, link) => {
    if (!isActive) {
      e.preventDefault();
      navigate('/billing');
    }
  };

  // Dashboard sections matching exact layout
  const sections = {
    left: [
      {
        title: 'Learning & Training',
        items: [
          { text: 'Beginner course', link: '/student/courses/beginner' },
          { text: 'Intermediate course', link: '/student/courses/intermediate' },
          { text: 'Advanced course', link: '/student/courses/advanced' },
        ],
      },
      {
        title: 'Market Analysis',
        items: [
          { text: 'Daily/weekly analysis', link: '/student/market-analysis?type=daily' },
          { text: 'Economic calendar', link: '/student/market-analysis?type=weekly' },
        ],
      },
      {
        title: 'FAQs',
        items: [
          { text: 'Forex myths & common mistakes', link: '/student/faqs/myths' },
          { text: 'Scam awareness in forex', link: '/student/faqs/scam-awareness' },
          { text: 'Is forex risky', link: '/student/faqs/risky' },
          { text: 'Who is this for', link: '/student/faqs/who-is-this-for' },
          { text: 'Do you guarantee profits (answer should be NO)', link: '/student/faqs/guarantee' },
          { text: 'How long before I see results?', link: '/student/faqs/results' },
        ],
      },
    ],
    middle: [
      {
        title: 'Communication Box',
        items: [
          { text: 'Member-only discussion forums', link: '/chat/groups', external: false },
          { text: 'Announcements & updates section', link: '/student/announcements', external: false },
          { text: 'Q&A section', link: '/chat/groups', external: false },
          { text: 'Direct support contact', link: '/student/contact', external: false },
          { text: 'WhatsApp link for WhatsApp channel', link: dashboardData?.whatsapp_channel_url || '#', external: true },
        ],
      },
      {
        title: 'Blog',
        items: [
          { text: 'Forex basics articles', link: '/student/blog' },
        ],
      },
      {
        title: 'Legal & Disclaimer Section',
        items: [
          { text: 'Risk disclaimer', link: '/legal/disclaimer' },
          { text: 'Terms and conditions', link: '/legal/terms' },
          { text: 'Privacy policy', link: '/legal/privacy' },
        ],
      },
      {
        title: 'Contact & Support',
        items: [
          { text: 'Contact form', link: '/student/contact' },
          { text: 'Email & WhatsApp support', link: '/student/contact' },
          { text: 'Response time expectation', link: '/student/contact' },
        ],
      },
    ],
    right: [
      {
        title: 'Referral System',
        items: [
          { text: 'A discount for a referral', link: '/student/referral' },
        ],
      },
      {
        title: 'Live Classes & Webinars',
        items: [
          { text: 'Schedule for live classes', link: '/student/live-classes' },
          { text: 'Schedule for webinars', link: '/student/live-classes' },
        ],
      },
      {
        title: 'Testimonials & Success Stories',
        items: [
          { text: 'Trainees reviews', link: '/student/testimonials' },
          { text: 'Before and after stories', link: '/student/testimonials/stories' },
          { text: 'Screenshots', link: '/student/testimonials/screenshots' },
          { text: 'Video testimonials', link: '/student/testimonials/videos' },
        ],
      },
      {
        title: 'Profile',
        items: [
          { text: 'Details of the trainee', link: '/student/profile' },
          { text: 'Slot for changing the details', link: '/student/profile/edit' },
        ],
      },
    ],
  };

  const SectionCard = ({ section, column }) => {
    // Determine the main link for the card (first item or a default)
    const mainLink = section.items[0]?.link || '#';
    const isExternal = section.items[0]?.external;

    const CardContent = () => (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
        <ul className="space-y-2">
          {section.items.map((item, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2 text-gray-400">•</span>
              {item.external ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline flex-1"
                >
                  {item.text}
                </a>
              ) : (
                <Link
                  to={item.link}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(e, item.link);
                  }}
                  className={`text-sm flex-1 ${
                    isActive
                      ? 'text-blue-600 hover:text-blue-700 hover:underline'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {!isActive && <Lock className="w-3 h-3 inline mr-1" />}
                  {item.text}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-white border-2 rounded-lg shadow-sm transition-all duration-300 ${
          isActive
            ? 'border-gray-200 hover:border-blue-400 hover:shadow-lg cursor-pointer'
            : 'border-gray-300 opacity-75'
        }`}
        onClick={() => {
          if (!isActive) {
            navigate('/billing');
          } else if (!isExternal && mainLink !== '#') {
            navigate(mainLink);
          }
        }}
      >
        <CardContent />
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Trainees Page</h1>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
            {!isActive && (
              <button
                onClick={() => navigate('/billing')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Activate Subscription
              </button>
            )}
          </div>
        </div>

        {/* Billing Panel (shown when inactive) */}
        {!isActive && plansData && plansData.length > 0 && (
          <div className="mb-8 bg-white border-2 border-primary-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose a Plan to Get Started</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {plansData.map((plan) => (
                <div
                  key={plan.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-2xl font-bold text-primary-600 mb-2">
                    ${plan.price_usd.toLocaleString()}
                    {plan.interval === 'monthly' && <span className="text-sm text-gray-600">/month</span>}
                  </p>
                  <button
                    onClick={() => handleCheckout(plan.id)}
                    className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Pay Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {sections.left.map((section, idx) => (
              <SectionCard key={idx} section={section} column="left" />
            ))}
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {sections.middle.map((section, idx) => (
              <SectionCard key={idx} section={section} column="middle" />
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {sections.right.map((section, idx) => (
              <SectionCard key={idx} section={section} column="right" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
