import { Link } from 'react-router-dom';
import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { getIcon } from '../../utils/icons';

const Testimonials = () => {
  const testimonials = [
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

  return (
    <DetailPageLayout title="Testimonials & Success Stories" iconName="testimonial">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">What Our Professionals Say</h2>
          <p className="text-neutral-600 mb-4">
            Real stories from professional traders who have transformed their trading journey with our academy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative bg-white border-2 border-neutral-200 rounded-lg p-6 hover:border-primary-300 transition-all hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary-100 to-transparent rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full ${
                    index === 0 ? 'bg-gradient-to-br from-primary-100 to-secondary-100' :
                    index === 1 ? 'bg-gradient-to-br from-secondary-100 to-primary-100' :
                    'bg-gradient-to-br from-primary-100 to-secondary-100'
                  } border-2 ${
                    index === 0 ? 'border-primary-300' :
                    index === 1 ? 'border-secondary-300' :
                    'border-primary-300'
                  } flex items-center justify-center`}>
                    {(() => {
                      const UserIcon = getIcon('user');
                      return UserIcon ? (
                        <UserIcon className={`w-6 h-6 ${
                          index === 0 ? 'text-primary-600' :
                          index === 1 ? 'text-secondary-600' :
                          'text-primary-600'
                        }`} />
                      ) : null;
                    })()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-neutral-900 font-semibold">{testimonial.name}</h3>
                      {testimonial.verified && (() => {
                        const CheckIcon = getIcon('check');
                        return CheckIcon ? (
                          <span className="text-secondary-600 text-xs flex items-center gap-1">
                            <CheckIcon className="w-3 h-3" />
                            Verified
                          </span>
                        ) : null;
                      })()}
                    </div>
                    <p className="text-neutral-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => {
                    const StarIcon = getIcon('star');
                    return StarIcon ? (
                      <StarIcon key={i} className={`w-5 h-5 ${
                        i % 2 === 0 ? 'text-primary-500' : 'text-secondary-500'
                      }`} />
                    ) : null;
                  })}
                </div>
              
                <p className="text-neutral-700 mb-4 italic">"{testimonial.text}"</p>
              
                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-neutral-600">Before</p>
                      <p className="text-danger-600 line-through">{testimonial.before}</p>
                    </div>
                    <span className="text-neutral-400">→</span>
                    <div className="text-right">
                      <p className="text-neutral-600">After</p>
                      <p className="text-secondary-600 font-semibold">{testimonial.after}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">Success Stories</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-primary-600 font-medium mb-2">Before & After Stories</h4>
              <p className="text-neutral-600 text-sm mb-4">
                See real transformation stories with screenshots and detailed accounts of how traders
                improved their results after joining the academy.
              </p>
              <button className="btn btn-secondary">View Stories</button>
            </div>
            <div>
              <h4 className="text-primary-600 font-medium mb-2">Video Testimonials</h4>
              <p className="text-neutral-600 text-sm mb-4">
                Watch video testimonials from our successful trainees sharing their journey and results.
              </p>
              <button className="btn btn-secondary">Watch Videos</button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">Ready to Start Your Success Story?</h3>
          <p className="text-neutral-600 mb-4">
            Join thousands of successful traders who have transformed their trading with our academy.
          </p>
          <Link to="/dashboard" className="btn btn-primary inline-block">Explore Courses</Link>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default Testimonials;

