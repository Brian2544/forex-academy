import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const response = await api.get('/admin/settings');
      return response.data.data;
    },
    onSuccess: (data) => {
      setSettings(data || {});
    }
  });

  const updateWhatsAppMutation = useMutation({
    mutationFn: async (whatsapp_channel_url) => {
      const response = await api.patch('/admin/settings', { whatsapp_channel_url });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-settings']);
      toast.success('WhatsApp channel URL updated successfully');
    },
    onError: () => {
      toast.error('Failed to update WhatsApp channel URL');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }) => {
      const response = await api.put(`/admin/settings/${key}`, { value });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-settings']);
      toast.success('Setting updated successfully');
    },
    onError: () => {
      toast.error('Failed to update setting');
    }
  });

  const handleUpdate = (key, value) => {
    updateMutation.mutate({ key, value });
  };

  const handleUpdateWhatsApp = () => {
    updateWhatsAppMutation.mutate(settings.whatsapp_channel_url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage system settings and configuration</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Channel URL
            </label>
            <p className="text-xs text-gray-500 mb-2">
              The WhatsApp channel link that will appear in the WhatsApp button for authenticated users.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={settings.whatsapp_channel_url || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_channel_url: e.target.value })}
                placeholder="https://whatsapp.com/channel/..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleUpdateWhatsApp}
                disabled={updateWhatsAppMutation.isLoading}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.site_name?.value || ''}
                onChange={(e) => setSettings({ ...settings, site_name: { ...settings.site_name, value: e.target.value } })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={() => handleUpdate('site_name', settings.site_name?.value)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
            <div className="flex gap-2">
              <select
                value={settings.currency?.value || 'USD'}
                onChange={(e) => setSettings({ ...settings, currency: { ...settings.currency, value: e.target.value } })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="NGN">NGN</option>
              </select>
              <button
                onClick={() => handleUpdate('currency', settings.currency?.value)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <div className="flex gap-2">
              <select
                value={settings.timezone?.value || 'UTC'}
                onChange={(e) => setSettings({ ...settings, timezone: { ...settings.timezone, value: e.target.value } })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">EST</option>
                <option value="Europe/London">GMT</option>
                <option value="Africa/Lagos">WAT</option>
              </select>
              <button
                onClick={() => handleUpdate('timezone', settings.timezone?.value)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

