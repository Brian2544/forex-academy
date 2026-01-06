import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Plus, TrendingUp, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Signals = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [marketFilter, setMarketFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-signals', statusFilter, marketFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.append('status', statusFilter);
      if (marketFilter) params.append('market', marketFilter);
      const response = await api.get(`/admin/signals?${params}`);
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/admin/signals/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-signals']);
      toast.success('Signal deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete signal');
    }
  });

  const signals = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trading Signals</h1>
          <p className="text-gray-600 mt-1">Create and manage trading signals</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600"
        >
          <Plus className="w-5 h-5" />
          Create Signal
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="closed">Closed</option>
          </select>
          <input
            type="text"
            placeholder="Filter by market (e.g., EUR/USD)"
            value={marketFilter}
            onChange={(e) => {
              setMarketFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Signals Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Market</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Direction</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Entry</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Created</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {signals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      No signals found
                    </td>
                  </tr>
                ) : (
                  signals.map((signal) => (
                    <tr key={signal.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm text-gray-900">{signal.title}</td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{signal.market}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          {signal.direction === 'buy' ? (
                            <ArrowUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${signal.direction === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                            {signal.direction.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {signal.entry_price ? signal.entry_price.toFixed(5) : 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            signal.status === 'active' ? 'bg-green-100 text-green-800' :
                            signal.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {signal.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {format(new Date(signal.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this signal?')) {
                              deleteMutation.mutate(signal.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateSignalModal
          onClose={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries(['admin-signals']);
          }}
        />
      )}
    </div>
  );
};

const CreateSignalModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [market, setMarket] = useState('');
  const [direction, setDirection] = useState('buy');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/admin/signals', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-signals']);
      toast.success('Signal created successfully');
      onClose();
    },
    onError: () => {
      toast.error('Failed to create signal');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      market,
      direction,
      entry_price: entryPrice ? parseFloat(entryPrice) : undefined,
      stop_loss: stopLoss ? parseFloat(stopLoss) : undefined,
      take_profit: takeProfit ? parseFloat(takeProfit) : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create Trading Signal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Market *</label>
            <input
              type="text"
              required
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              placeholder="EUR/USD"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Direction *</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entry</label>
              <input
                type="number"
                step="0.00001"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stop Loss</label>
              <input
                type="number"
                step="0.00001"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Take Profit</label>
              <input
                type="number"
                step="0.00001"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 disabled:opacity-50"
            >
              {createMutation.isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signals;

