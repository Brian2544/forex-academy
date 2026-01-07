import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const onboardingSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  country: z.string().min(1, 'Country is required'),
  phone_country_code: z.string().min(1, 'Phone country code is required'),
  phone_number: z.string().optional()
});

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Italy', 'Spain',
  'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Poland', 'Portugal', 'Greece', 'Ireland', 'Japan', 'South Korea', 'Singapore', 'Malaysia',
  'Thailand', 'Indonesia', 'Philippines', 'India', 'China', 'South Africa', 'Nigeria', 'Kenya',
  'Ghana', 'Egypt', 'Morocco', 'Brazil', 'Argentina', 'Mexico', 'Chile', 'Colombia'
];

const countryCodes = [
  { code: '+1', country: 'US/CA' },
  { code: '+44', country: 'UK' },
  { code: '+61', country: 'AU' },
  { code: '+49', country: 'DE' },
  { code: '+33', country: 'FR' },
  { code: '+39', country: 'IT' },
  { code: '+34', country: 'ES' },
  { code: '+31', country: 'NL' },
  { code: '+32', country: 'BE' },
  { code: '+41', country: 'CH' },
  { code: '+43', country: 'AT' },
  { code: '+46', country: 'SE' },
  { code: '+47', country: 'NO' },
  { code: '+45', country: 'DK' },
  { code: '+358', country: 'FI' },
  { code: '+48', country: 'PL' },
  { code: '+351', country: 'PT' },
  { code: '+30', country: 'GR' },
  { code: '+353', country: 'IE' },
  { code: '+81', country: 'JP' },
  { code: '+82', country: 'KR' },
  { code: '+65', country: 'SG' },
  { code: '+60', country: 'MY' },
  { code: '+66', country: 'TH' },
  { code: '+62', country: 'ID' },
  { code: '+63', country: 'PH' },
  { code: '+91', country: 'IN' },
  { code: '+86', country: 'CN' },
  { code: '+27', country: 'ZA' },
  { code: '+234', country: 'NG' },
  { code: '+254', country: 'KE' },
  { code: '+233', country: 'GH' },
  { code: '+20', country: 'EG' },
  { code: '+212', country: 'MA' },
  { code: '+55', country: 'BR' },
  { code: '+54', country: 'AR' },
  { code: '+52', country: 'MX' },
  { code: '+56', country: 'CL' },
  { code: '+57', country: 'CO' }
];

const Onboarding = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { refreshProfile, profile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(onboardingSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Call bootstrap endpoint with country_code
      const response = await api.post('/auth/bootstrap', {
        first_name: data.first_name,
        last_name: data.last_name,
        country: data.country,
        country_code: data.phone_country_code,
      });
      
      if (response.data.success) {
        toast.success('Profile completed successfully!');
        await refreshProfile();
        
        // Get updated profile to determine role
        const meResponse = await api.get('/users/me');
        const profile = meResponse.data.data?.profile || meResponse.data.profile;
        const userRole = profile?.role || 'student';
        const roleLower = userRole.toLowerCase();
        
        // Route based on role
        if (roleLower === 'owner') {
          navigate('/owner/dashboard', { replace: true });
        } else if (['admin', 'super_admin', 'content_admin', 'support_admin', 'finance_admin'].includes(roleLower)) {
          navigate('/admin/overview', { replace: true });
        } else if (roleLower === 'instructor') {
          navigate('/instructor/overview', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-green-500 flex items-center justify-center text-white font-bold text-2xl mb-4">
            FX
          </div>
          <h2 className="text-3xl font-bold text-[#F5F7FF]">Complete Your Profile</h2>
          <p className="mt-2 text-sm text-[#B6C2E2]">
            Please provide some information to get started
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-[#0B1220] p-8 rounded-lg shadow-sm border border-[rgba(255,255,255,0.08)]" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-[#B6C2E2] mb-1">
                First Name *
              </label>
              <input
                {...register('first_name')}
                type="text"
                id="first_name"
                className="w-full px-3 py-2 border border-[rgba(255,255,255,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0F1A2E] text-[#F5F7FF]"
                placeholder="John"
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-[#B6C2E2] mb-1">
                Last Name *
              </label>
              <input
                {...register('last_name')}
                type="text"
                id="last_name"
                className="w-full px-3 py-2 border border-[rgba(255,255,255,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0F1A2E] text-[#F5F7FF]"
                placeholder="Doe"
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-[#B6C2E2] mb-1">
                Country *
              </label>
              <select
                {...register('country')}
                id="country"
                className="w-full px-3 py-2 border border-[rgba(255,255,255,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0F1A2E] text-[#F5F7FF]"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone_country_code" className="block text-sm font-medium text-[#B6C2E2] mb-1">
                  Country Code *
                </label>
                <select
                  {...register('phone_country_code')}
                  id="phone_country_code"
                  className="w-full px-3 py-2 border border-[rgba(255,255,255,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0F1A2E] text-[#F5F7FF]"
                >
                  <option value="">Select</option>
                  {countryCodes.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} ({item.country})
                    </option>
                  ))}
                </select>
                {errors.phone_country_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_country_code.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-[#B6C2E2] mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  {...register('phone_number')}
                  type="tel"
                  id="phone_number"
                  className="w-full px-3 py-2 border border-[rgba(255,255,255,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0F1A2E] text-[#F5F7FF]"
                  placeholder="1234567890"
                />
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;

