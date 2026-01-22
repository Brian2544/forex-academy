import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailPageLayout from '../../components/dashboard/DetailPageLayout';

const FAQs = () => {
  const { topic } = useParams();

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

  // If a specific topic is requested, show only that FAQ
  const filteredFAQs = topic 
    ? faqs.filter((faq, idx) => {
        const topicMap = {
          'myths': 0,
          'scam-awareness': 1,
          'risky': 2,
          'who-is-this-for': 3,
          'guarantee': 4,
          'results': 5
        };
        return idx === topicMap[topic];
      })
    : faqs;

  // Auto-open the FAQ if a specific topic is requested
  const initialOpenIndex = topic 
    ? faqs.findIndex((faq, idx) => {
        const topicMap = {
          'myths': 0,
          'scam-awareness': 1,
          'risky': 2,
          'who-is-this-for': 3,
          'guarantee': 4,
          'results': 5
        };
        return idx === topicMap[topic];
      })
    : null;

  const [openIndex, setOpenIndex] = useState(initialOpenIndex);

  return (
    <DetailPageLayout title={topic ? faqs[filteredFAQs[0]?.question]?.question || "FAQ" : "Frequently Asked Questions"} iconName="faq">
      <div className="space-y-6">
        {!topic && (
          <div>
            <p className="text-gray-300 mb-4">
              Find answers to the most common questions about forex trading, our academy, and what to expect.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => {
            const actualIndex = topic ? faqs.indexOf(faq) : index;
            return (
              <div key={actualIndex} className="bg-[#0B1220] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden hover:border-amber-500/50 transition-all">
                <button
                  onClick={() => setOpenIndex(openIndex === actualIndex ? null : actualIndex)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  <span className={`text-2xl flex-shrink-0 transition-transform text-amber-400 ${
                    openIndex === actualIndex ? 'rotate-180' : ''
                  }`}>
                    {openIndex === actualIndex ? '−' : '+'}
                  </span>
                </button>
                {openIndex === actualIndex && (
                  <div className="px-6 pb-6 bg-[rgba(255,255,255,0.03)]">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default FAQs;

