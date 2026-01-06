import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Testimonials & Success Stories</h1>
          <p className="text-slate-400 mb-8">
            Real stories from professional traders who have transformed their trading journey with our academy.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {testimonials.map((testimonial, index) => {
              const StarIcon = getIcon('star');
              const UserIcon = getIcon('user');
              const CheckIcon = getIcon('check');
              return (
                <div key={index} className="relative bg-slate-800 border-2 border-slate-700 rounded-lg p-6 hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-2">
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
                          <h3 className="text-slate-100 font-semibold">{testimonial.name}</h3>
                          {testimonial.verified && CheckIcon && (
                            <span className="text-amber-400 text-xs flex items-center gap-1">
                              <CheckIcon className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        StarIcon ? (
                          <StarIcon key={i} className={`w-5 h-5 ${
                            i % 2 === 0 ? 'text-amber-400' : 'text-amber-500'
                          }`} />
                        ) : null
                      ))}
                    </div>
                  
                    <p className="text-slate-300 mb-4 italic">"{testimonial.text}"</p>
                  
                    <div className="border-t border-slate-700 pt-4">
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <p className="text-slate-400">Before</p>
                          <p className="text-red-400 line-through">{testimonial.before}</p>
                        </div>
                        <span className="text-slate-500">→</span>
                        <div className="text-right">
                          <p className="text-slate-400">After</p>
                          <p className="text-amber-400 font-semibold">{testimonial.after}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-amber-500/20 to-blue-500/20 border-2 border-amber-500/30 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-slate-100 mb-2">Ready to Start Your Success Story?</h3>
            <p className="text-slate-300 mb-4">
              Join thousands of successful traders who have transformed their trading with our academy.
            </p>
            <Link to="/student/dashboard" className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/40 transition-all duration-300">
              Explore Courses
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Testimonials;

