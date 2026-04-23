const EducationalPurpose = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Educational Purpose Notice</h1>

        <div className="card space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Education-First Platform</h2>
            <p className="text-gray-300 leading-relaxed">
              Sniper FX Academy is built for trading education. Content, examples, and market discussions are
              intended for learning and skill development only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Not Financial Advice</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not provide investment recommendations or personalized financial advice. Users should make
              independent decisions and consult licensed professionals where necessary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Responsible Trading Expectations</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Prioritize risk management and capital preservation.</li>
              <li>Use demo practice before live trading.</li>
              <li>Avoid unrealistic return expectations.</li>
              <li>Trade only funds you can afford to risk.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EducationalPurpose;
