import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Plus, Search, Users, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Groups = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-groups', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.append('search', search);
      const response = await api.get(`/admin/groups?${params}`);
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/admin/groups/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-groups']);
      toast.success('Group deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete group');
    }
  });

  const groups = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-600 mt-1">Manage student groups and memberships</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600"
        >
          <Plus className="w-5 h-5" />
          Create Group
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No groups found
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{group.description || 'No description'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{group.members?.length || 0} members</span>
                  </div>
                  <div>
                    Created {format(new Date(group.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/groups/${group.id}`)}
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(group.id)}
                    className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries(['admin-groups']);
          }}
        />
      )}
    </div>
  );
};

const CreateGroupModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/admin/groups', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-groups']);
      toast.success('Group created successfully');
      onClose();
    },
    onError: () => {
      toast.error('Failed to create group');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ name, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 disabled:opacity-50"
            >
              {createMutation.isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Groups;

