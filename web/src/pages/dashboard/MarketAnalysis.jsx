import DetailPageLayout from '../../components/dashboard/DetailPageLayout';

const MarketAnalysis = () => {
  return (
    <DetailPageLayout title="Market Analysis" iconName="analysis">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Daily & Weekly Market Analysis</h2>
          <p className="text-gray-300 mb-4">
            Stay updated with comprehensive market analysis, economic calendar, and trading opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-dark-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Daily Analysis</h3>
            <p className="text-gray-300 mb-4">
              Get daily market insights, key levels, and trading opportunities for major currency pairs.
            </p>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Major currency pair analysis</li>
              <li>• Support and resistance levels</li>
              <li>• Trading opportunities and setups</li>
              <li>• Risk assessment</li>
            </ul>
          </div>

          <div className="bg-dark-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Weekly Analysis</h3>
            <p className="text-gray-300 mb-4">
              Comprehensive weekly market overview with trends and forecasts.
            </p>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Weekly market trends</li>
              <li>• Economic events impact</li>
              <li>• Long-term outlook</li>
              <li>• Strategy recommendations</li>
            </ul>
          </div>
        </div>

        <div className="bg-dark-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Economic Calendar</h3>
          <p className="text-gray-300 mb-4">
            Track important economic events, announcements, and their potential impact on the markets.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-dark-800 rounded">
              <div>
                <p className="text-white font-medium">US Non-Farm Payrolls</p>
                <p className="text-gray-400 text-sm">Jan 5, 2024 - 8:30 AM EST</p>
              </div>
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm">High Impact</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-dark-800 rounded">
              <div>
                <p className="text-white font-medium">ECB Interest Rate Decision</p>
                <p className="text-gray-400 text-sm">Jan 10, 2024 - 8:00 AM EST</p>
              </div>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">Medium Impact</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="btn-primary">View Daily Analysis</button>
          <button className="btn-secondary">View Economic Calendar</button>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default MarketAnalysis;

