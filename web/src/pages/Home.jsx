import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { getIcon } from '../utils/icons';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/5 to-primary-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,131,32,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(164,205,57,0.06),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            
            
            <h1 className="text-6xl md:text-7xl lg:text-4xl font-black text-neutral-900 mb-6 leading-tight">
            Master the Market with Precision, <span className="text-gradient animate-pulse-slow">Remember, Smart Traders</span>
              <br />are Trained!
            </h1>
            
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                to="/register" 
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-glow-primary-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative z-10">Start Learning Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 via-primary-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                to="/courses" 
                className="px-8 py-4 bg-white border-2 border-secondary-500/70 text-secondary-600 font-semibold text-lg rounded-xl hover:bg-secondary-500 hover:text-white hover:border-secondary-500 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                Explore Courses
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-2xl font-bold text-gradient mb-2">10K+</div>
                <div className="text-sm font-bold text-neutral-600">Active Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-2xl font-bold text-gradient-accent mb-2">500+</div>
                <div className="text-sm font-bold text-neutral-600">5-Star Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-2xl font-bold text-gradient mb-2">50+</div>
                <div className="text-sm font-bold text-neutral-600">Expert Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-2xl font-bold text-gradient-accent mb-2">24/7</div>
                <div className="text-sm font-bold text-neutral-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative bg-white">
        <div className="container mx-auto px-4">
          

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                iconName: 'course',
                title: 'Structured Courses',
                description: 'Progressive learning path from beginner to advanced. Master concepts step-by-step with real-world examples.',
                gradient: 'from-primary-50 to-secondary-50'
              },
              {
                iconName: 'signal',
                title: 'Live Trading Signals',
                description: 'Get real-time signals with detailed analysis. Learn the reasoning behind every trade decision.',
                gradient: 'from-secondary-50 to-primary-50'
              },
              {
                iconName: 'graduation',
                title: 'Expert Mentorship',
                description: 'Learn directly from professional traders. Join live classes and get personalized feedback.',
                gradient: 'from-primary-50 to-secondary-50'
              },
              {
                iconName: 'analysis',
                title: 'Market Analysis',
                description: 'Daily and weekly market insights. Understand market movements and economic factors.',
                gradient: 'from-secondary-50 to-primary-50'
              },
              {
                iconName: 'community',
                title: 'Community Support',
                description: 'Connect with fellow traders. Share experiences and learn from each other in our exclusive forums.',
                gradient: 'from-primary-50 to-secondary-50'
              },
              {
                iconName: 'trophy',
                title: 'Certification',
                description: 'Earn certificates upon course completion. Validate your skills and boost your trading career.',
                gradient: 'from-secondary-50 to-primary-50'
              }
            ].map((feature, index) => {
              const IconComponent = getIcon(feature.iconName);
              return (
              <div 
                key={index}
                className="group relative p-8 bg-white border-2 border-neutral-200 rounded-2xl hover:border-primary-300 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-secondary-50/30 to-primary-50/50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-4">
                    {IconComponent && (
                      <IconComponent className="w-12 h-12 text-secondary-500 group-hover:text-primary-500 transition-colors duration-300" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Levels Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,131,32,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-3xl font-bold text-neutral-900 mb-4">
              Choose Your <span className="text-gradient">Learning Path</span>
            </h2>
            <p className="text-xl text-neutral-600">Start from your current level and progress at your own pace</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                level: 'Beginner',
                color: 'green',
                description: 'Perfect for complete beginners. Learn the fundamentals of Forex trading from scratch.',
                topics: ['What is Forex Trading', 'Currency Pairs Explained', 'Market Sessions', 'Basic Terminology'],
                price: 'Free'
              },
              {
                level: 'Intermediate',
                color: 'blue',
                description: 'For traders who understand basics. Master technical analysis and trading strategies.',
                topics: ['Support & Resistance', 'Candlestick Patterns', 'Risk Management', 'Trading Psychology'],
                price: '$29.99/mo'
              },
              {
                level: 'Advanced',
                color: 'purple',
                description: 'For serious traders. Learn institutional trading strategies and advanced techniques.',
                topics: ['Smart Money Concepts', 'Order Blocks', 'Multi-Timeframe Analysis', 'Trade Management'],
                price: '$99.99/mo'
              }
            ].map((course, index) => (
              <div 
                key={index}
                className="relative p-8 bg-white border-2 border-neutral-200 rounded-2xl hover:border-primary-300 transition-all duration-300 group hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary-100 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className={`inline-block px-4 py-2 ${
                    index === 0 ? 'bg-secondary-100 border-secondary-300 text-secondary-700' : 
                    index === 1 ? 'bg-primary-100 border-primary-300 text-primary-700' : 
                    'bg-gradient-to-r from-primary-100 to-secondary-100 border-primary-300 text-neutral-900'
                  } border rounded-full mb-6 font-semibold`}>
                    <span>{course.level}</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">{course.level} Course</h3>
                  <p className="text-neutral-600 mb-6 leading-relaxed">{course.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {course.topics.map((topic, i) => {
                      const CheckIcon = getIcon('check');
                      return (
                        <li key={i} className="flex items-start">
                          {CheckIcon && <CheckIcon className={`w-5 h-5 ${
                            index === 0 ? 'text-secondary-500' : 
                            index === 1 ? 'text-primary-500' : 
                            'text-secondary-500'
                          } mr-3 mt-1 flex-shrink-0`} />}
                          <span className="text-neutral-700">{topic}</span>
                        </li>
                      );
                    })}
                  </ul>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${
                      index === 0 ? 'text-secondary-600' : 
                      index === 1 ? 'text-primary-600' : 
                      'text-gradient'
                    }`}>{course.price}</span>
                    <Link 
                      to="/courses" 
                      className={`px-6 py-2 rounded-lg border font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                        index === 0 ? 'bg-secondary-500 border-secondary-500 text-white hover:bg-secondary-600' : 
                        index === 1 ? 'bg-primary-500 border-primary-500 text-white hover:bg-primary-600' : 
                        'bg-gradient-to-r from-primary-500 to-secondary-500 border-transparent text-white hover:from-primary-600 hover:to-secondary-600'
                      }`}
                    >
                      Start Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-gradient-to-br from-secondary-50/50 via-white to-primary-50/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(164,205,57,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-2xl font-bold text-neutral-900 mb-4">
            <span className="text-gradient">Reviews</span>
            </h2>
         
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Professional Trader',
                rating: 5,
                text: 'This academy transformed my trading completely. The structured courses and live signals helped me go from losing money to consistent profits.'
              },
              {
                name: 'Michael Chen',
                role: 'Day Trader',
                rating: 5,
                text: 'Best investment I\'ve made. The mentorship program is incredible. I learned strategies I never would have discovered on my own.'
              },
              {
                name: 'Emma Williams',
                role: 'Swing Trader',
                rating: 5,
                text: 'The community support here is amazing. Everyone is helpful and the instructors are always available. Highly recommend!'
              }
            ].map((testimonial, index) => {
              const StarIcon = getIcon('star');
              const UserIcon = getIcon('user');
              return (
                <div 
                  key={index}
                  className="p-8 bg-white border-2 border-neutral-200 rounded-2xl hover:border-primary-300 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-2"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      StarIcon ? (
                        <StarIcon key={i} className={`w-5 h-5 ${
                          i % 2 === 0 ? 'text-primary-500' : 'text-secondary-500'
                        }`} />
                      ) : null
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${
                      index === 0 ? 'bg-gradient-to-br from-primary-100 to-secondary-100' :
                      index === 1 ? 'bg-gradient-to-br from-secondary-100 to-primary-100' :
                      'bg-gradient-to-br from-primary-100 to-secondary-100'
                    } rounded-full flex items-center justify-center border-2 ${
                      index === 0 ? 'border-primary-300' :
                      index === 1 ? 'border-secondary-300' :
                      'border-primary-300'
                    }`}>
                      {UserIcon && <UserIcon className={`w-6 h-6 ${
                        index === 0 ? 'text-primary-600' :
                        index === 1 ? 'text-secondary-600' :
                        'text-primary-600'
                      }`} />}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                      <div className="text-sm text-neutral-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link 
              to="/register" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-glow-primary-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              Start Training
            </Link>
          </div>
        </div>
      </section>

      

      <Footer />
    </div>
  );
};

export default Home;
