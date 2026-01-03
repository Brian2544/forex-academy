import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { getIcon } from '../../utils/icons';

const IntermediateCourse = () => {
  return (
    <DetailPageLayout title="Intermediate Course" iconName="intermediate">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Advance Your Trading Skills</h2>
          <p className="text-gray-300 mb-4">
            Ready to take your trading to the next level? The Intermediate Course builds on your foundational knowledge
            and introduces you to more sophisticated trading strategies and analysis techniques.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-3">What You'll Learn</h3>
          <ul className="space-y-2 text-gray-300">
            {(() => {
              const CheckIcon = getIcon('check');
              return [
                'Advanced technical analysis techniques',
                'Fundamental analysis and economic indicators',
                'Multiple trading strategies and when to use them',
                'Risk management and position sizing',
                'Psychology of trading and emotional control',
                'Building and testing your trading plan'
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
          <h3 className="text-xl font-semibold text-white mb-3">Prerequisites</h3>
          <p className="text-gray-300 mb-4">
            Before starting this course, you should have completed the Beginner Course or have equivalent knowledge
            of basic forex trading concepts.
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

export default IntermediateCourse;

