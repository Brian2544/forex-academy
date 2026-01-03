import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Forex Myths & Common Mistakes',
      answer: 'Many people believe forex trading is a get-rich-quick scheme. This is a myth. Successful trading requires education, practice, and discipline. Common mistakes include overtrading, not using stop losses, trading without a plan, and letting emotions drive decisions.'
    },
    {
      question: 'Scam Awareness in Forex',
      answer: 'Be cautious of promises of guaranteed profits, unregulated brokers, and schemes that sound too good to be true. Always verify broker credentials, check regulatory status, and never invest more than you can afford to lose. Our academy only recommends regulated and reputable brokers.'
    },
    {
      question: 'Is Forex Risky?',
      answer: 'Yes, forex trading involves significant risk. The market is volatile and you can lose your entire investment. However, with proper education, risk management, and discipline, you can learn to manage these risks effectively. Never trade with money you cannot afford to lose.'
    },
    {
      question: 'Who is This For?',
      answer: 'This academy is for anyone serious about learning forex trading, from complete beginners to experienced traders looking to improve. Whether you want to trade part-time or build a trading career, our courses are designed to help you achieve your goals.'
    },
    {
      question: 'Do You Guarantee Profits?',
      answer: 'No, we do not guarantee profits. No legitimate trading education provider can guarantee profits. Trading involves risk, and results vary based on individual effort, market conditions, and many other factors. We provide education and tools, but success depends on your application and market conditions.'
    },
    {
      question: 'How Long Before I See Results?',
      answer: 'Results vary significantly. Some traders see progress in weeks, while others take months or years. Success depends on your dedication, practice, market conditions, and ability to apply what you learn. Consistent practice with a demo account is essential before trading with real money.'
    }
  ];

  return (
    <DetailPageLayout title="Frequently Asked Questions" iconName="faq">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Common Questions About Forex Trading</h2>
          <p className="text-gray-300 mb-4">
            Find answers to the most common questions about forex trading, our academy, and what to expect.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-primary-500/30 rounded-lg overflow-hidden hover:border-accent-500/70 transition-all">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-primary-500/10 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                <span className={`text-2xl flex-shrink-0 transition-transform ${
                  openIndex === index ? 'text-accent-500 rotate-180' : 'text-primary-500'
                }`}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 bg-accent-500/5">
                  <p className="text-gray-200 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-dark-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Still Have Questions?</h3>
          <p className="text-gray-300 mb-4">
            Can't find the answer you're looking for? Contact our support team through the Communication Hub
            or use the Contact & Support section.
          </p>
          <Link to="/dashboard/communication" className="text-gold-500 hover:text-gold-400 font-medium">
            Go to Communication Hub →
          </Link>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default FAQs;

