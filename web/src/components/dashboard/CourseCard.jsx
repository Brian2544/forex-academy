import { Link } from 'react-router-dom';
import { Lock, Unlock } from 'lucide-react';

const CourseCard = ({ course, progress, isLocked = false, onPay, priceLabel, isProcessing = false }) => {
  const levelColors = {
    beginner: 'bg-secondary-100 text-secondary-700',
    intermediate: 'bg-primary-100 text-primary-700',
    advanced: 'bg-purple-100 text-purple-700'
  };
  const getCanonicalLevel = () => {
    const text = `${course?.level || ''} ${course?.title || ''} ${course?.description || ''}`.toLowerCase();
    if (text.includes('beginner') || text.includes('foundation') || text.includes('basic')) return 'beginner';
    if (text.includes('intermediate') || text.includes('technical')) return 'intermediate';
    if (text.includes('advanced') || text.includes('professional') || text.includes('master')) return 'advanced';
    return String(course?.level || '').trim().toLowerCase();
  };

  // Map course level to route
  const getCourseRoute = () => {
    const level = getCanonicalLevel();
    if (level === 'beginner') return '/student/courses/beginner';
    if (level === 'intermediate') return '/student/courses/intermediate';
    if (level === 'advanced') return '/student/courses/advanced';
    // Fallback to courses list if level doesn't match
    return '/courses';
  };

  const CardContent = (
    <>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-300 mb-2">
            {course.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            levelColors[getCanonicalLevel()] || 'bg-primary-100 text-primary-700'
          }`}>
            {course.level}
          </span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            isLocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            {isLocked ? 'Locked' : 'Unlocked'}
          </span>
          {priceLabel && (
            <span className="text-sm font-semibold text-neutral-700">{priceLabel}</span>
          )}
        </div>
      </div>

      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
        {course.description}
      </p>

      {progress && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-neutral-600">Progress</span>
            <span className="text-primary-600 font-medium">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>{course.lessons?.length || 0} lessons</span>
        {course.duration && <span>{course.duration} min</span>}
      </div>
    </>
  );

  if (isLocked) {
    return (
      <div className="card hover:border-primary-300 transition group">
        {CardContent}
        <button
          onClick={onPay}
          disabled={isProcessing}
          className="mt-4 w-full rounded-lg bg-primary-600 text-white py-2 text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60"
        >
          {isProcessing ? 'Redirecting...' : 'Pay to Activate'}
        </button>
      </div>
    );
  }

  return (
    <Link to={getCourseRoute()} className="card hover:border-primary-300 transition group">
      {CardContent}
    </Link>
  );
};

export default CourseCard;

