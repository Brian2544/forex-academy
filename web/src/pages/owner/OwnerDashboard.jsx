import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Users, Search, Save, X, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';

const OwnerDashboard = () => {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 50;

  const { data, isLoading } = useQuery({
    queryKey: ['owner-users', searchTerm, page],
    queryFn: async () => {
      const response = await api.get('/owner/users', {
        params: { search: searchTerm, page, limit },
      });
      return response.data.data;
    },
  });

  const { profile: currentProfile, refreshProfile } = useAuth();

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role, reason }) => {
      const response = await api.post(`/owner/users/${id}/role`, { role, reason });
      return response.data;
    },
    onSuccess: async (data, variables) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['owner-users'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      
      // If user changed their own role, refetch their profile immediately
      if (currentProfile?.id === variables.id) {
        // Refetch current user's profile to get updated role
        await refreshProfile();
        // Show message and reload after a short delay to apply new role
        toast.success('Your role has been updated. Refreshing...');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.success('User role updated successfully');
      }
      
      setEditingUser(null);
      setNewRole('');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update user role';
      toast.error(message);
    },
  });

  const overrideSubscriptionMutation = useMutation({
    mutationFn: async ({ studentUserId, active, reason }) => {
      const response = await api.post(`/admin/subscription/override/${studentUserId}`, { active, reason });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['owner-users'] });
      toast.success(`Subscription ${variables.active ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update subscription';
      toast.error(message);
    },
  });

  const users = data?.users || [];
  const pagination = data?.pagination || { page: 1, limit, total: 0, totalPages: 1 };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setNewRole(user.role || 'student');
  };

  const handleSave = (userId) => {
    if (!newRole) {
      toast.error('Please select a role');
      return;
    }
    updateRoleMutation.mutate({ id: userId, role: newRole });
  };

  const handleCancel = () => {
    setEditingUser(null);
    setNewRole('');
  };

  const getRoleBadgeColor = (role) => {
    const roleLower = role?.toLowerCase();
    if (roleLower === 'owner') return 'bg-purple-100 text-purple-800';
    if (roleLower === 'super_admin') return 'bg-red-100 text-red-800';
    if (roleLower === 'admin') return 'bg-orange-100 text-orange-800';
    if (roleLower === 'content_admin') return 'bg-blue-100 text-blue-800';
    if (roleLower === 'support_admin') return 'bg-green-100 text-green-800';
    if (roleLower === 'finance_admin') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const allRoles = [
    { value: 'student', label: 'Student' },
    { value: 'admin', label: 'Admin' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'content_admin', label: 'Content Admin' },
    { value: 'support_admin', label: 'Support Admin' },
    { value: 'finance_admin', label: 'Finance Admin' },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#F5F7FF]">Owner Dashboard</h1>
        <p className="text-[#B6C2E2] mt-1">Manage all users and their roles</p>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0D1324] rounded-lg shadow-sm border border-[rgba(255,255,255,0.08)] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7E8AAE] w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-2 border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0A0E1A] text-[#F5F7FF] placeholder-[#7E8AAE]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0D1324] rounded-lg shadow-sm border border-[rgba(255,255,255,0.08)] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#121B33] border-b border-[rgba(255,255,255,0.08)]">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Name</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Email</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Role</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Subscription</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Joined</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-[#F5F7FF]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-[#B6C2E2]">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const isOwner = user.role?.toLowerCase() === 'owner';
                      return (
                        <tr key={user.id} className="border-b border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.05)]">
                          <td className="py-4 px-6 text-sm text-[#F5F7FF]">
                            {user.first_name || user.last_name
                              ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                              : 'N/A'}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#B6C2E2]">{user.email || 'N/A'}</td>
                          <td className="py-4 px-6">
                            {editingUser === user.id ? (
                              <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="px-3 py-1 border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0A0E1A] text-[#F5F7FF]"
                                disabled={isOwner}
                              >
                                {allRoles.map((role) => (
                                  <option key={role.value} value={role.value}>
                                    {role.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                                  user.role
                                )} uppercase`}
                              >
                                {user.role || 'student'}
                                {isOwner && ' (Locked)'}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {user.role?.toLowerCase() === 'student' ? (
                              <div className="space-y-1">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    user.subscription_status === 'active'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {user.subscription_status || 'inactive'}
                                </span>
                                {user.subscription_override_by && (
                                  <div className="text-xs text-[#7E8AAE]">
                                    By {user.subscription_override_by.name} ({user.subscription_override_by.role})
                                    {user.subscription_override_by.at && (
                                      <span className="ml-1">
                                        on {format(new Date(user.subscription_override_by.at), 'MMM d, yyyy')}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-[#7E8AAE]">N/A</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#B6C2E2]">
                            {user.created_at
                              ? format(new Date(user.created_at), 'MMM d, yyyy')
                              : 'N/A'}
                          </td>
                          <td className="py-4 px-6">
                            {isOwner ? (
                              <span className="text-xs text-[#7E8AAE] italic">Owner accounts cannot be modified</span>
                            ) : editingUser === user.id ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSave(user.id)}
                                  disabled={updateRoleMutation.isLoading}
                                  className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm disabled:opacity-50"
                                >
                                  <Save className="w-4 h-4" />
                                  Save
                                </button>
                                <button
                                  onClick={handleCancel}
                                  disabled={updateRoleMutation.isLoading}
                                  className="flex items-center gap-1 text-gray-600 hover:text-gray-700 text-sm disabled:opacity-50"
                                >
                                  <X className="w-4 h-4" />
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="text-orange-600 hover:text-orange-700"
                                  title="Edit role"
                                >
                                  <Users className="w-4 h-4" />
                                </button>
                                {user.role?.toLowerCase() === 'student' && (
                                  <>
                                    {user.subscription_status === 'active' ? (
                                      <button
                                        onClick={() => overrideSubscriptionMutation.mutate({ studentUserId: user.id, active: false })}
                                        disabled={overrideSubscriptionMutation.isLoading}
                                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                                        title="Deactivate subscription"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => overrideSubscriptionMutation.mutate({ studentUserId: user.id, active: true })}
                                        disabled={overrideSubscriptionMutation.isLoading}
                                        className="text-green-600 hover:text-green-700 disabled:opacity-50"
                                        title="Activate subscription"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-[#121B33] px-6 py-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <div className="text-sm text-[#B6C2E2]">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm border border-[rgba(255,255,255,0.08)] rounded-lg hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-50 disabled:cursor-not-allowed text-[#B6C2E2]"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 text-sm border border-[rgba(255,255,255,0.08)] rounded-lg hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-50 disabled:cursor-not-allowed text-[#B6C2E2]"
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

export default OwnerDashboard;

