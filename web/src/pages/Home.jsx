import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 border border-primary-500/50 rounded-full mb-8">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span className="text-primary-400 text-sm font-medium">Join 10,000+ Successful Traders</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
              Master <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">Forex Trading</span>
              <br />Like a Pro
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Learn from industry experts. Practice with real strategies. Trade with confidence.
              <span className="block mt-2 text-lg text-gray-400">Start your journey to financial freedom today.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                to="/register" 
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-dark-950 font-bold text-lg rounded-xl shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Start Learning Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link 
                to="/courses" 
                className="px-8 py-4 bg-dark-800/50 backdrop-blur-sm border-2 border-primary-500/50 text-primary-400 font-semibold text-lg rounded-xl hover:bg-primary-500/10 hover:border-primary-500 transition-all duration-300"
              >
                Explore Courses
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">10K+</div>
                <div className="text-sm text-gray-400">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">500+</div>
                <div className="text-sm text-gray-400">5-Star Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">50+</div>
                <div className="text-sm text-gray-400">Expert Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to <span className="text-primary-500">Succeed</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive training from basics to advanced strategies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '📚',
                title: 'Structured Courses',
                description: 'Progressive learning path from beginner to advanced. Master concepts step-by-step with real-world examples.',
                gradient: 'from-blue-500/20 to-cyan-500/20'
              },
              {
                icon: '📡',
                title: 'Live Trading Signals',
                description: 'Get real-time signals with detailed analysis. Learn the reasoning behind every trade decision.',
                gradient: 'from-green-500/20 to-emerald-500/20'
              },
              {
                icon: '🎓',
                title: 'Expert Mentorship',
                description: 'Learn directly from professional traders. Join live classes and get personalized feedback.',
                gradient: 'from-purple-500/20 to-pink-500/20'
              },
              {
                icon: '📊',
                title: 'Market Analysis',
                description: 'Daily and weekly market insights. Understand market movements and economic factors.',
                gradient: 'from-orange-500/20 to-red-500/20'
              },
              {
                icon: '💬',
                title: 'Community Support',
                description: 'Connect with fellow traders. Share experiences and learn from each other in our exclusive forums.',
                gradient: 'from-indigo-500/20 to-blue-500/20'
              },
              {
                icon: '🏆',
                title: 'Certification',
                description: 'Earn certificates upon course completion. Validate your skills and boost your trading career.',
                gradient: 'from-yellow-500/20 to-primary-500/20'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-gradient-to-br from-dark-900 to-dark-800 border border-dark-700 rounded-2xl hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Levels Section */}
      <section className="py-24 bg-dark-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your <span className="text-primary-500">Learning Path</span>
            </h2>
            <p className="text-xl text-gray-400">Start from your current level and progress at your own pace</p>
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
                className="relative p-8 bg-gradient-to-br from-dark-900 to-dark-800 border-2 border-dark-700 rounded-2xl hover:border-primary-500 transition-all duration-300 group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className={`inline-block px-4 py-2 bg-${course.color}-500/20 border border-${course.color}-500/50 rounded-full mb-6`}>
                    <span className={`text-${course.color}-400 font-semibold`}>{course.level}</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4">{course.level} Course</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{course.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {course.topics.map((topic, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary-500 mr-3 mt-1">✓</span>
                        <span className="text-gray-300">{topic}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-500">{course.price}</span>
                    <Link 
                      to="/courses" 
                      className="px-6 py-2 bg-primary-500/20 border border-primary-500/50 text-primary-400 rounded-lg hover:bg-primary-500 hover:text-dark-950 transition-all font-semibold"
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
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join Thousands of <span className="text-primary-500">Successful Traders</span>
            </h2>
            <p className="text-xl text-gray-400">See what our students are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Professional Trader',
                rating: 5,
                text: 'This academy transformed my trading completely. The structured courses and live signals helped me go from losing money to consistent profits.',
                image: '👩‍💼'
              },
              {
                name: 'Michael Chen',
                role: 'Day Trader',
                rating: 5,
                text: 'Best investment I\'ve made. The mentorship program is incredible. I learned strategies I never would have discovered on my own.',
                image: '👨‍💻'
              },
              {
                name: 'Emma Williams',
                role: 'Swing Trader',
                rating: 5,
                text: 'The community support here is amazing. Everyone is helpful and the instructors are always available. Highly recommend!',
                image: '👩‍🎓'
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="p-8 bg-gradient-to-br from-dark-900 to-dark-800 border border-dark-700 rounded-2xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-primary-500 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/register" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-dark-950 font-bold text-lg rounded-xl shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70 transition-all duration-300 hover:scale-105"
            >
              Start Your Success Story
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-primary-600/20 to-primary-500/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Transform Your <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Trading Career?</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Join our community of successful traders today. Start with our free beginner course and unlock your potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="px-10 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-dark-950 font-bold text-xl rounded-xl shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70 transition-all duration-300 hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link 
                to="/pricing" 
                className="px-10 py-5 bg-dark-800/80 backdrop-blur-sm border-2 border-primary-500/50 text-primary-400 font-bold text-xl rounded-xl hover:bg-primary-500/10 transition-all"
              >
                View Pricing
              </Link>
            </div>
            
            <div className="mt-12 pt-8 border-t border-dark-700">
              <p className="text-sm text-gray-500 mb-4">
                <strong className="text-yellow-400">⚠️ Risk Disclaimer:</strong> Trading forex involves substantial risk of loss. 
                Past performance is not indicative of future results. We do not guarantee profits.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <Link to="/legal/terms" className="hover:text-primary-400 transition">Terms & Conditions</Link>
                <Link to="/legal/privacy" className="hover:text-primary-400 transition">Privacy Policy</Link>
                <Link to="/legal/disclaimer" className="hover:text-primary-400 transition">Risk Disclaimer</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
