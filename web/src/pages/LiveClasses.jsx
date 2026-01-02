import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { format } from 'date-fns';

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
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Live Classes & Webinars</h1>
          <p className="text-gray-400 text-lg">
            Join interactive sessions with expert traders
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((liveClass) => (
              <div key={liveClass.id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(liveClass.status)}`}>
                    {liveClass.status.toUpperCase()}
                  </span>
                  {liveClass.isWebinar && (
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
                      Webinar
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {liveClass.title}
                </h3>

                {liveClass.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {liveClass.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="mr-2">📅</span>
                    <span>
                      {format(new Date(liveClass.scheduledDate), 'MMM dd, yyyy hh:mm a')}
                    </span>
                  </div>
                  {liveClass.duration && (
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">⏱️</span>
                      <span>{liveClass.duration} minutes</span>
                    </div>
                  )}
                  {liveClass.instructor && (
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">👤</span>
                      <span>
                        {liveClass.instructor.firstName} {liveClass.instructor.lastName}
                      </span>
                    </div>
                  )}
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
            <p className="text-gray-400 text-lg">No live classes scheduled</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default LiveClasses;

