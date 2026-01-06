import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Search, Eye, Edit, DollarSign, Mail, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Students = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-students', search, country, status, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.append('search', search);
      if (country) params.append('country', country);
      if (status) params.append('status', status);
      const response = await api.get(`/admin/students?${params}`);
      return response.data;
    }
  });

  if (id) {
    return <StudentDetail id={id} />;
  }

  const students = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage all students and their subscriptions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Countries</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Kenya">Kenya</option>
            <option value="South Africa">South Africa</option>
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="needs_renewal">Needs Renewal</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Country</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Subscription</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Total Paid</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Joined</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {student.first_name} {student.last_name}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{student.email}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{student.country || 'N/A'}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              student.subscription_status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : student.subscription_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : student.subscription_status === 'needs_renewal'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {student.subscription_status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          ${parseFloat(student.total_paid || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {student.created_at ? format(new Date(student.created_at), 'MMM d, yyyy') : 'N/A'}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => navigate(`/admin/students/${student.id}`)}
                            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {pagination.pages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const StudentDetail = ({ id }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-student', id],
    queryFn: async () => {
      const response = await api.get(`/admin/students/${id}`);
      return response.data.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      const response = await api.patch(`/admin/students/${id}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-student', id]);
      toast.success('Student updated successfully');
    },
    onError: () => {
      toast.error('Failed to update student');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Student not found</p>
        <button onClick={() => navigate('/admin/students')} className="mt-2 text-orange-600 hover:text-orange-700">
          Back to Students
        </button>
      </div>
    );
  }

  const { profile, subscriptions, payments, groups, tickets, stats } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/admin/students')}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium mb-2"
          >
            ← Back to Students
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {profile.first_name} {profile.last_name}
          </h1>
          <p className="text-gray-600 mt-1">{profile.email}</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Country</p>
            <p className="text-sm font-medium text-gray-900">{profile.country || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="text-sm font-medium text-gray-900">
              {profile.phone_country_code} {profile.phone_number || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="text-sm font-medium text-gray-900 uppercase">{profile.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Joined</p>
            <p className="text-sm font-medium text-gray-900">
              {profile.created_at ? format(new Date(profile.created_at), 'MMM d, yyyy') : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Total Paid</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">${stats.totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Total Payments</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalPayments}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Active Subscriptions</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.activeSubscriptions}</p>
        </div>
      </div>

      {/* Subscriptions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscriptions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Started</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Expires</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">No subscriptions</td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">{sub.plan_type}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {sub.started_at ? format(new Date(sub.started_at), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {sub.expires_at ? format(new Date(sub.expires_at), 'MMM d, yyyy') : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payments</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Provider</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reference</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">No payments</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      ${parseFloat(payment.amount || 0).toFixed(2)} {payment.currency}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{payment.provider}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {payment.created_at ? format(new Date(payment.created_at), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 font-mono">{payment.reference || 'N/A'}</td>
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

export default Students;

