import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UsersRound,
  MessageSquare,
  Video,
  BookOpen,
  Folder,
  TrendingUp,
  BarChart3,
  DollarSign,
  Settings,
  Bell,
  Search,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/overview' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: UsersRound, label: 'Groups', path: '/admin/groups' },
    { icon: MessageSquare, label: 'Chat Monitor', path: '/admin/chat-monitor' },
    { icon: Video, label: 'Live Trainings', path: '/admin/live-trainings' },
    { icon: BookOpen, label: 'Lessons', path: '/admin/lessons' },
    { icon: Folder, label: 'Resources', path: '/admin/resources' },
    { icon: TrendingUp, label: 'Signals', path: '/admin/signals' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: DollarSign, label: 'Finance', path: '/admin/finance' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  // Show "Manage Users" for owner/admin/super_admin
  const userRole = profile?.role?.toLowerCase();
  if (['owner', 'admin', 'super_admin'].includes(userRole)) {
    // Owner should see link to owner dashboard for full user management
    if (userRole === 'owner') {
      menuItems.push({ icon: Users, label: 'Manage Users', path: '/owner/dashboard' });
    } else {
      // Admin and super_admin see admin-users page
      menuItems.push({ icon: Users, label: 'Manage Users', path: '/admin/admin-users' });
    }
  }

  const getInitials = (name) => {
    if (!name || name === 'undefined' || name === 'null') return 'U';
    const nameStr = String(name).trim();
    if (!nameStr) return 'U';
    const parts = nameStr.split(' ').filter(p => p);
    if (parts.length >= 2) {
      const first = parts[0][0] || '';
      const second = parts[1][0] || '';
      return (first + second).toUpperCase() || 'U';
    }
    return nameStr.substring(0, 2).toUpperCase() || 'U';
  };

  const displayName = (profile?.first_name && profile?.last_name)
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : (profile?.email ? profile.email.split('@')[0] : null) || 'User';

  return (
    <div className="min-h-screen bg-[#070A0F]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-[#0B1220] border-r border-[rgba(255,255,255,0.08)] transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-green-500 flex items-center justify-center text-white font-bold">
                FX
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-[#F5F7FF]">Forex Academy</h1>
                  <p className="text-xs text-green-600">Admin Panel</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-md hover:bg-[rgba(255,255,255,0.05)] lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white'
                        : 'text-[#B6C2E2] hover:bg-[rgba(216,181,71,0.1)] hover:text-orange-600'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          {/* User Card */}
          <div className="p-4 border-t border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-500 to-green-500 text-white">
              <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.2)] flex items-center justify-center font-bold">
                {getInitials(displayName)}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{displayName || 'User'}</p>
                  <p className="text-xs text-white/80 uppercase">{(profile?.role && profile.role !== 'undefined') ? profile.role : 'USER'}</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="mt-2 w-full flex items-center gap-2 px-4 py-2 text-sm text-[#B6C2E2] hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0B1220] border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md hover:bg-[rgba(255,255,255,0.05)] lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7E8AAE]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-[rgba(255,255,255,0.12)] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#0F1A2E] text-[#F5F7FF]"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)]">
                <Bell className="w-5 h-5 text-[#B6C2E2]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
                  type="button"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-green-500 flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(displayName)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#F5F7FF]">{displayName || 'User'}</p>
                    <p className="text-xs text-[#7E8AAE] uppercase">{(profile?.role && profile.role !== 'undefined') ? profile.role : 'USER'}</p>
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0B1220] rounded-lg shadow-lg border border-[rgba(255,255,255,0.08)] py-2">
                    <button
                      onClick={() => {
                        navigate('/admin/settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#B6C2E2] hover:bg-[rgba(255,255,255,0.05)]"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/admin/settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#B6C2E2] hover:bg-[rgba(255,255,255,0.05)]"
                    >
                      Settings
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[rgba(239,68,68,0.1)]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

