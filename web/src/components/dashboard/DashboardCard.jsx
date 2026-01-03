import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/icons';

const DashboardCard = ({ title, description, icon, iconName, link, status, statusColor = 'green' }) => {
  // Support both old icon (emoji) and new iconName (Heroicon)
  const IconComponent = iconName ? getIcon(iconName) : null;
  const statusColors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={link}
        className="block h-full"
      >
        <div className="card h-full cursor-pointer hover:border-primary-300 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg gradient-brand flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md shadow-primary-500/30`}>
              {IconComponent ? (
                <IconComponent className="w-6 h-6 text-white" />
              ) : (
                <span className="text-2xl">{icon}</span>
              )}
            </div>
            {status && (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  statusColor === 'green' ? 'bg-secondary-500' :
                  statusColor === 'yellow' ? 'bg-warning-500' :
                  statusColor === 'red' ? 'bg-danger-500' :
                  'bg-primary-500'
                } animate-pulse`}></div>
                <span className="text-xs text-neutral-600 uppercase font-medium">{status}</span>
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-neutral-600 text-sm line-clamp-2">
            {description}
          </p>
          
          <div className="mt-4 flex items-center text-secondary-600 text-sm font-medium group-hover:gap-2 transition-all link-secondary">
            <span>Explore</span>
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
  );
};

export default DashboardCard;

