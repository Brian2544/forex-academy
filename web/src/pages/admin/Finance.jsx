import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { DollarSign, Download, Edit } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Finance = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-finance', statusFilter, providerFilter, startDate, endDate, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 50 });
      if (statusFilter) params.append('status', statusFilter);
      if (providerFilter) params.append('provider', providerFilter);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      const response = await api.get(`/admin/finance?${params}`);
      return response.data.data;
    }
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      const response = await api.get(`/admin/finance/export?${params}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    onSuccess: () => {
      toast.success('Export downloaded successfully');
    },
    onError: () => {
      toast.error('Failed to export payments');
    }
  });

  const finance = data || {};
  const payments = finance.payments || [];
  const totals = finance.totals || {};
  const pagination = finance.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F5F7FF]">Finance</h1>
          <p className="text-[#B6C2E2] mt-1">Manage payments and revenue</p>
        </div>
        <button
          onClick={() => exportMutation.mutate()}
          className="flex items-center gap-2 px-4 py-2 border border-[rgba(255,255,255,0.08)] rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[#B6C2E2]"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#0D1324] rounded-lg shadow-sm border border-[rgba(255,255,255,0.08)] p-6">
          <p className="text-sm text-[#B6C2E2]">Total Revenue</p>
          <p className="text-2xl font-bold text-[#F5F7FF] mt-2">${totals.total?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-[#0D1324] rounded-lg shadow-sm border border-[rgba(255,255,255,0.08)] p-6">
          <p className="text-sm text-[#B6C2E2]">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-2">${totals.completed?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-[#0D1324] rounded-lg shadow-sm border border-[rgba(255,255,255,0.08)] p-6">
          <p className="text-sm text-[#B6C2E2]">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">${totals.pending?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-[#0D1324] rounded-lg shadow-sm border border-[rgba(255,255,255,0.08)] p-6">
          <p className="text-sm text-[#B6C2E2]">Failed</p>
          <p className="text-2xl font-bold text-red-600 mt-2">${totals.failed?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#0D1324] rounded-lg shadow-sm border border-[rgba(255,255,255,0.08)] p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0A0E1A] text-[#F5F7FF]"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            value={providerFilter}
            onChange={(e) => {
              setProviderFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0A0E1A] text-[#F5F7FF]"
          >
            <option value="">All Providers</option>
            <option value="flutterwave">Flutterwave</option>
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="manual">Manual</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0A0E1A] text-[#F5F7FF]"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0A0E1A] text-[#F5F7FF]"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#0D1324] rounded-lg shadow-sm border border-[rgba(255,255,255,0.08)] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#121B33] border-b border-[rgba(255,255,255,0.08)]">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Student</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Amount</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Provider</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Date</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Reference</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-[#B6C2E2]">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.05)]">
                      <td className="py-4 px-6 text-sm text-[#F5F7FF]">
                        {payment.profile?.first_name} {payment.profile?.last_name}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-[#F5F7FF]">
                        ${parseFloat(payment.amount || 0).toFixed(2)} {payment.currency}
                      </td>
                      <td className="py-4 px-6 text-sm text-[#B6C2E2] capitalize">{payment.provider}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-[#B6C2E2]">
                        {format(new Date(payment.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="py-4 px-6 text-sm text-[#B6C2E2] font-mono">{payment.reference || 'N/A'}</td>
                      <td className="py-4 px-6">
                        {payment.status !== 'completed' && (
                          <button
                            onClick={() => {
                              const newStatus = prompt('Enter new status (completed, failed, refunded):');
                              if (newStatus && ['completed', 'failed', 'refunded'].includes(newStatus)) {
                                api.patch(`/admin/finance/payments/${payment.id}`, { status: newStatus })
                                  .then(() => {
                                    queryClient.invalidateQueries(['admin-finance']);
                                    toast.success('Payment updated');
                                  })
                                  .catch(() => toast.error('Failed to update payment'));
                              }
                            }}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Finance;

