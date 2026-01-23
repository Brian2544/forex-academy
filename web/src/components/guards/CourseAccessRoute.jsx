import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';
import CoursePaywall from '../payments/CoursePaywall';
import { paymentService } from '../../services/payment.service';
import toast from 'react-hot-toast';
import { useState } from 'react';

const CourseAccessRoute = ({ courseLevel, children }) => {
  const { isAuthenticated, profile, loading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const isPrivileged = ['admin', 'super_admin', 'owner', 'content_admin', 'support_admin', 'finance_admin']
    .includes(profile?.role?.toLowerCase());

  const { data: coursesData = [], isLoading } = useQuery({
    queryKey: ['student-courses', courseLevel],
    queryFn: async () => {
      const response = await api.get('/student/courses');
      return response.data.data || [];
    },
    enabled: isAuthenticated,
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const course = coursesData.find((item) => item.level === courseLevel);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center text-white">
        Course not found.
      </div>
    );
  }

  const formatPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(Number(course.price_ngn || 0));

  if (isPrivileged || course.isEntitled) {
    return children;
  }

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      if (import.meta.env.DEV) {
        console.debug('[Paystack] Init payload:', {
          courseId: course.id,
          courseLevel: course.level,
          courseTitle: course.title,
          courseObject: course,
        });
      }
      const response = await paymentService.initializeCoursePayment(course.id, course.level, course.title);
      if (response.success && response.data?.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        toast.error('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment init error:', error);
      toast.error(error.message || error.response?.data?.message || 'Payment initialization failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CoursePaywall
      course={course}
      priceLabel={formatPrice}
      onPay={handlePay}
      isProcessing={isProcessing}
    />
  );
};

export default CourseAccessRoute;
