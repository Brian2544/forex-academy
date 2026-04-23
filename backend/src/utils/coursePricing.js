export const COURSE_PRICE_USD_BY_LEVEL = {
  beginner: 200,
  intermediate: 150,
  advanced: 100,
};

export const getCoursePriceUsdByLevel = (level) => {
  const normalizedLevel = String(level || '').toLowerCase();
  return COURSE_PRICE_USD_BY_LEVEL[normalizedLevel] ?? 100;
};

export const applyCanonicalCoursePrice = (course) => {
  if (!course) return course;
  const canonicalPrice = getCoursePriceUsdByLevel(course.level);
  return {
    ...course,
    price_ngn: canonicalPrice,
    currency: 'USD',
  };
};
