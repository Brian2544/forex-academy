import { useParams, Link } from 'react-router-dom';
import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';
import { getIcon } from '../../utils/icons';

const BlogPost = () => {
  const { id } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/student/blog/${id}`);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
      }
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <DetailPageLayout title="Blog Post" iconName="blog">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  if (!post) {
    return (
      <DetailPageLayout title="Blog Post" iconName="blog">
        <div className="bg-[#0B1220] rounded-lg p-12 border border-[rgba(255,255,255,0.08)] text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Post Not Found</h3>
          <p className="text-gray-400 mb-4">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/student/blog"
            className="inline-block px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout title={post.title || "Blog Post"} iconName="blog">
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          {post.category && (
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded text-sm font-medium">
              {post.category}
            </span>
          )}
          {post.created_at && (
            <span className="text-gray-400 text-sm">
              {format(new Date(post.created_at), 'MMM dd, yyyy')}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

        {post.excerpt && (
          <p className="text-xl text-gray-300 mb-6">{post.excerpt}</p>
        )}

        {post.content && (
          <div className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)]">
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            to="/student/blog"
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#0B1220] border border-[rgba(255,255,255,0.08)] text-white rounded-lg hover:bg-[#0F1A2E] font-medium transition-colors"
          >
            {(() => {
              const ArrowIcon = getIcon('arrow-left');
              return ArrowIcon ? (
                <ArrowIcon className="w-4 h-4" />
              ) : null;
            })()}
            Back to Blog
          </Link>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default BlogPost;
