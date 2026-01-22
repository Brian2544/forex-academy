import { useSearchParams } from 'react-router-dom';
import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';

const MarketAnalysis = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'daily';

  const { data: analysisData, isLoading } = useQuery({
    queryKey: ['market-analysis', type],
    queryFn: async () => {
      try {
        const response = await api.get('/student/market-analysis', {
          params: { type }
        });
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching market analysis:', error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <DetailPageLayout title="Market Analysis" iconName="analysis">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  const analysis = analysisData || [];

  return (
    <DetailPageLayout title="Market Analysis" iconName="analysis">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {type === 'daily' ? 'Daily Market Analysis' : type === 'weekly' ? 'Weekly Market Analysis' : 'Economic Calendar'}
          </h2>
          <p className="text-gray-300 mb-4">
            {type === 'daily' 
              ? 'Get daily market insights, key levels, and trading opportunities for major currency pairs.'
              : type === 'weekly'
              ? 'Comprehensive weekly market overview with trends and forecasts.'
              : 'Track important economic events, announcements, and their potential impact on the markets.'}
          </p>
        </div>

        {type === 'daily' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)]">
              <h3 className="text-xl font-semibold text-white mb-3">Today's Key Levels</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Major currency pair analysis</li>
                <li>• Support and resistance levels</li>
                <li>• Trading opportunities and setups</li>
                <li>• Risk assessment</li>
              </ul>
            </div>
            <div className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)]">
              <h3 className="text-xl font-semibold text-white mb-3">Market Outlook</h3>
              <p className="text-gray-300 text-sm">
                Current market conditions and sentiment analysis for major pairs.
              </p>
            </div>
          </div>
        )}

        {type === 'weekly' && (
          <div className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)]">
            <h3 className="text-xl font-semibold text-white mb-3">Weekly Market Trends</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Weekly market trends</li>
              <li>• Economic events impact</li>
              <li>• Long-term outlook</li>
              <li>• Strategy recommendations</li>
            </ul>
          </div>
        )}

        {type === 'weekly' && (
          <div className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)]">
            <h3 className="text-xl font-semibold text-white mb-3">Economic Calendar</h3>
            <p className="text-gray-300 mb-4">
              Track important economic events, announcements, and their potential impact on the markets.
            </p>
            {analysis.length > 0 ? (
              <div className="space-y-3">
                {analysis.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-[#0F1A2E] rounded border border-[rgba(255,255,255,0.05)]">
                    <div>
                      <p className="text-white font-medium">{item.title || item.event_name}</p>
                      <p className="text-gray-400 text-sm">
                        {item.published_date ? format(new Date(item.published_date), 'MMM dd, yyyy hh:mm a') : 'TBD'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm ${
                      item.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                      item.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.impact ? item.impact.toUpperCase() : 'MEDIUM'} Impact
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No economic events scheduled. Check back later.</p>
              </div>
            )}
          </div>
        )}

        {analysis.length > 0 && type !== 'weekly' && (
          <div className="space-y-4">
            {analysis.map((item, idx) => (
              <div key={idx} className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)]">
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                {item.content && (
                  <p className="text-gray-300 mb-4">{item.content}</p>
                )}
                {item.published_date && (
                  <p className="text-gray-400 text-sm">
                    Published: {format(new Date(item.published_date), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {analysis.length === 0 && type !== 'weekly' && (
          <div className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)] text-center">
            <p className="text-gray-400">No analysis available yet. Check back soon for updates.</p>
          </div>
        )}
      </div>
    </DetailPageLayout>
  );
};

export default MarketAnalysis;
