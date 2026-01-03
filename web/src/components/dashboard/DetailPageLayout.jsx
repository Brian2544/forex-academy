import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import WhatsAppButton from '../common/WhatsAppButton';
import { getIcon } from '../../utils/icons';

const DetailPageLayout = ({ title, icon, iconName, children, backLink = '/dashboard' }) => {
  const IconComponent = iconName ? getIcon(iconName) : null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={backLink}
            className="inline-flex items-center text-secondary-600 hover:text-secondary-700 mb-4 transition-colors group link-secondary"
          >
            {(() => {
              const ArrowIcon = getIcon('arrow-left');
              return ArrowIcon ? (
                <ArrowIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              ) : (
                <span className="mr-2">←</span>
              );
            })()}
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg gradient-brand flex items-center justify-center shadow-lg shadow-primary-500/30 hover:scale-110 transition-transform duration-300">
              {IconComponent ? (
                <IconComponent className="w-8 h-8 text-white" />
              ) : (
                <span className="text-4xl">{icon}</span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-neutral-900">{title}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="card-dark">
          {children}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default DetailPageLayout;

