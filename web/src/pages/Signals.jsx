import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SignalCard from '../components/dashboard/SignalCard';
import Loader from '../components/common/Loader';
import api from '../services/api';

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
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Trading Signals</h1>
          <p className="text-gray-400 text-lg">
            Real-time trading signals with detailed analysis
          </p>
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

