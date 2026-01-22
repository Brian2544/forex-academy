import { useParams } from 'react-router-dom';
import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ChatGroupDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');

  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ['chat-group', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/chat/groups/${id}`);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching chat group:', error);
        return null;
      }
    },
    enabled: !!id,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['chat-messages', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/chat/groups/${id}/messages`);
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
    },
    enabled: !!id,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text) => {
      const response = await api.post(`/chat/groups/${id}/messages`, { content: text });
      return response.data;
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries(['chat-messages', id]);
      toast.success('Message sent');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send message');
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  if (groupLoading || messagesLoading) {
    return (
      <DetailPageLayout title="Discussion Forum" iconName="communication">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  if (!group) {
    return (
      <DetailPageLayout title="Discussion Forum" iconName="communication">
        <div className="bg-[#0B1220] rounded-lg p-12 border border-[rgba(255,255,255,0.08)] text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Group Not Found</h3>
          <p className="text-gray-400">The discussion group you're looking for doesn't exist.</p>
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout title={group.name || "Discussion Forum"} iconName="communication">
      <div className="space-y-6">
        {group.description && (
          <p className="text-gray-300">{group.description}</p>
        )}

        <div className="bg-[#0B1220] rounded-lg border border-[rgba(255,255,255,0.08)] flex flex-col" style={{ height: '600px' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-400 font-medium text-sm">
                      {msg.profile?.first_name || msg.user_name || 'Anonymous'}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {msg.created_at ? format(new Date(msg.created_at), 'MMM dd, hh:mm a') : ''}
                    </span>
                  </div>
                  <div className="bg-[#0F1A2E] rounded-lg p-3 inline-block max-w-3xl">
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-[rgba(255,255,255,0.08)] p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-[#0F1A2E] border border-[rgba(255,255,255,0.12)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={sendMessageMutation.isLoading}
              />
              <button
                type="submit"
                disabled={sendMessageMutation.isLoading || !message.trim()}
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendMessageMutation.isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default ChatGroupDetail;
