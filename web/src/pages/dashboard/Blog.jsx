import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { getIcon } from '../../utils/icons';

const Blog = () => {
  const blogPosts = [
    {
      title: 'Understanding Currency Pairs: A Beginner\'s Guide',
      excerpt: 'Learn the basics of currency pairs and how to read forex quotes.',
      date: 'Jan 2, 2024',
      category: 'Basics'
    },
    {
      title: 'Risk Management: Protecting Your Capital',
      excerpt: 'Essential risk management strategies every trader should know.',
      date: 'Dec 28, 2023',
      category: 'Strategy'
    },
    {
      title: 'Technical Analysis Fundamentals',
      excerpt: 'Introduction to charts, indicators, and technical analysis tools.',
      date: 'Dec 20, 2023',
      category: 'Analysis'
    },
    {
      title: 'The Psychology of Trading',
      excerpt: 'How emotions affect trading and how to maintain discipline.',
      date: 'Dec 15, 2023',
      category: 'Psychology'
    }
  ];

  return (
    <DetailPageLayout title="Blog" iconName="blog">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Forex Basics Articles</h2>
          <p className="text-gray-300 mb-4">
            Educational articles covering forex basics, trading strategies, market analysis, and more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-dark-900 rounded-lg p-6 hover:border-gold-500 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded text-sm font-medium">
                  {post.category}
                </span>
                <span className="text-gray-400 text-sm">{post.date}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{post.excerpt}</p>
              <a href="#" className="text-gold-500 hover:text-gold-400 font-medium text-sm inline-flex items-center gap-1">
                Read More
                {(() => {
                  const ArrowIcon = getIcon('arrow-right');
                  return ArrowIcon ? (
                    <ArrowIcon className="w-4 h-4" />
                  ) : (
                    <span>→</span>
                  );
                })()}
              </a>
            </div>
          ))}
        </div>

        <div className="bg-dark-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Stay Updated</h3>
          <p className="text-gray-300 mb-4">
            New articles are published regularly. Check back often for the latest insights and educational content.
          </p>
          <button className="btn-primary">View All Articles</button>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default Blog;

