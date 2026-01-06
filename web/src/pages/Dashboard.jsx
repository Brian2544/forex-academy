import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import DashboardCard from '../components/dashboard/DashboardCard';
import WhatsAppButton from '../components/common/WhatsAppButton';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getIcon } from '../utils/icons';

const Dashboard = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect admin users to admin dashboard (fallback check)
  useEffect(() => {
    if (!authLoading && user) {
      const userRole = role || user?.role;
      if (userRole && ['OWNER', 'SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR'].includes(userRole)) {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await api.get('/health');
      setHealthStatus(response.data);
    } catch (error) {
      setHealthStatus({ ok: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Determine user status for cards
  const getUserStatus = () => {
    if (!user) return 'inactive';
    return user.status || 'active';
  };

  const userStatus = getUserStatus();
  const statusColor = userStatus === 'active' ? 'green' : userStatus === 'suspended' ? 'red' : 'yellow';

  // 11 Dashboard Cards based on the outline
  const dashboardCards = [
    {
      id: 1,
      title: 'Beginner Course',
      description: 'Start your forex trading journey with fundamentals and basics',
      iconName: 'beginner',
      link: '/dashboard/beginner-course',
      status: userStatus,
      statusColor: statusColor
    },
    {
      id: 2,
      title: 'Intermediate Course',
      description: 'Advance your skills with intermediate trading strategies',
      iconName: 'intermediate',
      link: '/dashboard/intermediate-course',
      status: userStatus,
      statusColor: statusColor
    },
    {
      id: 3,
      title: 'Advanced Course',
      description: 'Master advanced techniques and professional trading methods',
      iconName: 'advanced',
      link: '/dashboard/advanced-course',
      status: userStatus,
      statusColor: statusColor
    },
    {
      id: 4,
      title: 'Market Analysis',
      description: 'Daily/weekly analysis and economic calendar',
      iconName: 'analysis',
      link: '/dashboard/market-analysis',
      status: userStatus,
      statusColor: statusColor
    },
    {
      id: 5,
      title: 'FAQs',
      description: 'Forex myths, common mistakes, scam awareness, and more',
      iconName: 'faq',
      link: '/dashboard/faqs',
      status: userStatus,
      statusColor: statusColor
    },
    {
      id: 6,
      title: 'Communication Hub',
      description: 'Forums, announcements, Q&A, and direct support',
      iconName: 'communication',
      link: '/dashboard/communication',
      status: userStatus,
      statusColor: statusColor
    },
    {
      id: 7,
      title: 'Blog',
      description: 'Forex basics articles and educational content',
      iconName: 'blog',
      link: '/dashboard/blog',
      status: userStatus,
      statusColor: statusColor
    },
    {
      id: 8,
      title: 'Legal & Disclaimer',
      description: 'Risk disclaimer, terms, conditions, and privacy policy',
      iconName: 'legal',
      link: '/dashboard/legal',
      status: userStatus,
      statusColor: statusColor
    },
    {
      id: 9,
      title: 'Contact & Support',
      description: 'Contact form, email, WhatsApp support with response times',
      iconName: 'contact',
      link: '/dashboard/contact',
      status: userStatus,
      statusColor: statusColor
    },
    {
      id: 10,
      title: 'Referral System',
      description: 'Earn discounts by referring friends to the academy',
      iconName: 'referral',
      link: '/dashboard/referral',
      status: userStatus,
      statusColor: statusColor
    },
    {
      id: 11,
      title: 'Live Classes & Webinars',
      description: 'Schedule and join live trading classes and webinars',
      iconName: 'live',
      link: '/dashboard/live-classes',
      status: userStatus,
      statusColor: statusColor
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Section */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/5 to-primary-500/10 rounded-2xl blur-3xl"></div>
          <div className="relative bg-white border-2 border-primary-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              Welcome back, <span className="text-gradient">{user?.email?.split('@')[0] || 'Professional'}</span>!
            </h1>
            <p className="text-neutral-600">
              Continue your professional development and explore all available resources
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusColor === 'green' ? 'bg-secondary-500' : statusColor === 'red' ? 'bg-danger-500' : 'bg-primary-500'} animate-pulse shadow-lg ${
                  statusColor === 'green' ? 'shadow-secondary-500/50' : statusColor === 'red' ? 'shadow-danger-500/50' : 'shadow-primary-500/50'
                }`}></div>
                <span className="text-sm text-neutral-600">Status: <span className="text-neutral-900 capitalize font-semibold">{userStatus}</span></span>
              </div>
              {healthStatus?.ok && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-secondary-500 rounded-full animate-pulse shadow-lg shadow-secondary-500/50"></div>
                  <span className="text-sm text-neutral-600">Backend Connected</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card) => (
            <DashboardCard
              key={card.id}
              title={card.title}
              description={card.description}
              iconName={card.iconName}
              link={card.link}
              status={card.status}
              statusColor={card.statusColor}
            />
          ))}
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-dark relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-100 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Testimonials & Success Stories</h2>
              <p className="text-neutral-600 mb-4">
                Read reviews from professionals, see before and after stories, screenshots, and video testimonials
              </p>
              <Link
                to="/dashboard/testimonials"
                className="inline-flex items-center text-secondary-600 hover:text-secondary-700 font-medium group link-secondary"
              >
                View Testimonials
                <span className="ml-2 group-hover:ml-3 transition-all">→</span>
              </Link>
            </div>
          </div>

          <div className="card-dark relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-secondary-100 to-transparent rounded-br-full"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Your Profile</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Email:</span>
                  <span className="text-neutral-900 font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Role:</span>
                  <span className="text-neutral-900 capitalize font-medium">{user?.role || 'Professional'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Status:</span>
                  <span className={`capitalize font-semibold ${
                    statusColor === 'green' ? 'text-secondary-600' : 
                    statusColor === 'red' ? 'text-danger-600' : 
                    'text-primary-600'
                  }`}>
                    {userStatus}
                  </span>
                </div>
              </div>
              <Link
                to="/profile"
                className="inline-flex items-center text-secondary-600 hover:text-secondary-700 font-medium group link-secondary"
              >
                Edit Profile
                <span className="ml-2 group-hover:ml-3 transition-all">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Dashboard;
