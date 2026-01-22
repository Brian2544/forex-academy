import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();

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

  const access = dashboardData?.access || 'active'; // Default to active - all content unlocked
  const isActive = true; // All content is now accessible (payment integration on hold)

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
          { text: 'WhatsApp link for WhatsApp channel', link: dashboardData?.whatsapp_channel_url || 'https://wa.me/1234567890', external: true },
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
    const CardContent = () => (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
            ACTIVE
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
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline flex-1"
                >
                  {item.text}
                </a>
              ) : (
                <Link
                  to={item.link}
                  className="text-sm flex-1 text-blue-600 hover:text-blue-700 hover:underline"
                >
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
        className="bg-white border-2 rounded-lg shadow-sm transition-all duration-300 border-gray-200 hover:border-blue-400 hover:shadow-lg"
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
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
              ACTIVE
            </span>
            <span className="text-sm text-gray-600">
              All content is accessible (Payment integration on hold)
            </span>
          </div>
        </div>

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
