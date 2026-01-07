import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/guards/ProtectedRoute';
import RoleRoute from '../components/guards/RoleRoute';
import OnboardingGuard from '../components/guards/OnboardingGuard';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import ProtectedLayout from '../layouts/ProtectedLayout';
import AdminLayout from '../layouts/AdminLayout';
import OwnerLayout from '../layouts/OwnerLayout';

// Public Pages
import Home from '../pages/Home';
import Courses from '../pages/Courses';
import SignalsPage from '../pages/Signals';
import LiveClasses from '../pages/LiveClasses';
import Pricing from '../pages/Pricing';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Onboarding from '../pages/Onboarding';
import Terms from '../pages/legal/Terms';
import Privacy from '../pages/legal/Privacy';
import Disclaimer from '../pages/legal/Disclaimer';

// Admin Pages
import AdminOverview from '../pages/admin/Overview';
import Students from '../pages/admin/Students';
import Groups from '../pages/admin/Groups';
import ChatMonitor from '../pages/admin/ChatMonitor';
import LiveTrainings from '../pages/admin/LiveTrainings';
import Lessons from '../pages/admin/Lessons';
import Resources from '../pages/admin/Resources';
import Signals from '../pages/admin/Signals';
import Analytics from '../pages/admin/Analytics';
import Finance from '../pages/admin/Finance';
import Settings from '../pages/admin/Settings';
import AdminUsers from '../pages/admin/AdminUsers';
import Billing from '../pages/Billing';

// Owner Pages
import OwnerDashboard from '../pages/owner/OwnerDashboard';

// Student & Instructor Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import StudentFAQs from '../pages/student/FAQs';
import StudentContact from '../pages/student/Contact';
import StudentTestimonials from '../pages/student/Testimonials';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Use PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/signals" element={<SignalsPage />} />
        <Route path="/live-classes" element={<LiveClasses />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/legal/terms" element={<Terms />} />
        <Route path="/legal/privacy" element={<Privacy />} />
        <Route path="/legal/disclaimer" element={<Disclaimer />} />
      </Route>

      {/* Onboarding - Only accessible if authenticated but profile incomplete */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingGuard>
              <Onboarding />
            </OnboardingGuard>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Use ProtectedLayout */}
      <Route element={<ProtectedLayout />}>
        {/* Owner Routes - Use OwnerLayout */}
        <Route
          path="/owner"
          element={
            <RoleRoute roles={['owner']}>
              <OwnerLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RoleRoute roles={['admin', 'super_admin', 'owner', 'content_admin', 'support_admin', 'finance_admin']}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<Students />} />
          <Route path="groups" element={<Groups />} />
          <Route path="chat-monitor" element={<ChatMonitor />} />
          <Route path="live-trainings" element={<LiveTrainings />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="resources" element={<Resources />} />
          <Route path="signals" element={<Signals />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="finance" element={<Finance />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="admin-users"
            element={
              <RoleRoute roles={['owner', 'super_admin']}>
                <AdminUsers />
              </RoleRoute>
            }
          />
        </Route>

        {/* Instructor Routes */}
        <Route
          path="/instructor/overview"
          element={
            <RoleRoute roles={['instructor']}>
              <InstructorDashboard />
            </RoleRoute>
          }
        />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/faqs" element={<StudentFAQs />} />
        <Route path="/student/contact" element={<StudentContact />} />
        <Route path="/student/testimonials" element={<StudentTestimonials />} />

        {/* Billing Route - Protected but no role check */}
        <Route path="/billing" element={<Billing />} />
        <Route path="/billing/success" element={<Billing />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
