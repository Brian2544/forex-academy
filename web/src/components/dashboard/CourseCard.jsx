import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const CourseCard = ({ course, progress }) => {
  const levelColors = {
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-blue-500/20 text-blue-400',
    advanced: 'bg-purple-500/20 text-purple-400'
  };

  return (
    <Link to={`/courses/${course.id}`} className="card hover:border-primary-500 transition group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white group-hover:text-primary-500 transition mb-2">
            {course.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}>
            {course.level}
          </span>
        </div>
        {course.isFree && (
          <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
            Free
          </span>
        )}
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {course.description}
      </p>

      {progress && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-primary-500 font-medium">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{course.lessons?.length || 0} lessons</span>
        {course.duration && <span>{course.duration} min</span>}
      </div>
    </Link>
  );
};

export default CourseCard;

