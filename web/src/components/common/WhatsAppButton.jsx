import { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const whatsappChannelUrl = 'https://whatsapp.com/channel/0029ValiPPu4Y9llnKNIWW2I';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <a
            href={whatsappChannelUrl}
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
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;

