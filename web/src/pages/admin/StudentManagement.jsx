import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentManagement = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ status: 'all', search: '' });
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, [filters, pagination.page]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      };
      const response = await api.get('/students', { params });
      setStudents(response.data.data || []);
      setPagination(prev => ({ ...prev, ...response.data.pagination }));
    } catch (error) {
      console.error('Error fetching students:', error);
      // Mock data
      setStudents([
        {
          id: '1',
          email: 'student1@example.com',
          name: 'John Doe',
          role: 'STUDENT',
          status: 'active',
          approvedAt: new Date().toISOString(),
          subscriptions: [{ status: 'ACTIVE', endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }],
          groupMemberships: [],
        },
      ]);
      toast.error('Using mock data - API connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      await api.post(`/students/${studentId}/approve`);
      toast.success('Student approved successfully');
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve student');
    }
  };

  const handleReject = async (studentId) => {
    if (!window.confirm('Are you sure you want to reject this student?')) return;
    try {
      await api.post(`/students/${studentId}/reject`);
      toast.success('Student rejected');
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject student');
    }
  };

  const getStatusBadge = (subscription) => {
    if (!subscription || !subscription[0]) {
      return { label: 'No Subscription', color: 'bg-neutral-100 text-neutral-700' };
    }
    const sub = subscription[0];
    switch (sub.status) {
      case 'ACTIVE':
        return { label: 'Active', color: 'bg-secondary-100 text-secondary-700' };
      case 'PENDING_APPROVAL':
        return { label: 'Pending', color: 'bg-warning-100 text-warning-700' };
      case 'APPROVED':
        return { label: 'Approved', color: 'bg-primary-100 text-primary-700' };
      case 'EXPIRED':
        return { label: 'Expired', color: 'bg-danger-100 text-danger-700' };
      case 'NEEDS_RENEWAL':
        return { label: 'Needs Renewal', color: 'bg-warning-100 text-warning-700' };
      default:
        return { label: 'Unknown', color: 'bg-neutral-100 text-neutral-700' };
    }
  };

  const tabs = [
    { id: 'all', label: 'All Students', count: pagination.total },
    { id: 'pending', label: 'Pending Approval', count: students.filter(s => s.subscriptions?.[0]?.status === 'PENDING_APPROVAL').length },
    { id: 'active', label: 'Active', count: students.filter(s => s.subscriptions?.[0]?.status === 'ACTIVE').length },
    { id: 'expired', label: 'Expired', count: students.filter(s => s.subscriptions?.[0]?.status === 'EXPIRED').length },
    { id: 'needsRenewal', label: 'Needs Renewal', count: students.filter(s => s.subscriptions?.[0]?.status === 'NEEDS_RENEWAL').length },
  ];

  const filteredStudents = selectedTab === 'all' 
    ? students 
    : students.filter(s => {
        const status = s.subscriptions?.[0]?.status;
        return status === selectedTab.toUpperCase() || 
               (selectedTab === 'needsRenewal' && status === 'NEEDS_RENEWAL');
      });

  if (loading && students.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Student Management</h1>
            <p className="text-neutral-600">Manage students, approvals, and subscriptions</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold">
            Export CSV
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="search"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="NEEDS_RENEWAL">Needs Renewal</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Group</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Expiry Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-neutral-600">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const statusBadge = getStatusBadge(student.subscriptions);
                    return (
                      <tr key={student.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-900">{student.name || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 text-neutral-600">{student.email}</td>
                        <td className="px-6 py-4 text-neutral-600">
                          {student.groupMemberships?.[0]?.group?.name || 'No Group'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.color}`}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-600">
                          {student.subscriptions?.[0]?.endAt
                            ? new Date(student.subscriptions[0].endAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {student.subscriptions?.[0]?.status === 'PENDING_APPROVAL' && (
                              <>
                                <button
                                  onClick={() => handleApprove(student.id)}
                                  className="px-3 py-1 bg-secondary-500 text-white rounded text-xs font-medium hover:bg-secondary-600 transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(student.id)}
                                  className="px-3 py-1 bg-danger-500 text-white rounded text-xs font-medium hover:bg-danger-600 transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <Link
                              to={`/admin/students/${student.id}`}
                              className="px-3 py-1 bg-primary-500 text-white rounded text-xs font-medium hover:bg-primary-600 transition-colors"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-neutral-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-neutral-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 border border-neutral-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentManagement;

