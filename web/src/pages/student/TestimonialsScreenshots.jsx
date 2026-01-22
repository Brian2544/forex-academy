import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const TestimonialsScreenshots = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials-screenshots'],
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
      <DetailPageLayout title="Testimonial Screenshots" iconName="testimonial">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  const screenshots = testimonials?.filter(t => t.screenshot_url) || [];

  return (
    <DetailPageLayout title="Testimonial Screenshots" iconName="testimonial">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Trading Screenshots</h2>
          <p className="text-gray-300 mb-4">
            View real trading results and screenshots shared by our students.
          </p>
        </div>

        {screenshots.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screenshots.map((item) => (
              <div
                key={item.id}
                className="bg-[#0B1220] rounded-lg p-4 border border-[rgba(255,255,255,0.08)]"
              >
                {item.screenshot_url && (
                  <img
                    src={item.screenshot_url}
                    alt={item.name || 'Trading screenshot'}
                    className="w-full h-auto rounded mb-3"
                  />
                )}
                {item.name && (
                  <p className="text-white font-medium text-sm">{item.name}</p>
                )}
                {item.content && (
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0B1220] rounded-lg p-12 border border-[rgba(255,255,255,0.08)] text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No Screenshots Yet</h3>
            <p className="text-gray-400">
              Trading screenshots will be available soon. Check back later to see real results from our students.
            </p>
          </div>
        )}
      </div>
    </DetailPageLayout>
  );
};

export default TestimonialsScreenshots;
