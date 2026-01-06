import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { getIcon } from '../../utils/icons';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/admin');
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data for now
      setData({
        students: {
          total: 1250,
          pending: 23,
          active: 980,
          expired: 180,
          needsRenewal: 67,
        },
        upcomingTrainings: [],
        revenueThisMonth: 45230.50,
        resourceCount: 45,
        signalsThisWeek: 12,
        messagesToday: 234,
      });
      toast.error('Using mock data - API connection failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = data?.students || {};
  const StatCard = getIcon('stat');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard Overview</h1>
          <p className="text-neutral-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                {StatCard && <StatCard className="w-6 h-6 text-primary-600" />}
              </div>
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">{stats.total || 0}</h3>
            <p className="text-sm text-neutral-600">Total Students</p>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center">
                {StatCard && <StatCard className="w-6 h-6 text-secondary-600" />}
              </div>
              <span className="text-xs font-semibold text-secondary-600 bg-secondary-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">{stats.active || 0}</h3>
            <p className="text-sm text-neutral-600">Active Subscriptions</p>
          </div>

          {/* Pending Approval */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-100 to-warning-200 rounded-xl flex items-center justify-center">
                {StatCard && <StatCard className="w-6 h-6 text-warning-600" />}
              </div>
              <span className="text-xs font-semibold text-warning-600 bg-warning-50 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">{stats.pending || 0}</h3>
            <p className="text-sm text-neutral-600">Pending Approval</p>
          </div>

          {/* Needs Renewal */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                {StatCard && <StatCard className="w-6 h-6 text-primary-600" />}
              </div>
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                Renewal
              </span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">{stats.needsRenewal || 0}</h3>
            <p className="text-sm text-neutral-600">Needs Renewal</p>
          </div>
        </div>

        {/* Action Center & Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Action Center */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/students?filter=pending"
                className="flex items-center space-x-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Approve Students</div>
                  <div className="text-sm text-neutral-600">{stats.pending || 0} pending</div>
                </div>
              </Link>

              <Link
                to="/admin/trainings?action=create"
                className="flex items-center space-x-3 p-4 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Schedule Class</div>
                  <div className="text-sm text-neutral-600">Create new</div>
                </div>
              </Link>

              <Link
                to="/admin/resources?action=upload"
                className="flex items-center space-x-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Upload Resource</div>
                  <div className="text-sm text-neutral-600">Add new file</div>
                </div>
              </Link>

              <Link
                to="/admin/groups?action=create"
                className="flex items-center space-x-3 p-4 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Create Group</div>
                  <div className="text-sm text-neutral-600">New group</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">This Week</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <div className="text-sm text-neutral-600">Signals Posted</div>
                  <div className="text-2xl font-bold text-neutral-900">{data?.signalsThisWeek || 0}</div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  {(() => {
                    const SignalIcon = getIcon('signal');
                    return SignalIcon && <SignalIcon className="w-6 h-6 text-primary-600" />;
                  })()}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <div className="text-sm text-neutral-600">Resources Uploaded</div>
                  <div className="text-2xl font-bold text-neutral-900">{data?.resourceCount || 0}</div>
                </div>
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  {(() => {
                    const ResourceIcon = getIcon('resource');
                    return ResourceIcon && <ResourceIcon className="w-6 h-6 text-secondary-600" />;
                  })()}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <div className="text-sm text-neutral-600">Messages Today</div>
                  <div className="text-2xl font-bold text-neutral-900">{data?.messagesToday || 0}</div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  {(() => {
                    const ChatIcon = getIcon('chat');
                    return ChatIcon && <ChatIcon className="w-6 h-6 text-primary-600" />;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card (Super Admin/Owner only) */}
        {data?.revenueThisMonth !== null && data?.revenueThisMonth !== undefined && (
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-primary-100 text-sm mb-1">Revenue This Month</div>
                <div className="text-3xl font-bold">${data.revenueThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                {(() => {
                  const FinanceIcon = getIcon('finance');
                  return FinanceIcon && <FinanceIcon className="w-8 h-8 text-white" />;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Trainings */}
        {data?.upcomingTrainings && data.upcomingTrainings.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Upcoming Live Trainings</h2>
            <div className="space-y-3">
              {data.upcomingTrainings.slice(0, 5).map((training) => (
                <div key={training.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div>
                    <div className="font-semibold text-neutral-900">{training.title}</div>
                    <div className="text-sm text-neutral-600">
                      {new Date(training.scheduledAt).toLocaleDateString()} at {new Date(training.scheduledAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <Link
                    to={`/admin/trainings/${training.id}`}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

