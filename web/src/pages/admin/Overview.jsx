import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Users, CreditCard, Clock, AlertCircle, TrendingUp, FileText, Video, UserPlus } from 'lucide-react';
import { format } from 'date-fns';

const Overview = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/overview');
        // Handle both success: true and direct data responses
        if (response.data.success && response.data.data) {
          return response.data.data;
        }
        return response.data;
      } catch (err) {
        console.error('Error fetching overview:', err);
        // Return empty structure on error
        return {
          kpis: {},
          thisWeek: {},
          latestStudents: [],
          latestPayments: [],
          openTickets: []
        };
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading dashboard data</p>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const thisWeek = data?.thisWeek || {};
  const latestStudents = data?.latestStudents || [];
  const latestPayments = data?.latestPayments || [];
  const openTickets = data?.openTickets || [];

  const kpiCards = [
    {
      title: 'Total Students',
      value: kpis.totalStudents || 0,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Subscriptions',
      value: kpis.activeSubscriptions || 0,
      icon: CreditCard,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Approval',
      value: kpis.pendingApproval || 0,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Needs Renewal',
      value: kpis.needsRenewal || 0,
      icon: AlertCircle,
      color: 'bg-orange-500'
    }
  ];

  const quickActions = [
    { label: 'Approve Students', path: '/admin/students?filter=pending' },
    { label: 'Schedule Class', path: '/admin/live-trainings/new' },
    { label: 'Upload Resource', path: '/admin/resources/new' },
    { label: 'Create Group', path: '/admin/groups/new' }
  ];

  const thisWeekItems = [
    { label: 'Signals Posted', value: thisWeek.signalsPosted || 0, icon: TrendingUp },
    { label: 'Resources Uploaded', value: thisWeek.resourcesUploaded || 0, icon: FileText },
    { label: 'Live Trainings Scheduled', value: thisWeek.liveTrainingsScheduled || 0, icon: Video },
    { label: 'New Students', value: thisWeek.newStudents || 0, icon: UserPlus }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                </div>
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.path}
                className="block px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:text-orange-600"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>

        {/* This Week */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
          <div className="grid grid-cols-2 gap-4">
            {thisWeekItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Latest Students */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Students</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Country</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {latestStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No students yet
                  </td>
                </tr>
              ) : (
                latestStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{student.country || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {student.created_at ? format(new Date(student.created_at), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest Payments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Payments</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {latestPayments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No payments yet
                  </td>
                </tr>
              ) : (
                latestPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {payment.profile?.first_name || 'N/A'} {payment.profile?.last_name || ''}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      ${parseFloat(payment.amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {payment.created_at ? format(new Date(payment.created_at), 'MMM d, yyyy') : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;

