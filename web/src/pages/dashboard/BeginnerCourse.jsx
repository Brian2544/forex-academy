import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { getIcon } from '../../utils/icons';

const BeginnerCourse = () => {
  return (
    <DetailPageLayout title="Beginner Course" iconName="beginner">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Professional Forex Trading Fundamentals</h2>
          <p className="text-gray-300 mb-4">
            This comprehensive program is designed for professionals and serious traders who are new to forex trading.
            You'll master the fundamentals and build a solid foundation for your trading career with industry-standard practices.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-3">What You'll Learn</h3>
          <ul className="space-y-2 text-gray-300">
            {(() => {
              const CheckIcon = getIcon('check');
              return [
                'Understanding the forex market and how it works',
                'Currency pairs and how to read them',
                'Basic trading terminology and concepts',
                'How to use trading platforms',
                'Risk management basics',
                'Your first trades and practice strategies'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  {CheckIcon && <CheckIcon className="w-5 h-5 text-gold-500 mr-2 flex-shrink-0 mt-0.5" />}
                  <span>{item}</span>
                </li>
              ));
            })()}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-primary-500/30 rounded-lg p-6 hover:border-accent-500/70 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-500/20 to-transparent rounded-bl-full"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-white mb-3">Course Structure</h3>
            <div className="space-y-4">
              {[
                { title: 'Module 1: Introduction to Forex', desc: 'Learn what forex trading is and why it matters' },
                { title: 'Module 2: Market Basics', desc: 'Understand currency pairs, pips, and spreads' },
                { title: 'Module 3: Trading Platforms', desc: 'Get familiar with MetaTrader and other platforms' },
                { title: 'Module 4: Your First Trade', desc: 'Practice with demo accounts and real examples' }
              ].map((module, idx) => (
                <div key={idx} className="border-l-4 border-accent-500 pl-4">
                  <h4 className={`font-medium mb-2 ${
                    idx % 2 === 0 ? 'text-primary-400' : 'text-accent-400'
                  }`}>{module.title}</h4>
                  <p className="text-gray-300 text-sm">{module.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="btn-primary">Start Course</button>
          <button className="btn-secondary">View Curriculum</button>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default BeginnerCourse;

