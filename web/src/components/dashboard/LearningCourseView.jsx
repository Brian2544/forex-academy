import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getIcon } from '../../utils/icons';
import { useLearningProgress } from '../../hooks/useLearningProgress';
import { certificatePlaceholder } from '../../data/learningCatalog';

const lessonTypeLabel = {
  video: 'Video lesson',
  article: 'Written tutorial',
  worksheet: 'Worksheet/PDF guide',
};

const LearningCourseView = ({ courseLevel, config }) => {
  const [refreshTick, setRefreshTick] = useState(0);
  const { getCourseProgress, toggleLessonCompletion } = useLearningProgress();

  const allLessons = config.modules.flatMap((module) => module.lessons);
  const progress = getCourseProgress(courseLevel, allLessons.length + refreshTick * 0);
  const isCompleted = progress.totalLessons > 0 && progress.completedCount === progress.totalLessons;
  const CheckIcon = getIcon('check');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{config.subtitle}</h2>
        <p className="text-gray-300">{config.description}</p>
      </div>

      <div className="bg-[#0B1220] rounded-lg p-5 border border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Module Progress</h3>
          <span className="text-sm text-amber-400 font-semibold">
            {progress.completedCount}/{progress.totalLessons} lessons
          </span>
        </div>
        <div className="w-full bg-[#111a2f] rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-2">{progress.percentage}% completed</p>
      </div>

      <div className="space-y-4">
        {config.modules.map((module) => (
          <article key={module.id} className="bg-[#0B1220] rounded-lg p-5 border border-[rgba(255,255,255,0.08)]">
            <h3 className="text-xl font-semibold text-white mb-3">{module.title}</h3>
            <ul className="space-y-3">
              {module.lessons.map((lesson) => {
                const complete = progress.completedLessons.includes(lesson.id);
                return (
                  <li key={lesson.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-gray-200">{lesson.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{lessonTypeLabel[lesson.type] || 'Lesson'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        toggleLessonCompletion(courseLevel, lesson.id);
                        setRefreshTick((n) => n + 1);
                      }}
                      className={`px-3 py-1 rounded text-xs font-semibold border ${
                        complete
                          ? 'bg-green-500/20 text-green-300 border-green-500/40'
                          : 'bg-[#0F1A2E] text-gray-300 border-[rgba(255,255,255,0.12)]'
                      }`}
                    >
                      {complete ? 'Completed' : 'Mark done'}
                    </button>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/student/resources" className="btn btn-secondary text-center">
          Downloadable Materials
        </Link>
        <Link to="/student/live-classes" className="btn btn-secondary text-center">
          Webinar Replays
        </Link>
        <Link to="/student/blog" className="btn btn-secondary text-center">
          Written Tutorials
        </Link>
      </div>

      <div className="bg-[#0B1220] rounded-lg p-5 border border-[rgba(255,255,255,0.08)]">
        <h3 className="text-lg font-semibold text-white mb-2">Certificate Status</h3>
        {isCompleted ? (
          <p className="text-green-300 flex items-center gap-2">
            {CheckIcon ? <CheckIcon className="w-4 h-4" /> : null}
            Course completion recorded. Certificate workflow: {certificatePlaceholder.status}.
          </p>
        ) : (
          <p className="text-gray-300">{certificatePlaceholder.note}</p>
        )}
      </div>
    </div>
  );
};

export default LearningCourseView;
