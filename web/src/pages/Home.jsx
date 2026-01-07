import { Link } from 'react-router-dom';
import { getIcon } from '../utils/icons';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070A0F] via-[#0B1220] to-[#0F1A2E]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-16 bg-gradient-to-br from-[#070A0F] via-[#0B1220] to-[#0F1A2E]">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/8 via-secondary-500/4 to-primary-500/8"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(245,131,32,0.12),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(164,205,57,0.10),transparent_60%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            
            {/* Main Hero Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-black mt-8 mb-4 leading-tight">
              <span className="text-[#F5F7FF]">Master the </span>
              <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent animate-pulse">Market</span>
              <span className="text-[#F5F7FF]"> with </span>
              <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent animate-pulse">Precision</span>
              <br />
              <span className="text-[#F5F7FF]">Remember, </span>
              <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent animate-pulse">Smart</span>
              <span className="text-[#F5F7FF]"> </span>
              <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent animate-pulse">Traders</span>
              <br />
              <span className="text-[#F5F7FF]">are </span>
              <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent animate-pulse">Trained!</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-[#B6C2E2] mb-5 max-w-3xl mx-auto font-medium leading-relaxed">
              Transform your trading journey with expert-led courses, live signals, and professional mentorship
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link 
                to="/register" 
                className="group relative px-8 py-3 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-glow-primary-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative z-10">Start Learning Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 via-primary-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                to="/courses" 
                className="px-8 py-3 bg-[#0B1220] border-2 border-secondary-500 text-secondary-500 font-semibold text-lg rounded-xl hover:bg-secondary-500 hover:text-[#0B1220] hover:border-secondary-500 hover:shadow-lg hover:shadow-secondary-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                Explore Courses
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
              <div className="text-center p-2.5 bg-[#0B1220]/60 backdrop-blur-sm rounded-xl border border-[rgba(216,181,71,0.2)] hover:border-primary-300 hover:shadow-md transition-all duration-300">
                <div className="text-3xl md:text-2xl font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent mb-1">10K+</div>
                <div className="text-xs md:text-sm font-semibold text-[#B6C2E2]">Active Professionals</div>
              </div>
              <div className="text-center p-2.5 bg-[#0B1220]/60 backdrop-blur-sm rounded-xl border border-[rgba(216,181,71,0.2)] hover:border-secondary-300 hover:shadow-md transition-all duration-300">
                <div className="text-3xl md:text-2xl font-black bg-gradient-to-r from-secondary-500 via-primary-500 to-secondary-500 bg-clip-text text-transparent mb-1">500+</div>
                <div className="text-xs md:text-sm font-semibold text-[#B6C2E2]">5-Star Reviews</div>
              </div>
              <div className="text-center p-2.5 bg-[#0B1220]/60 backdrop-blur-sm rounded-xl border border-[rgba(216,181,71,0.2)] hover:border-primary-300 hover:shadow-md transition-all duration-300">
                <div className="text-3xl md:text-2xl font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent mb-1">50+</div>
                <div className="text-xs md:text-sm font-semibold text-[#B6C2E2]">Expert Instructors</div>
              </div>
              <div className="text-center p-2.5 bg-[#0B1220]/60 backdrop-blur-sm rounded-xl border border-[rgba(216,181,71,0.2)] hover:border-secondary-300 hover:shadow-md transition-all duration-300">
                <div className="text-3xl md:text-2xl font-black bg-gradient-to-r from-secondary-500 via-primary-500 to-secondary-500 bg-clip-text text-transparent mb-1">24/7</div>
                <div className="text-xs md:text-sm font-semibold text-[#B6C2E2]">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative bg-[#070A0F]">
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
                className="group relative p-8 bg-[#0B1220] border-2 border-[rgba(255,255,255,0.08)] rounded-2xl hover:border-primary-300 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(216,181,71,0.1)] via-[rgba(216,181,71,0.05)] to-[rgba(216,181,71,0.1)] opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-4">
                    {IconComponent && (
                      <IconComponent className="w-12 h-12 text-secondary-500 group-hover:text-primary-500 transition-colors duration-300" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-[#F5F7FF] mb-3 group-hover:text-primary-600 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-[#B6C2E2] leading-relaxed">{feature.description}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Levels Section */}
      <section className="py-24 bg-gradient-to-br from-[#0B1220] via-[#070A0F] to-[#0F1A2E] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,131,32,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-3xl font-bold text-[#F5F7FF] mb-4">
              Choose Your <span className="text-gradient">Learning Path</span>
            </h2>
            <p className="text-xl text-[#B6C2E2]">Start from your current level and progress at your own pace</p>
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
                className="relative p-8 bg-[#0B1220] border-2 border-[rgba(255,255,255,0.08)] rounded-2xl hover:border-primary-300 transition-all duration-300 group hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[rgba(216,181,71,0.2)] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[rgba(216,181,71,0.2)] to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className={`inline-block px-4 py-2 ${
                    index === 0 ? 'bg-[rgba(216,181,71,0.2)] border-secondary-300 text-secondary-500' : 
                    index === 1 ? 'bg-[rgba(216,181,71,0.2)] border-primary-300 text-primary-500' : 
                    'bg-gradient-to-r from-[rgba(216,181,71,0.2)] to-[rgba(216,181,71,0.2)] border-primary-300 text-[#F5F7FF]'
                  } border rounded-full mb-6 font-semibold`}>
                    <span>{course.level}</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-[#F5F7FF] mb-4 group-hover:text-primary-600 transition-colors duration-300">{course.level} Course</h3>
                  <p className="text-[#B6C2E2] mb-6 leading-relaxed">{course.description}</p>
                  
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
                          <span className="text-[#B6C2E2]">{topic}</span>
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
      <section className="py-24 bg-gradient-to-br from-[#0F1A2E] via-[#070A0F] to-[#0B1220] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(164,205,57,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-2xl font-bold text-[#F5F7FF] mb-4">
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
                  className="p-8 bg-[#0B1220] border-2 border-[rgba(255,255,255,0.08)] rounded-2xl hover:border-primary-300 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-2"
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
                  <p className="text-[#B6C2E2] mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${
                      index === 0 ? 'bg-gradient-to-br from-[rgba(216,181,71,0.2)] to-[rgba(216,181,71,0.2)]' :
                      index === 1 ? 'bg-gradient-to-br from-[rgba(216,181,71,0.2)] to-[rgba(216,181,71,0.2)]' :
                      'bg-gradient-to-br from-[rgba(216,181,71,0.2)] to-[rgba(216,181,71,0.2)]'
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
                      <div className="font-semibold text-[#F5F7FF]">{testimonial.name}</div>
                      <div className="text-sm text-[#B6C2E2]">{testimonial.role}</div>
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

    </div>
  );
};

export default Home;
