import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';
import { getIcon } from '../../utils/icons';
import { Link } from 'react-router-dom';

const Blog = () => {
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      try {
        const response = await api.get('/student/blog');
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <DetailPageLayout title="Blog" iconName="blog">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  const posts = blogPosts || [];

  return (
    <DetailPageLayout title="Blog" iconName="blog">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Forex Basics Articles</h2>
          <p className="text-gray-300 mb-4">
            Educational articles covering forex basics, trading strategies, market analysis, and more.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)] hover:border-amber-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
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
                <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                )}
                <Link
                  to={`/student/blog/${post.id}`}
                  className="text-amber-500 hover:text-amber-400 font-medium text-sm inline-flex items-center gap-1"
                >
                  Read More
                  {(() => {
                    const ArrowIcon = getIcon('arrow-right');
                    return ArrowIcon ? (
                      <ArrowIcon className="w-4 h-4" />
                    ) : (
                      <span>→</span>
                    );
                  })()}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0B1220] rounded-lg p-12 border border-[rgba(255,255,255,0.08)] text-center">
            <div className="mb-4 flex justify-center">
              {(() => {
                const BlogIcon = getIcon('blog');
                return BlogIcon ? (
                  <BlogIcon className="w-16 h-16 text-gray-500" />
                ) : null;
              })()}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Articles Yet</h3>
            <p className="text-gray-400">
              New articles are published regularly. Check back often for the latest insights and educational content.
            </p>
          </div>
        )}
      </div>
    </DetailPageLayout>
  );
};

export default Blog;
