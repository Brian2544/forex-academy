import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const TestimonialsVideos = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials-videos'],
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
      <DetailPageLayout title="Video Testimonials" iconName="testimonial">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  const videos = testimonials?.filter(t => t.video_url) || [];

  return (
    <DetailPageLayout title="Video Testimonials" iconName="testimonial">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Video Testimonials</h2>
          <p className="text-gray-300 mb-4">
            Watch video testimonials from our students sharing their trading journey and success stories.
          </p>
        </div>

        {videos.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {videos.map((item) => (
              <div
                key={item.id}
                className="bg-[#0B1220] rounded-lg p-4 border border-[rgba(255,255,255,0.08)]"
              >
                {item.video_url && (
                  <div className="aspect-video mb-3 rounded overflow-hidden">
                    <iframe
                      src={item.video_url}
                      title={item.name || 'Video testimonial'}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {item.name && (
                  <p className="text-white font-medium">{item.name}</p>
                )}
                {item.content && (
                  <p className="text-gray-400 text-sm mt-1">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0B1220] rounded-lg p-12 border border-[rgba(255,255,255,0.08)] text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No Video Testimonials Yet</h3>
            <p className="text-gray-400">
              Video testimonials will be available soon. Check back later to watch inspiring stories from our students.
            </p>
          </div>
        )}
      </div>
    </DetailPageLayout>
  );
};

export default TestimonialsVideos;
