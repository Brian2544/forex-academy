import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { getIcon } from '../../utils/icons';

const AdvancedCourse = () => {
  return (
    <DetailPageLayout title="Advanced Course" iconName="advanced">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Master Professional Trading</h2>
          <p className="text-gray-300 mb-4">
            The Advanced Course is designed for serious traders who want to master professional trading methods.
            Learn advanced techniques used by institutional traders and develop your own sophisticated trading systems.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-3">What You'll Learn</h3>
          <ul className="space-y-2 text-gray-300">
            {(() => {
              const CheckIcon = getIcon('check');
              return [
                'Advanced chart patterns and price action analysis',
                'Algorithmic trading and automated systems',
                'Portfolio management and diversification',
                'Advanced risk management and hedging strategies',
                'Market microstructure and order flow analysis',
                'Building and scaling a trading business'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  {CheckIcon && <CheckIcon className="w-5 h-5 text-gold-500 mr-2 flex-shrink-0 mt-0.5" />}
                  <span>{item}</span>
                </li>
              ));
            })()}
          </ul>
        </div>

        <div className="bg-dark-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Who Should Take This Course</h3>
          <p className="text-gray-300">
            This course is ideal for traders who have completed the Intermediate Course and want to take their trading
            to a professional level. You should have significant trading experience and be ready to commit to advanced
            learning and practice.
          </p>
        </div>

        <div className="flex gap-4">
          <button className="btn-primary">Start Course</button>
          <button className="btn-secondary">View Curriculum</button>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default AdvancedCourse;

