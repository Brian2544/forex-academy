import { useState } from 'react';
import { getIcon } from '../../utils/icons';

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
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-400 mb-8">
            Find answers to the most common questions about forex trading, our academy, and what to expect.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-amber-500/50 transition-all">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-700/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-slate-100 pr-4">{faq.question}</h3>
                  <span className={`text-2xl flex-shrink-0 transition-transform text-amber-400 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}>
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 bg-slate-700/30">
                    <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQs;

