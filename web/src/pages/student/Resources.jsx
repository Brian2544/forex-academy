import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import Loader from '../../components/common/Loader';
import { ExternalLink, FileText, Video, Image, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Resources = () => {
  const { profile } = useAuth();
  const [typeFilter, setTypeFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const { data: resourcesData, isLoading } = useQuery({
    queryKey: ['student-resources', typeFilter, courseFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (typeFilter) params.append('type', typeFilter);
      if (courseFilter) params.append('course_id', courseFilter);
      const response = await api.get(`/student/resources?${params.toString()}`);
      return response.data.data || [];
    }
  });

  const { data: coursesData } = useQuery({
    queryKey: ['student-courses'],
    queryFn: async () => {
      const response = await api.get('/student/courses');
      return response.data.data || [];
    }
  });

  const resources = resourcesData || [];
  const courses = coursesData || [];
  const isPrivileged = ['admin', 'super_admin', 'owner', 'content_admin', 'support_admin', 'finance_admin']
    .includes(profile?.role?.toLowerCase());
  const visibleCourses = isPrivileged ? courses : courses.filter((course) => course.isEntitled);
  const courseMap = new Map(courses.map((course) => [course.id, course]));

  const getTypeIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'link':
        return <LinkIcon className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <DetailPageLayout title="Resources" iconName="resource">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout title="Resources" iconName="resource">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Learning Resources</h2>
          <p className="text-gray-300">
            Download materials, watch videos, and access curated links from your instructors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-white/10 bg-[#0B1220] text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Types</option>
            <option value="document">Document</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="link">Link</option>
            <option value="other">Other</option>
          </select>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-white/10 bg-[#0B1220] text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Courses</option>
            {visibleCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {!isPrivileged && visibleCourses.length === 0 && (
          <div className="bg-[#0B1220] rounded-lg p-6 border border-white/10 text-center text-gray-300">
            You do not have access to any course resources yet. Complete a course payment to unlock materials.
          </div>
        )}

        {resources.length === 0 ? (
          <div className="bg-[#0B1220] rounded-lg p-12 border border-white/10 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No resources yet</h3>
            <p className="text-gray-400">Check back soon for newly uploaded materials.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-[#0B1220] rounded-lg p-6 border border-white/10 hover:border-amber-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{resource.title}</h3>
                      <p className="text-xs text-gray-400 capitalize">{resource.type}</p>
                      {resource.course_id && courseMap.get(resource.course_id) && (
                        <p className="text-xs text-gray-500">
                          Course: {courseMap.get(resource.course_id).title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Resource
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </DetailPageLayout>
  );
};

export default Resources;
