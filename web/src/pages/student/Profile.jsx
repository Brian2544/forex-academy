import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const Profile = () => {
  const { profile, refreshProfile } = useAuth();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(location.pathname.includes('/edit'));
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    country: '',
    phone_country_code: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        country: profile.country || '',
        phone_country_code: profile.phone_country_code || '',
        phone_number: profile.phone_number || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/bootstrap', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        country: formData.country,
        country_code: formData.phone_country_code,
        phone_number: formData.phone_number,
      });
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        await refreshProfile();
        setIsEditMode(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <DetailPageLayout title="Profile" iconName="user">
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout title="Profile" iconName="user">
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Details of the Trainee</h2>
          {!isEditMode && (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditMode ? (
          <form onSubmit={handleSubmit} className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)] space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F1A2E] border border-[rgba(255,255,255,0.12)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F1A2E] border border-[rgba(255,255,255,0.12)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={profile.email || ''}
                className="w-full px-4 py-2 bg-[#0F1A2E] border border-[rgba(255,255,255,0.12)] rounded-lg text-gray-400 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 bg-[#0F1A2E] border border-[rgba(255,255,255,0.12)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Country Code</label>
                <input
                  type="text"
                  value={formData.phone_country_code}
                  onChange={(e) => setFormData({ ...formData, phone_country_code: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F1A2E] border border-[rgba(255,255,255,0.12)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="+1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F1A2E] border border-[rgba(255,255,255,0.12)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditMode(false);
                  setFormData({
                    first_name: profile.first_name || '',
                    last_name: profile.last_name || '',
                    country: profile.country || '',
                    phone_country_code: profile.phone_country_code || '',
                    phone_number: profile.phone_number || '',
                  });
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)] space-y-4">
            <div className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
              <span className="text-gray-400">First Name</span>
              <span className="text-white font-medium">{profile.first_name || 'Not set'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
              <span className="text-gray-400">Last Name</span>
              <span className="text-white font-medium">{profile.last_name || 'Not set'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
              <span className="text-gray-400">Email</span>
              <span className="text-white font-medium">{profile.email || 'Not set'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
              <span className="text-gray-400">Country</span>
              <span className="text-white font-medium">{profile.country || 'Not set'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
              <span className="text-gray-400">Phone</span>
              <span className="text-white font-medium">
                {profile.phone_country_code && profile.phone_number
                  ? `${profile.phone_country_code} ${profile.phone_number}`
                  : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Role</span>
              <span className="text-white font-medium capitalize">{profile.role || 'Student'}</span>
            </div>
          </div>
        )}
      </div>
    </DetailPageLayout>
  );
};

export default Profile;
