import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const CourseCard = ({ course, progress }) => {
  const levelColors = {
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-blue-500/20 text-blue-400',
    advanced: 'bg-purple-500/20 text-purple-400'
  };

  // Map course level to route
  const getCourseRoute = () => {
    if (course.level === 'beginner') return '/student/courses/beginner';
    if (course.level === 'intermediate') return '/student/courses/intermediate';
    if (course.level === 'advanced') return '/student/courses/advanced';
    // Fallback to courses list if level doesn't match
    return '/courses';
  };

  return (
    <Link to={getCourseRoute()} className="card hover:border-primary-300 transition group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-300 mb-2">
            {course.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.level === 'beginner' ? 'bg-secondary-100 text-secondary-700' :
            course.level === 'intermediate' ? 'bg-primary-100 text-primary-700' :
            'bg-primary-100 text-primary-700'
          }`}>
            {course.level}
          </span>
        </div>
        {course.isFree && (
          <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">
            Free
          </span>
        )}
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
    </Link>
  );
};

export default CourseCard;

