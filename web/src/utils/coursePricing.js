export const COURSE_PRICE_USD_BY_LEVEL = {
  beginner: 200,
  intermediate: 150,
  advanced: 100,
};

export const getCoursePriceUsdByLevel = (level) => {
  const normalizedLevel = String(level || '').toLowerCase();
  return COURSE_PRICE_USD_BY_LEVEL[normalizedLevel] ?? null;
};

export const formatUsdPrice = (amount) =>
  `${Number(amount || 0).toFixed(0)} USD`;

export const getFormattedCoursePrice = (course) => {
  const canonicalByLevel = getCoursePriceUsdByLevel(course?.level);
  const amount = canonicalByLevel ?? Number(course?.price_ngn || 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Pricing unavailable';
  }
  return formatUsdPrice(amount);
};
