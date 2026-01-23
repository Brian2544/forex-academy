const resolveEnvValue = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  return value;
};

const paystackPublicKey = resolveEnvValue(import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, '');
const apiBaseUrl = import.meta.env.DEV
  ? 'http://localhost:4000'
  : resolveEnvValue(import.meta.env.VITE_API_BASE_URL, '');

if (import.meta.env.DEV) {
  if (!paystackPublicKey) {
    console.warn('[Env] Missing VITE_PAYSTACK_PUBLIC_KEY. Add it to web/.env.local.');
  }
  if (!apiBaseUrl) {
    console.info('[Env] VITE_API_BASE_URL not set. Using default API base URL.');
  }
}

export const appEnv = {
  paystackPublicKey,
  apiBaseUrl,
};
