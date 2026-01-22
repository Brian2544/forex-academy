import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';
import { getIcon } from '../../utils/icons';

const LiveClasses = () => {
  const { data: liveSessions, isLoading } = useQuery({
    queryKey: ['live-classes'],
    queryFn: async () => {
      try {
        const response = await api.get('/student/live-classes');
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching live classes:', error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <DetailPageLayout title="Live Classes & Webinars" iconName="live">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  const sessions = liveSessions || [];
  const upcoming = sessions.filter(s => new Date(s.scheduled_at) > new Date());
  const past = sessions.filter(s => new Date(s.scheduled_at) <= new Date());
  const getStatus = (session) => {
    if (session.status) return session.status;
    if (!session.scheduled_at) return 'scheduled';
    return new Date(session.scheduled_at) > new Date() ? 'scheduled' : 'completed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <DetailPageLayout title="Live Classes & Webinars" iconName="live">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Schedule for Live Classes & Webinars</h2>
          <p className="text-gray-300 mb-4">
            Join interactive live trading sessions and webinars with our expert instructors.
          </p>
        </div>

        {upcoming.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Upcoming Sessions</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {upcoming.map((session) => (
                <div
                  key={session.id}
                  className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)] hover:border-amber-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(getStatus(session))}`}>
                      {getStatus(session).toUpperCase()}
                    </span>
                    {session.is_webinar && (
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
                        Webinar
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{session.title}</h3>
                  {session.description && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{session.description}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    {(() => {
                      const CalendarIcon = getIcon('calendar');
                      return (
                        <div className="flex items-center text-sm text-gray-300">
                          {CalendarIcon && <CalendarIcon className="w-4 h-4 mr-2 text-amber-500" />}
                          <span>
                            {format(new Date(session.scheduled_at), 'MMM dd, yyyy hh:mm a')}
                          </span>
                        </div>
                      );
                    })()}
                    {session.duration_minutes && (() => {
                      const ClockIcon = getIcon('clock');
                      return (
                        <div className="flex items-center text-sm text-gray-300">
                          {ClockIcon && <ClockIcon className="w-4 h-4 mr-2 text-amber-500" />}
                          <span>{session.duration_minutes} minutes</span>
                        </div>
                      );
                    })()}
                  </div>

                  {(session.meeting_link || session.meeting_url) && getStatus(session) !== 'completed' && (
                    <a
                      href={session.meeting_link || session.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-center font-medium transition-colors"
                    >
                      {getStatus(session) === 'live' ? 'Join Now' : 'Join Class'}
                    </a>
                  )}

                  {getStatus(session) === 'scheduled' && !(session.meeting_link || session.meeting_url) && (
                    <button className="w-full px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg cursor-not-allowed" disabled>
                      Coming Soon
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Past Sessions</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {past.map((session) => (
                <div
                  key={session.id}
                  className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)]"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{session.title}</h3>
                  {session.description && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{session.description}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    {format(new Date(session.scheduled_at), 'MMM dd, yyyy')}
                  </div>
                  {session.recording_url && (
                    <a
                      href={session.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2 border border-amber-500 text-amber-500 rounded-lg hover:bg-amber-500/10 text-center font-medium transition-colors"
                    >
                      Watch Recording
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <div className="bg-[#0B1220] rounded-lg p-12 border border-[rgba(255,255,255,0.08)] text-center">
            <div className="mb-4 flex justify-center">
              {(() => {
                const LiveIcon = getIcon('live');
                return LiveIcon ? (
                  <LiveIcon className="w-16 h-16 text-gray-500" />
                ) : null;
              })()}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Live Classes Scheduled</h3>
            <p className="text-gray-400 mb-4">
              Check back soon for upcoming live trading sessions and webinars.
            </p>
            <p className="text-gray-500 text-sm">
              New classes are added regularly throughout the week.
            </p>
          </div>
        )}
      </div>
    </DetailPageLayout>
  );
};

export default LiveClasses;
