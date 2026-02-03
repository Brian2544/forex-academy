import { getIcon } from '../../utils/icons';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Risk Disclaimer</h1>
        
        <div className="card space-y-6">
          <div className="p-6 bg-red-500/10 border-2 border-red-500/50 rounded-lg">
            <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
              {(() => {
                const WarningIcon = getIcon('warning');
                return WarningIcon ? (
                  <WarningIcon className="w-6 h-6" />
                ) : null;
              })()}
              IMPORTANT RISK WARNING
            </h2>
            <p className="text-red-300 leading-relaxed text-lg">
              Trading foreign exchange on margin carries a high level of risk and may not be suitable 
              for all investors. The high degree of leverage can work against you as well as for you. 
              Before deciding to trade foreign exchange or any other financial instrument, you should 
              carefully consider your investment objectives, level of experience, and risk appetite.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. No Financial Advice</h2>
            <p className="text-gray-300 leading-relaxed">
              The information provided on this platform, including trading signals, courses, and educational 
              content, is for educational purposes only and does not constitute financial, investment, or 
              trading advice. We do not provide personalized recommendations or advice regarding specific 
              trading decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. No Guarantee of Profits</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong>WE DO NOT GUARANTEE PROFITS.</strong> Trading forex involves substantial risk of loss. 
              Past performance is not indicative of future results. You may lose some or all of your invested 
              capital. Only trade with money you can afford to lose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Trading Signals Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed">
              Trading signals provided on this platform are for educational purposes only. They are not 
              recommendations to buy or sell. We are not responsible for any losses incurred from following 
              these signals. Always conduct your own research and analysis before making any trading decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Market Risks</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Forex trading involves various risks, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Market volatility and price fluctuations</li>
              <li>Leverage risk (amplified losses)</li>
              <li>Liquidity risk</li>
              <li>Counterparty risk</li>
              <li>Regulatory and political risks</li>
              <li>Technical failures and system errors</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Testimonials and Results</h2>
            <p className="text-gray-300 leading-relaxed">
              Testimonials and success stories featured on this platform are individual experiences and 
              may not be typical. Results may vary. We do not guarantee that you will achieve similar 
              results. Past performance is not indicative of future results.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Educational Purpose Only</h2>
            <p className="text-gray-300 leading-relaxed">
              All courses, materials, and content on this platform are designed for educational purposes 
              only. They are not intended to be a substitute for professional financial advice. You should 
              consult with a qualified financial advisor before making any investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Your Responsibility</h2>
            <p className="text-gray-300 leading-relaxed">
              You are solely responsible for your trading decisions and any resulting profits or losses. 
              We are not liable for any financial losses you may incur as a result of using our platform, 
              courses, or signals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Regulatory Compliance</h2>
            <p className="text-gray-300 leading-relaxed">
              Trading forex may be subject to regulations in your jurisdiction. It is your responsibility 
              to ensure that you comply with all applicable laws and regulations in your country of residence.
            </p>
          </section>

          <div className="mt-8 p-6 bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg">
            <p className="text-yellow-400 font-semibold mb-2">
              By using this platform, you acknowledge that you have read, understood, and agree to this 
              Risk Disclaimer.
            </p>
            <p className="text-yellow-400 text-sm">
              If you do not agree with any part of this disclaimer, please do not use our services.
            </p>
          </div>

          <div className="mt-4 p-4 bg-gray-500/10 border border-gray-500/50 rounded-lg">
            <p className="text-gray-400 text-sm">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Disclaimer;

