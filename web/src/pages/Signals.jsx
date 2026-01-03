import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SignalCard from '../components/dashboard/SignalCard';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { getIcon } from '../utils/icons';

const Signals = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSignals();
  }, [filter]);

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      const { data } = await api.get('/signals', { params });
      setSignals(data.data.signals);
    } catch (error) {
      console.error('Error fetching signals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-accent-500/5 to-primary-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl font-bold text-white mb-4">
              Professional <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Trading Signals</span>
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Get real-time trading signals with comprehensive analysis from our expert traders. 
              Each signal includes entry, stop loss, take profit levels, and detailed reasoning.
            </p>
          </div>
        </div>

        {/* Signals Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { iconName: 'analysis', title: 'Real-Time Analysis', desc: 'Signals based on live market conditions and technical analysis' },
            { iconName: 'signal', title: 'Clear Entry/Exit', desc: 'Precise entry, stop loss, and take profit levels for every signal' },
            { iconName: 'chart', title: 'Risk Management', desc: 'Every signal includes proper risk-reward ratios and position sizing' }
          ].map((item, idx) => {
            const IconComponent = getIcon(item.iconName);
            return (
              <div key={idx} className="card text-center hover:border-accent-500 hover:shadow-xl transition-all">
                <div className="mb-4 flex justify-center">
                  {IconComponent && (
                    <IconComponent className="w-10 h-10 text-accent-600" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {['all', 'active', 'hit_tp', 'hit_sl'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-primary-500 text-dark-950'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              {status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        )}

        {!loading && signals.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No signals found</p>
          </div>
        )}

        <div className="mt-12 card bg-yellow-500/10 border-yellow-500/50">
          <p className="text-yellow-400 text-sm">
            <strong>Disclaimer:</strong> These signals are for educational purposes only. 
            Trading forex involves substantial risk of loss. Past performance is not indicative of future results.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signals;

