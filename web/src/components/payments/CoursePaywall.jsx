import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const CoursePaywall = ({ course, priceLabel, onPay, isProcessing }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl w-full bg-[#0D1324] border border-white/10 rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-400">
            <Lock className="w-6 h-6" />
          </span>
          <div>
            <p className="text-sm uppercase tracking-wide text-red-300">Locked content</p>
            <h1 className="text-2xl font-bold text-white">{course?.title || 'Course Access'}</h1>
          </div>
        </div>

        <p className="text-gray-300 mb-6">
          Complete your payment to unlock this course and start learning immediately. Your access is activated
          automatically after verification.
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-400">Course price</p>
            <p className="text-2xl font-semibold text-white">{priceLabel}</p>
          </div>
          <div className="text-sm text-gray-400">
            Secure payments powered by Paystack
          </div>
        </div>

        <button
          onClick={onPay}
          disabled={isProcessing}
          className="w-full md:w-auto px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60"
        >
          {isProcessing ? 'Redirecting...' : 'Pay Now'}
        </button>
      </motion.div>
    </div>
  );
};

export default CoursePaywall;
