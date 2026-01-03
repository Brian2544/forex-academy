import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Terms and Conditions</h1>
        
        <div className="card space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using Forex Trading Academy, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not 
              use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Educational Purpose</h2>
            <p className="text-gray-300 leading-relaxed">
              All content provided on this platform is for educational purposes only. We do not provide 
              financial advice, and any trading decisions you make are your sole responsibility.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Risk Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed">
              Trading forex involves substantial risk of loss and is not suitable for all investors. 
              Past performance is not indicative of future results. You should only trade with money 
              you can afford to lose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Subscription and Payments</h2>
            <p className="text-gray-300 leading-relaxed">
              Subscriptions are billed according to the plan you select. All payments are non-refundable 
              unless otherwise stated. You may cancel your subscription at any time, but you will continue 
              to have access until the end of your billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. User Accounts</h2>
            <p className="text-gray-300 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password. You agree 
              to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              All content on this platform, including courses, videos, and materials, is the property of 
              Forex Trading Academy and is protected by copyright laws. You may not reproduce, distribute, 
              or create derivative works without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              Forex Trading Academy shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these terms at any time. Your continued use of the service 
              after any changes constitutes acceptance of the new terms.
            </p>
          </section>

          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-400 text-sm">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;

