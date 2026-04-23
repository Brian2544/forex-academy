export const REFERRAL_STORAGE_KEY = 'referral_code';

export const storeReferralCode = (code) => {
  if (!code) return;
  localStorage.setItem(REFERRAL_STORAGE_KEY, code.trim());
};

export const getStoredReferralCode = () => localStorage.getItem(REFERRAL_STORAGE_KEY);
