import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import WhatsAppButton from '../components/common/WhatsAppButton';
import { traineeSections } from '../data/traineeSections';
import { getIcon } from '../utils/icons';

const Trainees = () => {
  const iconMap = {
    'learning-training': 'course',
    'market-analysis': 'analysis',
    'faqs': 'faq',
    'communication-box': 'communication',
    'blog': 'blog',
    'legal-disclaimer': 'legal',
    'contact-support': 'contact',
    'referral-system': 'referral',
    'live-classes-webinars': 'live',
    'testimonials-success-stories': 'testimonial',
    'profile': 'profile'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header Section */}
        <div className="mb-12 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/5 to-primary-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl font-bold text-neutral-900 mb-4">
              <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent animate-pulse">Professionals</span> <span className="text-neutral-900">Portal</span>
            </h1>
            <p className="text-neutral-700 text-lg max-w-2xl mx-auto">
              Access all your professional development resources, market analysis, support, and more in one place
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {traineeSections.map((section, index) => (
            <motion.div
              key={section.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/trainees/${section.slug}`}
                className="block h-full"
              >
                <div className="card h-full cursor-pointer hover:border-primary-300 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg gradient-brand flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md shadow-primary-500/30">
                      {(() => {
                        const iconName = iconMap[section.slug] || 'document';
                        const IconComponent = getIcon(iconName);
                        return IconComponent ? (
                          <IconComponent className="w-6 h-6 text-white" />
                        ) : null;
                      })()}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {section.title}
                  </h3>
                  
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                    {section.shortDescription}
                  </p>
                  
                  <div className="mt-auto flex items-center text-secondary-600 text-sm font-medium group-hover:gap-2 transition-all link-secondary">
                    <span>View details</span>
                    {(() => {
                      const ArrowIcon = getIcon('arrow-right');
                      return ArrowIcon ? (
                        <ArrowIcon className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                      ) : (
                        <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                      );
                    })()}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Trainees;

