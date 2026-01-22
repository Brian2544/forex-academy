import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const TestimonialsStories = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials-stories'],
    queryFn: async () => {
      try {
        const response = await api.get('/student/testimonials');
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <DetailPageLayout title="Before and After Stories" iconName="testimonial">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  const stories = testimonials || [];

  return (
    <DetailPageLayout title="Before and After Stories" iconName="testimonial">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Success Stories</h2>
          <p className="text-gray-300 mb-4">
            Read inspiring stories from traders who transformed their trading journey with our academy.
          </p>
        </div>

        {stories.length > 0 ? (
          <div className="space-y-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)]"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {story.name || 'Anonymous Trader'}
                  </h3>
                  {story.role && (
                    <p className="text-gray-400 text-sm">{story.role}</p>
                  )}
                </div>
                {story.content && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-amber-400 font-medium mb-2">Before:</h4>
                      <p className="text-gray-300">{story.before_story || story.content}</p>
                    </div>
                    {story.after_story && (
                      <div>
                        <h4 className="text-green-400 font-medium mb-2">After:</h4>
                        <p className="text-gray-300">{story.after_story}</p>
                      </div>
                    )}
                  </div>
                )}
                {story.created_at && (
                  <p className="text-gray-500 text-sm mt-4">
                    {new Date(story.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0B1220] rounded-lg p-12 border border-[rgba(255,255,255,0.08)] text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No Stories Yet</h3>
            <p className="text-gray-400">
              Success stories will be available soon. Check back later to read inspiring transformation stories.
            </p>
          </div>
        )}
      </div>
    </DetailPageLayout>
  );
};

export default TestimonialsStories;
