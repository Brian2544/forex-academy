import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const buildStorageKey = (userId) => `learning_progress_${userId || 'anonymous'}`;

const readProgress = (userId) => {
  try {
    const raw = localStorage.getItem(buildStorageKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
};

const writeProgress = (userId, data) => {
  localStorage.setItem(buildStorageKey(userId), JSON.stringify(data));
};

export const useLearningProgress = () => {
  const { user, profile } = useAuth();
  const userId = user?.id || profile?.id;

  const progressState = useMemo(() => readProgress(userId), [userId]);

  const getCourseProgress = (courseLevel, totalLessons = 0) => {
    const completedLessons = progressState?.[courseLevel] || [];
    const completedCount = completedLessons.length;
    const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    return {
      completedCount,
      totalLessons,
      percentage,
      completedLessons,
    };
  };

  const toggleLessonCompletion = (courseLevel, lessonId) => {
    const current = readProgress(userId);
    const currentLessons = current[courseLevel] || [];
    const exists = currentLessons.includes(lessonId);
    const nextLessons = exists
      ? currentLessons.filter((id) => id !== lessonId)
      : [...currentLessons, lessonId];
    const next = { ...current, [courseLevel]: nextLessons };
    writeProgress(userId, next);
    return nextLessons;
  };

  return {
    userId,
    getCourseProgress,
    toggleLessonCompletion,
  };
};
