import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/dashboard/CourseCard';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { getIcon } from '../utils/icons';
import { useAuth } from '../context/AuthContext';
import { paymentService } from '../services/payment.service';
import toast from 'react-hot-toast';
import CourseOutlineSection from '../components/public/CourseOutlineSection';
import { BRAND, COURSE_OUTLINE, TRUST_AND_SAFETY_TOPICS } from '../data/publicContent';
import { getFormattedCoursePrice } from '../utils/coursePricing';
import { learningCatalog } from '../data/learningCatalog';

const Courses = () => {
  const { isAuthenticated, profile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processingCourseId, setProcessingCourseId] = useState(null);

  const normalizeLevel = (value) => String(value || '').trim().toLowerCase();
  const getCanonicalLevel = (course) => {
    const text = `${course?.level || ''} ${course?.title || ''} ${course?.description || ''}`.toLowerCase();
    if (text.includes('beginner') || text.includes('foundation') || text.includes('basic')) return 'beginner';
    if (text.includes('intermediate') || text.includes('technical')) return 'intermediate';
    if (text.includes('advanced') || text.includes('professional') || text.includes('master')) return 'advanced';
    return normalizeLevel(course?.level);
  };
  const getFallbackCourse = (level) => ({
    id: `fallback-${level}`,
    title: learningCatalog[level]?.title || `${level.charAt(0).toUpperCase() + level.slice(1)} Course`,
    level,
    description: learningCatalog[level]?.description || 'Course details will be available soon.',
    lessons: learningCatalog[level]?.modules || [],
    duration: level === 'beginner' ? 180 : level === 'intermediate' ? 240 : 300,
    isFallback: true,
  });

  useEffect(() => {
    fetchCourses();
  }, [isAuthenticated]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const endpoint = isAuthenticated ? '/student/courses' : '/courses';
      const { data } = await api.get(endpoint);
      const courseList = isAuthenticated ? data.data : data.data.courses;
      setCourses(courseList || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (course) => getFormattedCoursePrice(course);

  const handlePay = async (courseId, courseLevel, courseTitle) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to continue');
      return;
    }

    setProcessingCourseId(courseId);
    try {
      const response = await paymentService.initializeCoursePayment(courseId, courseLevel, courseTitle);
      if (response.success && response.data?.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        toast.error('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment init error:', error);
      toast.error(error.message || error.response?.data?.message || 'Payment initialization failed.');
    } finally {
      setProcessingCourseId(null);
    }
  };

  const isPrivileged = ['admin', 'super_admin', 'owner', 'content_admin', 'support_admin', 'finance_admin']
    .includes(profile?.role?.toLowerCase());

  const coursesWithFallback = useMemo(() => {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const byLevel = new Map();

    courses.forEach((course) => {
      const level = getCanonicalLevel(course);
      if (levels.includes(level) && !byLevel.has(level)) byLevel.set(level, course);
    });

    levels.forEach((level) => {
      if (!byLevel.has(level)) byLevel.set(level, getFallbackCourse(level));
    });

    return Array.from(byLevel.values());
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (filter === 'all') return coursesWithFallback;
    return coursesWithFallback.filter((course) => getCanonicalLevel(course) === filter);
  }, [coursesWithFallback, filter]);

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
              {BRAND.name} delivers a disciplined, progressive learning system from foundations to professional
              trading practice.
            </p>
          </div>
        </div>

        {/* Course Overview Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {['beginner', 'intermediate', 'advanced'].map((level) => {
            const course = coursesWithFallback.find((item) => getCanonicalLevel(item) === level);
            const display = {
              level: level.charAt(0).toUpperCase() + level.slice(1),
              iconName: level,
              description: course?.description || 'Course details will be available soon.',
              duration: level === 'beginner' ? '4-6 weeks' : level === 'intermediate' ? '6-8 weeks' : '8-12 weeks',
              lessons: level === 'beginner' ? '20+ lessons' : level === 'intermediate' ? '30+ lessons' : '40+ lessons',
              price: formatPrice(course || { level }),
              detailsPath:
                level === 'beginner'
                  ? '/courses/foundations'
                  : level === 'intermediate'
                    ? '/courses/technical-analysis'
                    : '/courses/professional-practices',
            };
            const IconComponent = getIcon(display.iconName);
            return (
              <div key={level} className="card hover:border-accent-500 hover:shadow-xl transition-all duration-300">
                <div className="mb-4">
                  {IconComponent && (
                    <IconComponent className="w-12 h-12 text-accent-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-[#F5F7FF] mb-3">{display.level} Course</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{display.description}</p>
                <div className="space-y-2 mb-4">
                  {(() => {
                    const ClockIcon = getIcon('clock');
                    return (
                      <div className="flex items-center text-gray-700 text-sm">
                        {ClockIcon && <ClockIcon className="w-4 h-4 text-accent-600 mr-2" />}
                        Duration: {display.duration}
                      </div>
                    );
                  })()}
                  {(() => {
                    const BookIcon = getIcon('book');
                    return (
                      <div className="flex items-center text-gray-700 text-sm">
                        {BookIcon && <BookIcon className="w-4 h-4 text-accent-600 mr-2" />}
                        {display.lessons}
                      </div>
                    );
                  })()}
                  <div className="flex items-center text-accent-600 font-bold">
                    {display.price}
                  </div>
                </div>
                <Link to={display.detailsPath} className="btn btn-outline w-full text-center">
                  View Level Details
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mb-12">
          <CourseOutlineSection outline={COURSE_OUTLINE} />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {TRUST_AND_SAFETY_TOPICS.map((topic) => (
            <article key={topic.title} className="card">
              <h3 className="text-xl font-semibold text-[#F5F7FF] mb-3">{topic.title}</h3>
              <ul className="space-y-2 text-[#B6C2E2] text-sm">
                {topic.points.map((point) => (
                  <li key={point}>- {point}</li>
                ))}
              </ul>
            </article>
          ))}
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
            {filteredCourses.map((course) => {
              const locked = !course.isFallback && !isPrivileged && isAuthenticated && course.isEntitled === false;
              const priceLabel = formatPrice(course);

              return (
                <CourseCard
                  key={course.id || `course-${getCanonicalLevel(course)}`}
                  course={course}
                  isLocked={locked}
                  priceLabel={priceLabel}
                  onPay={() => handlePay(course.id, course.level, course.title)}
                  isProcessing={processingCourseId === course.id}
                />
              );
            })}
          </div>
        )}

        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-600 text-lg">
              {filter === 'all'
                ? 'No courses found'
                : `No ${filter} courses are available yet`}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Courses;

