import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getIcon } from '../utils/icons';
import api from '../services/api';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const isAdmin = user?.role && ['ADMIN', 'SUPER_ADMIN', 'OWNER', 'INSTRUCTOR'].includes(user.role);
  const isStudent = user?.role === 'STUDENT';

  // Navigation items based on role
  const getNavItems = () => {
    if (isAdmin) {
      return [
        { path: '/admin/dashboard', label: 'Overview', icon: 'dashboard' },
        { path: '/admin/students', label: 'Students', icon: 'user' },
        { path: '/admin/groups', label: 'Groups', icon: 'group' },
        { path: '/admin/chat-monitor', label: 'Chat Monitor', icon: 'chat' },
        { path: '/admin/trainings', label: 'Live Trainings', icon: 'live' },
        { path: '/admin/lessons', label: 'Lessons', icon: 'course' },
        { path: '/admin/resources', label: 'Resources', icon: 'resource' },
        { path: '/admin/signals', label: 'Signals', icon: 'signal' },
        { path: '/admin/analytics', label: 'Analytics', icon: 'analysis' },
        ...(user?.role === 'SUPER_ADMIN' || user?.role === 'OWNER' ? [
          { path: '/admin/finance', label: 'Finance', icon: 'finance' },
        ] : []),
        ...(user?.role === 'OWNER' || user?.role === 'SUPER_ADMIN' ? [
          { path: '/admin/settings', label: 'Settings', icon: 'settings' },
        ] : []),
      ];
    } else if (isStudent) {
      return [
        { path: '/student/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '/student/groups', label: 'My Groups', icon: 'group' },
        { path: '/student/trainings', label: 'Live Classes', icon: 'live' },
        { path: '/student/lessons', label: 'Lessons', icon: 'course' },
        { path: '/student/resources', label: 'Resources', icon: 'resource' },
        { path: '/student/signals', label: 'Signals', icon: 'signal' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 bg-[#121B33] border-r border-[rgba(255,255,255,0.08)] shadow-lg`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-[rgba(255,255,255,0.08)]">
            <Link to={isAdmin ? '/admin/dashboard' : '/student/dashboard'} className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-md shadow-primary-500/30">
                <span className="text-white font-black text-lg">FX</span>
              </div>
              <div>
                <span className="text-lg font-black text-[#F5F7FF]">Forex Academy</span>
                <div className="text-xs text-secondary-600 font-medium">
                  {isAdmin ? 'Admin Panel' : 'Student Portal'}
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const IconComponent = getIcon(item.icon);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'text-[#B6C2E2] hover:bg-[rgba(216,181,71,0.1)] hover:text-primary-600'
                  }`}
                >
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center space-x-3 px-4 py-3 bg-[#0D1324] rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#F5F7FF] truncate">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-[#B6C2E2] capitalize">{user?.role || 'Student'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-2 px-4 py-2 text-sm text-[#B6C2E2] hover:text-primary-600 hover:bg-[rgba(216,181,71,0.1)] rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-[#121B33]/95 backdrop-blur-lg border-b border-[rgba(255,255,255,0.08)] shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-[#B6C2E2] hover:text-primary-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-[#0D1324] border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-[#F5F7FF]"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7E8AAE]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-[#B6C2E2] hover:text-primary-600 hover:bg-[rgba(216,181,71,0.1)] rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
                )}
              </button>

              {/* Profile Menu */}
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-[rgba(216,181,71,0.1)] rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-[#B6C2E2]">
                    {user?.name || user?.email?.split('@')[0] || 'User'}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

