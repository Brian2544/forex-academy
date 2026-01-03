import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { Link } from 'react-router-dom';
import { getIcon } from '../../utils/icons';

const Legal = () => {
  return (
    <DetailPageLayout title="Legal & Disclaimer" iconName="legal">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Legal Information</h2>
          <p className="text-gray-300 mb-4">
            Important legal documents, disclaimers, and policies you should be aware of.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-dark-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Risk Disclaimer</h3>
            <p className="text-gray-300 mb-4">
              Trading forex involves substantial risk of loss and is not suitable for all investors.
              Past performance is not indicative of future results.
            </p>
            <Link to="/legal/disclaimer" className="text-gold-500 hover:text-gold-400 font-medium">
              Read Full Disclaimer →
            </Link>
          </div>

          <div className="bg-dark-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Terms and Conditions</h3>
            <p className="text-gray-300 mb-4">
              Our terms of service outline the rules and regulations for using our platform and services.
            </p>
            <Link to="/legal/terms" className="text-gold-500 hover:text-gold-400 font-medium">
              Read Terms & Conditions →
            </Link>
          </div>

          <div className="bg-dark-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Privacy Policy</h3>
            <p className="text-gray-300 mb-4">
              Learn how we collect, use, and protect your personal information.
            </p>
            <Link to="/legal/privacy" className="text-gold-500 hover:text-gold-400 font-medium">
              Read Privacy Policy →
            </Link>
          </div>

          <div className="bg-dark-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Important Notice</h3>
            <p className="text-gray-300 mb-4">
              <strong className="text-white">We do not guarantee profits.</strong> Trading involves risk,
              and you may lose your investment. Only trade with money you can afford to lose.
            </p>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-red-400 mb-3 flex items-center gap-2">
            {(() => {
              const WarningIcon = getIcon('warning');
              return WarningIcon ? (
                <WarningIcon className="w-5 h-5" />
              ) : null;
            })()}
            Risk Warning
          </h3>
          <p className="text-gray-300">
            Trading foreign exchange on margin carries a high level of risk and may not be suitable for all investors.
            The high degree of leverage can work against you as well as for you. Before deciding to trade foreign
            exchange or any other financial instrument, you should carefully consider your investment objectives,
            level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or
            all of your initial investment and therefore you should not invest money that you cannot afford to lose.
          </p>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default Legal;

