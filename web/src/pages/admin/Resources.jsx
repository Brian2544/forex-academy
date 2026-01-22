import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Plus, Folder, Trash2, ExternalLink, FileText, Video, Image, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Resources = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-resources', typeFilter, search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 20 });
      if (typeFilter) params.append('type', typeFilter);
      if (search) params.append('search', search);
      const response = await api.get(`/admin/resources?${params}`);
      return response.data;
    }
  });
  const { data: coursesData } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const response = await api.get('/admin/courses');
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/admin/resources/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-resources']);
      toast.success('Resource deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete resource');
    }
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'document': return <FileText className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      case 'link': return <LinkIcon className="w-5 h-5" />;
      default: return <Folder className="w-5 h-5" />;
    }
  };

  const resources = data?.data || [];
  const courses = coursesData?.data || [];
  const courseMap = new Map(courses.map((course) => [course.id, course]));
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600 mt-1">Manage learning resources and materials</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600"
        >
          <Plus className="w-5 h-5" />
          Upload Resource
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Types</option>
            <option value="document">Document</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="link">Link</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No resources found
            </div>
          ) : (
            resources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">{resource.type}</p>
                      {resource.course_id && courseMap.get(resource.course_id) && (
                        <p className="text-xs text-gray-400">
                          Course: {courseMap.get(resource.course_id).title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 mb-4"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Resource
                  </a>
                )}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{format(new Date(resource.created_at), 'MMM d, yyyy')}</span>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this resource?')) {
                        deleteMutation.mutate(resource.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-700"
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
        <CreateResourceModal
          courses={courses}
          onClose={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries(['admin-resources']);
          }}
        />
      )}
    </div>
  );
};

const CreateResourceModal = ({ onClose, courses }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('link');
  const [url, setUrl] = useState('');
  const [courseId, setCourseId] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const storageBucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'course-materials';

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/admin/resources', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-resources']);
      toast.success('Resource created successfully');
      onClose();
    },
    onError: () => {
      toast.error('Failed to create resource');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'link') {
      if (!url) {
        toast.error('Please provide a valid URL');
        return;
      }
      createMutation.mutate({ title, type, url, course_id: courseId || undefined });
      return;
    }

    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      const uploadResponse = await api.post('/admin/resources/upload', file, {
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'x-file-name': file.name,
          'x-bucket-name': storageBucket,
        },
        transformRequest: [(data) => data],
        timeout: 120000,
      });

      const publicUrl = uploadResponse.data?.data?.url;
      if (!publicUrl) {
        toast.error('Failed to get file URL');
        return;
      }

      createMutation.mutate({
        title,
        type,
        url: publicUrl,
        course_id: courseId || undefined,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Resource</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="document">Document</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="link">Link</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course (optional)</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">General Resource</option>
              {courses?.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            {type === 'link' ? (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/resource"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-500 bg-white"
                />
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
                <input
                  type="file"
                  accept={
                    type === 'document'
                      ? '.pdf,.doc,.docx,.ppt,.pptx'
                      : type === 'video'
                        ? '.mp4,.mov,.avi,.webm'
                        : type === 'image'
                          ? '.png,.jpg,.jpeg,.gif,.webp'
                          : '*/*'
                  }
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
                {file && (
                  <p className="mt-2 text-xs text-gray-500">Selected: {file.name}</p>
                )}
              </>
            )}
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
              disabled={createMutation.isLoading || uploading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : createMutation.isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Resources;

