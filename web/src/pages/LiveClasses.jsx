import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { format } from 'date-fns';
import { getIcon } from '../utils/icons';

const LiveClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await api.get('/live-classes');
      setClasses(data.data.liveClasses);
    } catch (error) {
      console.error('Error fetching live classes:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 via-primary-500/5 to-accent-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl font-bold text-white mb-4">
              Live Classes & <span className="bg-gradient-to-r from-accent-500 to-primary-500 bg-clip-text text-transparent">Webinars</span>
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Join interactive live trading sessions and webinars with our expert instructors. 
              Learn in real-time, ask questions, and get personalized feedback on your trading strategies.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { iconName: 'signal', title: 'Live Trading', desc: 'Watch real trades in action' },
            { iconName: 'communication', title: 'Q&A Sessions', desc: 'Get your questions answered' },
            { iconName: 'video', title: 'Recordings', desc: 'Access past sessions anytime' },
            { iconName: 'community', title: 'Community', desc: 'Learn with fellow traders' }
          ].map((item, idx) => {
            const IconComponent = getIcon(item.iconName);
            return (
              <div key={idx} className="card text-center">
                <div className="mb-3 flex justify-center">
                  {IconComponent && (
                    <IconComponent className="w-10 h-10 text-primary-500" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((liveClass) => (
              <div key={liveClass.id} className="card hover:border-accent-500 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(liveClass.status)}`}>
                    {liveClass.status.toUpperCase()}
                  </span>
                  {liveClass.isWebinar && (
                    <span className="px-3 py-1 bg-accent-500/20 text-accent-600 rounded-full text-xs font-medium">
                      Webinar
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {liveClass.title}
                </h3>

                {liveClass.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {liveClass.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  {(() => {
                    const CalendarIcon = getIcon('calendar');
                    return (
                      <div className="flex items-center text-sm text-gray-600">
                        {CalendarIcon && <CalendarIcon className="w-4 h-4 mr-2 text-accent-600" />}
                        <span>
                          {format(new Date(liveClass.scheduledDate), 'MMM dd, yyyy hh:mm a')}
                        </span>
                      </div>
                    );
                  })()}
                  {liveClass.duration && (() => {
                    const ClockIcon = getIcon('clock');
                    return (
                      <div className="flex items-center text-sm text-gray-600">
                        {ClockIcon && <ClockIcon className="w-4 h-4 mr-2 text-accent-600" />}
                        <span>{liveClass.duration} minutes</span>
                      </div>
                    );
                  })()}
                  {liveClass.instructor && (() => {
                    const UserIcon = getIcon('user');
                    return (
                      <div className="flex items-center text-sm text-gray-600">
                        {UserIcon && <UserIcon className="w-4 h-4 mr-2 text-accent-600" />}
                        <span>
                          {liveClass.instructor.firstName} {liveClass.instructor.lastName}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {liveClass.status === 'live' && liveClass.meetingLink && (
                  <a
                    href={liveClass.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full"
                  >
                    Join Now
                  </a>
                )}

                {liveClass.status === 'scheduled' && (
                  <button className="btn btn-outline w-full" disabled>
                    Coming Soon
                  </button>
                )}

                {liveClass.status === 'completed' && liveClass.recordingUrl && (
                  <a
                    href={liveClass.recordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline w-full"
                  >
                    Watch Recording
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && classes.length === 0 && (
          <div className="text-center py-20">
            <div className="card max-w-2xl mx-auto">
              <div className="mb-6 flex justify-center">
                {(() => {
                  const CalendarIcon = getIcon('calendar');
                  return CalendarIcon ? (
                    <CalendarIcon className="w-16 h-16 text-accent-600" />
                  ) : null;
                })()}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Live Classes Scheduled</h3>
              <p className="text-gray-600 mb-6">
                Check back soon for upcoming live trading sessions and webinars. 
                New classes are added regularly throughout the week.
              </p>
              <div className="bg-accent-500/10 border border-accent-500/50 rounded-lg p-6 text-left">
                <h4 className="text-accent-600 font-semibold mb-3">What to Expect:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Weekly live trading sessions covering different strategies</li>
                  <li>• Monthly webinars with guest expert traders</li>
                  <li>• Q&A sessions where you can ask our instructors anything</li>
                  <li>• Recordings available for members who miss live sessions</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default LiveClasses;

