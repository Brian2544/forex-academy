import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Plus, BookOpen, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Lessons = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [levelFilter, setLevelFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-lessons', levelFilter, publishedFilter, search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 20 });
      if (levelFilter) params.append('level', levelFilter);
      if (publishedFilter !== '') params.append('published', publishedFilter);
      if (search) params.append('search', search);
      const response = await api.get(`/admin/lessons?${params}`);
      return response.data;
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }) => {
      const response = await api.patch(`/admin/lessons/${id}`, { published });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-lessons']);
      toast.success('Lesson updated successfully');
    },
    onError: () => {
      toast.error('Failed to update lesson');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/admin/lessons/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-lessons']);
      toast.success('Lesson deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete lesson');
    }
  });

  const lessons = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
          <p className="text-gray-600 mt-1">Create and manage course lessons</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600"
        >
          <Plus className="w-5 h-5" />
          Create Lesson
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search lessons..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            value={publishedFilter}
            onChange={(e) => {
              setPublishedFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
      </div>

      {/* Lessons Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Level</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Created</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">
                      No lessons found
                    </td>
                  </tr>
                ) : (
                  lessons.map((lesson) => (
                    <tr key={lesson.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm text-gray-900">{lesson.title}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                          {lesson.level}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => togglePublishMutation.mutate({ id: lesson.id, published: !lesson.published })}
                          className="flex items-center gap-1 text-sm"
                        >
                          {lesson.published ? (
                            <>
                              <Eye className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400">Draft</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {format(new Date(lesson.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this lesson?')) {
                                deleteMutation.mutate(lesson.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateLessonModal
          onClose={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries(['admin-lessons']);
          }}
        />
      )}
    </div>
  );
};

const CreateLessonModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [level, setLevel] = useState('beginner');
  const [published, setPublished] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/admin/lessons', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-lessons']);
      toast.success('Lesson created successfully');
      onClose();
    },
    onError: () => {
      toast.error('Failed to create lesson');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ title, content, level, published });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create Lesson</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="published" className="text-sm text-gray-700">Publish immediately</label>
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

export default Lessons;

