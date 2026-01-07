import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  LogOut,
  Menu,
  X,
  CreditCard,
  Shield,
  FileText,
  GraduationCap,
  Radio,
  BarChart,
} from 'lucide-react';
import { PERMISSIONS } from '../utils/permissions';

const OwnerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { profile, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  // Owner has access to everything - all student + all admin sections
  const menuItems = [
    // Student Sections
    {
      section: 'Student',
      items: [
        { icon: GraduationCap, label: 'My Learning', path: '/student/dashboard', permission: PERMISSIONS.VIEW_COURSES },
        { icon: BookOpen, label: 'Courses', path: '/courses', permission: PERMISSIONS.VIEW_COURSES },
        { icon: TrendingUp, label: 'Signals', path: '/signals', permission: PERMISSIONS.VIEW_SIGNALS },
        { icon: Radio, label: 'Live Classes', path: '/live-classes', permission: PERMISSIONS.VIEW_LIVE_CLASSES },
      ],
    },
    // Admin Sections
    {
      section: 'Admin',
      items: [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin/overview', permission: PERMISSIONS.VIEW_ANALYTICS },
        { icon: Users, label: 'Students', path: '/admin/students', permission: PERMISSIONS.MANAGE_USERS },
        { icon: UsersRound, label: 'Groups', path: '/admin/groups', permission: PERMISSIONS.MANAGE_GROUPS },
        { icon: MessageSquare, label: 'Chat Monitor', path: '/admin/chat-monitor', permission: PERMISSIONS.MANAGE_CHAT },
        { icon: Video, label: 'Live Trainings', path: '/admin/live-trainings', permission: PERMISSIONS.MANAGE_LIVE_TRAININGS },
        { icon: BookOpen, label: 'Lessons', path: '/admin/lessons', permission: PERMISSIONS.MANAGE_LESSONS },
        { icon: Folder, label: 'Resources', path: '/admin/resources', permission: PERMISSIONS.MANAGE_RESOURCES },
        { icon: TrendingUp, label: 'Signals', path: '/admin/signals', permission: PERMISSIONS.MANAGE_SIGNALS },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics', permission: PERMISSIONS.VIEW_ANALYTICS },
      ],
    },
    // Owner-Only Sections
    {
      section: 'Owner',
      items: [
        { icon: Users, label: 'Manage Users', path: '/owner/dashboard', permission: PERMISSIONS.ROLE_ADMIN },
        { icon: DollarSign, label: 'Finance', path: '/admin/finance', permission: PERMISSIONS.VIEW_FINANCE },
        { icon: CreditCard, label: 'Billing & Plans', path: '/admin/billing', permission: PERMISSIONS.BILLING_ADMIN },
        { icon: Settings, label: 'System Settings', path: '/admin/settings', permission: PERMISSIONS.SYSTEM_SETTINGS },
      ],
    },
  ];

  const getInitials = (name) => {
    if (!name || name === 'undefined' || name === 'null') return 'O';
    const nameStr = String(name).trim();
    if (!nameStr) return 'O';
    const parts = nameStr.split(' ').filter(p => p);
    if (parts.length >= 2) {
      const first = parts[0][0] || '';
      const second = parts[1][0] || '';
      return (first + second).toUpperCase() || 'O';
    }
    return nameStr.substring(0, 2).toUpperCase() || 'O';
  };

  const displayName = (profile?.first_name && profile?.last_name)
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : (profile?.email ? profile.email.split('@')[0] : null) || 'Owner';

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-[#070A0F] flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-40`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-lg">FX</span>
              </div>
              {sidebarOpen && (
                <div>
                  <div className="text-sm font-bold text-[#F5F7FF]">Forex Academy</div>
                  <div className="text-xs text-[#7E8AAE]">Owner Portal</div>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {menuItems.map((section) => (
              <div key={section.section}>
                {sidebarOpen && (
                  <div className="text-xs font-semibold text-[#7E8AAE] uppercase tracking-wider mb-2 px-2">
                    {section.section}
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            isActive || active
                              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                              : 'text-[#B6C2E2] hover:bg-[rgba(147,51,234,0.1)] hover:text-purple-600'
                          }`
                        }
                        title={!sidebarOpen ? item.label : undefined}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Card */}
          <div className="p-4 border-t border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white mb-2">
              <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.2)] flex items-center justify-center font-bold">
                {getInitials(displayName)}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{displayName || 'Owner'}</p>
                  <p className="text-xs text-white/80 uppercase">Owner</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#B6C2E2] hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;

