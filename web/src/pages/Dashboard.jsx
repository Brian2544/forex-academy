import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await api.get('/health');
      setHealthStatus(response.data);
    } catch (error) {
      setHealthStatus({ ok: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-400">
            Continue your learning journey
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Backend Connection Status</h2>
          {healthStatus?.ok ? (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Backend Connected</span>
              <span className="text-gray-400 text-sm">({healthStatus.time})</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-red-400 font-medium">Backend Connection Failed</span>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-4">Your Profile</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="text-white">{user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Role:</span>
              <span className="text-white">{user?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Verified:</span>
              <span className={user?.isVerified ? 'text-green-400' : 'text-yellow-400'}>
                {user?.isVerified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
