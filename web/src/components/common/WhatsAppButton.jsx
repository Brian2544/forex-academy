import { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const WhatsAppButton = () => {
  const { isAuthenticated } = useAuth();
  const [whatsappUrl, setWhatsappUrl] = useState(null);

  // Fetch WhatsApp URL from dashboard or settings
  const { data: dashboardData } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      try {
        const response = await api.get('/student/dashboard');
        return response.data.data;
      } catch (error) {
        return null;
      }
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (dashboardData?.whatsapp_channel_url) {
      setWhatsappUrl(dashboardData.whatsapp_channel_url);
    }
  }, [dashboardData]);

  if (!isAuthenticated || !whatsappUrl) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-[#25D366]/50 transition-all duration-300 group"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
          <span className="font-semibold hidden sm:block">Join Channel</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          />
        </a>
      </motion.div>
    </AnimatePresence>
  );
};

export default WhatsAppButton;

