import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Search, Trash2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ChatMonitor = () => {
  const queryClient = useQueryClient();
  const [groupFilter, setGroupFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-chat', groupFilter, startDate, endDate, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 50 });
      if (groupFilter) params.append('group_id', groupFilter);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      const response = await api.get(`/admin/chat-monitor?${params}`);
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/admin/chat-monitor/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-chat']);
      toast.success('Message deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete message');
    }
  });

  const messages = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chat Monitor</h1>
        <p className="text-gray-600 mt-1">Monitor and moderate group chat messages</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Group ID (optional)"
            value={groupFilter}
            onChange={(e) => {
              setGroupFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No messages found</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-gray-900">
                          {message.sender?.first_name} {message.sender?.last_name}
                        </p>
                        <span className="text-sm text-gray-500">
                          {message.group?.name ? `in ${message.group.name}` : 'Direct message'}
                        </span>
                        <span className="text-sm text-gray-400">
                          {format(new Date(message.created_at), 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this message?')) {
                          deleteMutation.mutate(message.id);
                        }
                      }}
                      className="ml-4 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMonitor;

