import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

// Pages
import Home from '../pages/Home';
import Courses from '../pages/Courses';
import Dashboard from '../pages/Dashboard';
import Signals from '../pages/Signals';
import LiveClasses from '../pages/LiveClasses';
import Pricing from '../pages/Pricing';
import Profile from '../pages/Profile';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import VerifyEmail from '../pages/VerifyEmail';
import Terms from '../pages/legal/Terms';
import Privacy from '../pages/legal/Privacy';
import Disclaimer from '../pages/legal/Disclaimer';
import Trainees from '../pages/Trainees';
import TraineeSectionDetails from '../pages/TraineeSectionDetails';

// Dashboard Detail Pages
import BeginnerCourse from '../pages/dashboard/BeginnerCourse';
import IntermediateCourse from '../pages/dashboard/IntermediateCourse';
import AdvancedCourse from '../pages/dashboard/AdvancedCourse';
import MarketAnalysis from '../pages/dashboard/MarketAnalysis';
import FAQs from '../pages/dashboard/FAQs';
import Communication from '../pages/dashboard/Communication';
import Blog from '../pages/dashboard/Blog';
import Legal from '../pages/dashboard/Legal';
import Contact from '../pages/dashboard/Contact';
import Referral from '../pages/dashboard/Referral';
import LiveClassesDetail from '../pages/dashboard/LiveClasses';
import Testimonials from '../pages/dashboard/Testimonials';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<Courses />} />
      <Route path="/signals" element={<Signals />} />
      <Route path="/live-classes" element={<LiveClasses />} />
      <Route path="/pricing" element={<Pricing />} />
      
      {/* Trainees Routes */}
      <Route path="/trainees" element={<Trainees />} />
      <Route path="/trainees/:slug" element={<TraineeSectionDetails />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/beginner-course"
        element={
          <PrivateRoute>
            <BeginnerCourse />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/intermediate-course"
        element={
          <PrivateRoute>
            <IntermediateCourse />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/advanced-course"
        element={
          <PrivateRoute>
            <AdvancedCourse />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/market-analysis"
        element={
          <PrivateRoute>
            <MarketAnalysis />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/faqs"
        element={
          <PrivateRoute>
            <FAQs />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/communication"
        element={
          <PrivateRoute>
            <Communication />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/blog"
        element={
          <PrivateRoute>
            <Blog />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/legal"
        element={
          <PrivateRoute>
            <Legal />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/contact"
        element={
          <PrivateRoute>
            <Contact />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/referral"
        element={
          <PrivateRoute>
            <Referral />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/live-classes"
        element={
          <PrivateRoute>
            <LiveClassesDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/testimonials"
        element={
          <PrivateRoute>
            <Testimonials />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      
      {/* Legal Routes */}
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      <Route path="/legal/disclaimer" element={<Disclaimer />} />
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
