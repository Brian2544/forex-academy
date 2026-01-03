import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { getIcon } from '../../utils/icons';

const LiveClasses = () => {
  const upcomingClasses = [
    {
      title: 'Advanced Risk Management Strategies',
      date: 'Jan 10, 2024',
      time: '2:00 PM EST',
      duration: '90 minutes',
      instructor: 'John Smith',
      type: 'Webinar'
    },
    {
      title: 'Technical Analysis Masterclass',
      date: 'Jan 15, 2024',
      time: '10:00 AM EST',
      duration: '2 hours',
      instructor: 'Sarah Johnson',
      type: 'Live Class'
    },
    {
      title: 'Market Psychology & Emotional Control',
      date: 'Jan 20, 2024',
      time: '3:00 PM EST',
      duration: '60 minutes',
      instructor: 'Mike Davis',
      type: 'Webinar'
    }
  ];

  return (
    <DetailPageLayout title="Live Classes & Webinars" iconName="live">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Upcoming Live Sessions</h2>
          <p className="text-gray-300 mb-4">
            Join live trading classes and webinars to learn from expert traders and interact in real-time.
          </p>
        </div>

        <div className="space-y-4">
          {upcomingClasses.map((classItem, index) => (
            <div key={index} className="bg-dark-900 rounded-lg p-6 hover:border-gold-500 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      classItem.type === 'Live Class' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {classItem.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{classItem.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {(() => {
                      const CalendarIcon = getIcon('calendar');
                      const ClockIcon = getIcon('clock');
                      const UserIcon = getIcon('user');
                      return (
                        <>
                          <span className="flex items-center gap-1">
                            {CalendarIcon && <CalendarIcon className="w-4 h-4" />}
                            {classItem.date}
                          </span>
                          <span className="flex items-center gap-1">
                            {ClockIcon && <ClockIcon className="w-4 h-4" />}
                            {classItem.time}
                          </span>
                          <span className="flex items-center gap-1">
                            {ClockIcon && <ClockIcon className="w-4 h-4" />}
                            {classItem.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            {UserIcon && <UserIcon className="w-4 h-4" />}
                            {classItem.instructor}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="btn-primary">Join Session</button>
                  <button className="btn-secondary">Add to Calendar</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-dark-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Live Classes Schedule</h3>
            <p className="text-gray-300 mb-4">
              Regular live classes are held weekly. Check the schedule and mark your calendar.
            </p>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Mondays: 10:00 AM EST - Beginner Topics</li>
              <li>• Wednesdays: 2:00 PM EST - Intermediate Strategies</li>
              <li>• Fridays: 3:00 PM EST - Advanced Techniques</li>
            </ul>
          </div>

          <div className="bg-dark-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Webinar Schedule</h3>
            <p className="text-gray-300 mb-4">
              Monthly webinars on special topics with guest speakers and Q&A sessions.
            </p>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• First Saturday: Market Analysis</li>
              <li>• Third Saturday: Trading Psychology</li>
              <li>• Last Saturday: Q&A with Experts</li>
            </ul>
          </div>
        </div>

        <div className="bg-dark-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Past Recordings</h3>
          <p className="text-gray-300 mb-4">
            Missed a session? Access recordings of past live classes and webinars in your dashboard.
          </p>
          <button className="btn-secondary">View Recordings</button>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default LiveClasses;

