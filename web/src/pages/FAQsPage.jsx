import { useState } from 'react';
import { PUBLIC_FAQS, TRUST_AND_SAFETY_TOPICS } from '../data/publicContent';

const FAQsPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-[#F5F7FF] mb-4">FAQs & Troubleshooting</h1>
            <p className="text-[#B6C2E2] text-lg">
              Practical answers for learning, account access, and responsible trading expectations.
            </p>
          </header>

          <section className="card">
            <h2 className="text-2xl font-semibold text-[#F5F7FF] mb-4">Common Questions</h2>
            <div className="space-y-3">
              {PUBLIC_FAQS.map((faq, index) => (
                <article key={faq.question} className="border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
                  <button
                    className="w-full text-left p-4 bg-[#0D1324] hover:bg-[#111a2f] transition-colors"
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  >
                    <span className="text-[#F5F7FF] font-medium">{faq.question}</span>
                  </button>
                  {openIndex === index && (
                    <div className="p-4 bg-[#0B1220] text-[#B6C2E2]">
                      {faq.answer}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-6">
            {TRUST_AND_SAFETY_TOPICS.map((topic) => (
              <article key={topic.title} className="card">
                <h3 className="text-lg font-semibold text-[#F5F7FF] mb-3">{topic.title}</h3>
                <ul className="space-y-2 text-[#B6C2E2] text-sm">
                  {topic.points.map((point) => (
                    <li key={point}>- {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
