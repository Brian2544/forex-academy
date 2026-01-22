import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';
import { getIcon } from '../../utils/icons';

const ChatGroups = () => {
  const { data: groups, isLoading } = useQuery({
    queryKey: ['chat-groups'],
    queryFn: async () => {
      try {
        const response = await api.get('/chat/groups');
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching chat groups:', error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <DetailPageLayout title="Discussion Forums" iconName="communication">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  const groupsList = groups || [];

  return (
    <DetailPageLayout title="Discussion Forums & Q&A" iconName="communication">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Member-Only Discussion Forums</h2>
          <p className="text-gray-300 mb-4">
            Connect with fellow traders, ask questions, share experiences, and learn from each other in our exclusive forums.
          </p>
        </div>

        {groupsList.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {groupsList.map((group) => (
              <Link
                key={group.id}
                to={`/chat/groups/${group.id}`}
                className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)] hover:border-amber-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{group.name}</h3>
                  {(() => {
                    const GroupIcon = getIcon('group');
                    return GroupIcon ? (
                      <GroupIcon className="w-6 h-6 text-amber-500 flex-shrink-0" />
                    ) : null;
                  })()}
                </div>
                {group.description && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{group.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{group.member_count || 0} members</span>
                  {group.last_message_at && (
                    <span>Last activity: {new Date(group.last_message_at).toLocaleDateString()}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#0B1220] rounded-lg p-12 border border-[rgba(255,255,255,0.08)] text-center">
            <div className="mb-4 flex justify-center">
              {(() => {
                const GroupIcon = getIcon('group');
                return GroupIcon ? (
                  <GroupIcon className="w-16 h-16 text-gray-500" />
                ) : null;
              })()}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Discussion Groups Yet</h3>
            <p className="text-gray-400">
              Discussion forums will be available soon. Check back later to connect with other traders.
            </p>
          </div>
        )}
      </div>
    </DetailPageLayout>
  );
};

export default ChatGroups;
