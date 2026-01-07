import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Users, Search, Save, X } from 'lucide-react';
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
        <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage all users and their roles</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Joined</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const isOwner = user.role?.toLowerCase() === 'owner';
                      return (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {user.first_name || user.last_name
                              ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                              : 'N/A'}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">{user.email || 'N/A'}</td>
                          <td className="py-4 px-6">
                            {editingUser === user.id ? (
                              <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {user.created_at
                              ? format(new Date(user.created_at), 'MMM d, yyyy')
                              : 'N/A'}
                          </td>
                          <td className="py-4 px-6">
                            {isOwner ? (
                              <span className="text-xs text-gray-500 italic">Owner accounts cannot be modified</span>
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
                              <button
                                onClick={() => handleEdit(user)}
                                className="text-orange-600 hover:text-orange-700"
                                title="Edit role"
                              >
                                <Users className="w-4 h-4" />
                              </button>
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
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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

