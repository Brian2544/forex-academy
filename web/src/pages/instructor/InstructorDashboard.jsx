import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { BookOpen, Video, TrendingUp, Users } from 'lucide-react';

const InstructorDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['instructor-dashboard'],
    queryFn: async () => {
      // This would call an instructor-specific endpoint
      return {
        lessonsCreated: 0,
        liveTrainingsScheduled: 0,
        signalsPosted: 0,
        studentsTaught: 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your courses and students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lessons Created</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data?.lessonsCreated || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Live Trainings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data?.liveTrainingsScheduled || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Video className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Signals Posted</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data?.signalsPosted || 0}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Students Taught</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data?.studentsTaught || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

