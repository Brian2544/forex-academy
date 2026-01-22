import { Link } from 'react-router-dom';
import { getIcon } from '../../utils/icons';
import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const Testimonials = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
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

  const defaultTestimonials = [
    {
      name: 'Alex Johnson',
      role: 'Professional Trader',
      rating: 5,
      text: 'The academy transformed my trading completely. The structured courses and live sessions helped me go from losing money to consistent profits.',
      before: '$500/month',
      after: '$3,500/month',
      verified: true
    },
    {
      name: 'Maria Garcia',
      role: 'Part-time Trader',
      rating: 5,
      text: 'I was skeptical at first, but the risk management course alone was worth it. I\'ve reduced my losses by 80% and increased my win rate significantly.',
      before: '30% win rate',
      after: '65% win rate',
      verified: true
    },
    {
      name: 'David Chen',
      role: 'Beginner Trader',
      rating: 5,
      text: 'As a complete beginner, I was overwhelmed. The beginner course broke everything down perfectly. Now I trade with confidence!',
      before: 'No experience',
      after: 'Profitable trader',
      verified: true
    }
  ];

  if (isLoading) {
    return (
      <DetailPageLayout title="Testimonials & Success Stories" iconName="testimonial">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  const testimonialsList = testimonials || [];
  const displayTestimonials = testimonialsList.length > 0 ? testimonialsList : defaultTestimonials;

  return (
    <DetailPageLayout title="Testimonials & Success Stories" iconName="testimonial">
      <div className="space-y-6">
        <div>
          <p className="text-gray-300 mb-4">
            Real stories from professional traders who have transformed their trading journey with our academy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayTestimonials.map((testimonial, index) => {
              const StarIcon = getIcon('star');
              const UserIcon = getIcon('user');
              const CheckIcon = getIcon('check');
              return (
                <div key={testimonial.id || index} className="relative bg-[#0B1220] border-2 border-[rgba(255,255,255,0.08)] rounded-lg p-6 hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full ${
                        index === 0 ? 'bg-gradient-to-br from-amber-500/30 to-blue-500/30' :
                        index === 1 ? 'bg-gradient-to-br from-blue-500/30 to-amber-500/30' :
                        'bg-gradient-to-br from-amber-500/30 to-blue-500/30'
                      } border-2 border-amber-500/50 flex items-center justify-center`}>
                        {UserIcon && <UserIcon className="w-6 h-6 text-amber-400" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold">{testimonial.name || 'Anonymous'}</h3>
                          {testimonial.is_verified && CheckIcon && (
                            <span className="text-amber-400 text-xs flex items-center gap-1">
                              <CheckIcon className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{testimonial.role || 'Trader'}</p>
                      </div>
                    </div>
                    
                    {testimonial.rating && (
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          StarIcon ? (
                            <StarIcon key={i} className={`w-5 h-5 ${
                              i % 2 === 0 ? 'text-amber-400' : 'text-amber-500'
                            }`} />
                          ) : null
                        ))}
                      </div>
                    )}
                  
                    <p className="text-gray-300 mb-4 italic">"{testimonial.content || testimonial.text}"</p>
                  
                    {(testimonial.before || testimonial.after) && (
                      <div className="border-t border-[rgba(255,255,255,0.08)] pt-4">
                        <div className="flex justify-between items-center text-sm">
                          {testimonial.before && (
                            <>
                              <div>
                                <p className="text-gray-400">Before</p>
                                <p className="text-red-400 line-through">{testimonial.before}</p>
                              </div>
                              <span className="text-gray-500">→</span>
                            </>
                          )}
                          {testimonial.after && (
                            <div className="text-right">
                              <p className="text-gray-400">After</p>
                              <p className="text-amber-400 font-semibold">{testimonial.after}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        <div className="bg-gradient-to-r from-amber-500/20 to-blue-500/20 border-2 border-amber-500/30 rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Start Your Success Story?</h3>
          <p className="text-gray-300 mb-4">
            Join thousands of successful traders who have transformed their trading with our academy.
          </p>
          <Link to="/student/dashboard" className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/40 transition-all duration-300">
            Explore Courses
          </Link>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default Testimonials;

