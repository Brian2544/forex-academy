import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';
import CourseCard from '../components/dashboard/CourseCard';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { getIcon } from '../utils/icons';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') {
        params.level = filter;
      }
      const { data } = await api.get('/courses', { params });
      setCourses(data.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070A0F] via-[#0B1220] to-[#0F1A2E]">
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/5 to-primary-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl font-bold text-[#F5F7FF] mb-4">
              Comprehensive <span className="text-gradient">Forex Trading</span> Courses
            </h1>
            <p className="text-[#B6C2E2] text-xl max-w-3xl mx-auto leading-relaxed">
              Master the art of Forex trading with our structured, progressive learning system. 
              From complete beginner to advanced professional, we have the perfect course for your skill level.
            </p>
          </div>
        </div>

        {/* Course Overview Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              level: 'Beginner',
              iconName: 'beginner',
              description: 'Perfect for those new to Forex trading. Learn the fundamentals, understand market basics, and build a solid foundation.',
              duration: '4-6 weeks',
              lessons: '20+ lessons',
              price: 'Free',
              color: 'green'
            },
            {
              level: 'Intermediate',
              iconName: 'intermediate',
              description: 'Take your trading to the next level. Master technical analysis, trading strategies, and risk management techniques.',
              duration: '6-8 weeks',
              lessons: '30+ lessons',
              price: '$29.99/mo',
              color: 'blue'
            },
            {
              level: 'Advanced',
              iconName: 'advanced',
              description: 'For serious traders. Learn institutional strategies, advanced techniques, and professional trading methods.',
              duration: '8-12 weeks',
              lessons: '40+ lessons',
              price: '$99.99/mo',
              color: 'purple'
            }
          ].map((course, index) => {
            const IconComponent = getIcon(course.iconName);
            return (
              <div key={index} className="card hover:border-accent-500 hover:shadow-xl transition-all duration-300">
                <div className="mb-4">
                  {IconComponent && (
                    <IconComponent className="w-12 h-12 text-accent-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-[#F5F7FF] mb-3">{course.level} Course</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{course.description}</p>
                <div className="space-y-2 mb-4">
                  {(() => {
                    const ClockIcon = getIcon('clock');
                    return (
                      <div className="flex items-center text-gray-700 text-sm">
                        {ClockIcon && <ClockIcon className="w-4 h-4 text-accent-600 mr-2" />}
                        Duration: {course.duration}
                      </div>
                    );
                  })()}
                  {(() => {
                    const BookIcon = getIcon('book');
                    return (
                      <div className="flex items-center text-gray-700 text-sm">
                        {BookIcon && <BookIcon className="w-4 h-4 text-accent-600 mr-2" />}
                        {course.lessons}
                      </div>
                    );
                  })()}
                  <div className="flex items-center text-accent-600 font-bold">
                    {course.price}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* What You'll Learn Section */}
        <div className="card mb-12">
          <h2 className="text-3xl font-bold text-[#F5F7FF] mb-6">What You'll Learn</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-accent-600 mb-3">Core Concepts</h3>
              <ul className="space-y-2 text-gray-700">
                {(() => {
                  const CheckIcon = getIcon('check');
                  return [
                    'Understanding currency pairs and market structure',
                    'Market sessions and trading hours',
                    'Fundamental vs technical analysis',
                    'Reading and interpreting charts'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      {CheckIcon && <CheckIcon className="w-5 h-5 text-accent-600 mr-2 flex-shrink-0 mt-0.5" />}
                      <span>{item}</span>
                    </li>
                  ));
                })()}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-accent-600 mb-3">Trading Skills</h3>
              <ul className="space-y-2 text-gray-700">
                {(() => {
                  const CheckIcon = getIcon('check');
                  return [
                    'Risk management and position sizing',
                    'Entry and exit strategies',
                    'Trading psychology and discipline',
                    'Building and testing trading systems'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      {CheckIcon && <CheckIcon className="w-5 h-5 text-accent-600 mr-2 flex-shrink-0 mt-0.5" />}
                      <span>{item}</span>
                    </li>
                  ));
                })()}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === level
                  ? 'bg-primary-500 text-white'
                  : 'bg-[#0B1220] border-2 border-[rgba(255,255,255,0.08)] text-[#B6C2E2] hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {!loading && courses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-600 text-lg">No courses found</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Courses;

