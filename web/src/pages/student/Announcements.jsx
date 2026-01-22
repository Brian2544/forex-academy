import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';
import { getIcon } from '../../utils/icons';

const Announcements = () => {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      try {
        const response = await api.get('/student/announcements');
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching announcements:', error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <DetailPageLayout title="Announcements & Updates" iconName="announcement">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  const announcementsList = announcements || [];

  return (
    <DetailPageLayout title="Announcements & Updates" iconName="announcement">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Latest Announcements</h2>
          <p className="text-gray-300 mb-4">
            Stay updated with the latest news, updates, and important information from the academy.
          </p>
        </div>

        {announcementsList.length > 0 ? (
          <div className="space-y-4">
            {announcementsList.map((announcement) => (
              <div
                key={announcement.id}
                className={`bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)] ${
                  announcement.is_pinned ? 'border-amber-500/50 bg-amber-500/5' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {announcement.is_pinned && (
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                        PINNED
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-white">{announcement.title}</h3>
                  </div>
                  {announcement.created_at && (
                    <span className="text-gray-400 text-sm whitespace-nowrap">
                      {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                    </span>
                  )}
                </div>
                {announcement.content && (
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0B1220] rounded-lg p-12 border border-[rgba(255,255,255,0.08)] text-center">
            <div className="mb-4 flex justify-center">
              {(() => {
                const AnnouncementIcon = getIcon('announcement');
                return AnnouncementIcon ? (
                  <AnnouncementIcon className="w-16 h-16 text-gray-500" />
                ) : null;
              })()}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Announcements Yet</h3>
            <p className="text-gray-400">
              Check back soon for updates and important information from the academy.
            </p>
          </div>
        )}
      </div>
    </DetailPageLayout>
  );
};

export default Announcements;
