import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { BarChart3, TrendingUp, Users, DollarSign, BookOpen, Globe } from 'lucide-react';

const Analytics = () => {
  const [period, setPeriod] = useState('30');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics', period],
    queryFn: async () => {
      const response = await api.get(`/admin/analytics?period=${period}`);
      return response.data.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const analytics = data || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track platform performance and growth</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.studentGrowth?.total || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${(analytics.revenue?.total || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.subscriptions?.active || 0}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published Lessons</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.lessons?.total || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Countries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h2>
        <div className="space-y-3">
          {analytics.topCountries?.length === 0 ? (
            <p className="text-gray-500">No data available</p>
          ) : (
            analytics.topCountries?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-900">{item.country}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.count}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lessons by Level */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lessons by Level</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{analytics.lessons?.byLevel?.beginner || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Beginner</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{analytics.lessons?.byLevel?.intermediate || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Intermediate</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{analytics.lessons?.byLevel?.advanced || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Advanced</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

