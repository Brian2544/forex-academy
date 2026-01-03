import {
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ScaleIcon,
  EnvelopeIcon,
  GiftIcon,
  VideoCameraIcon,
  StarIcon,
  UserIcon,
  SignalIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  TrophyIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import {
  BookOpenIcon as BookOpenSolid,
  AcademicCapIcon as AcademicCapSolid,
  ChartBarIcon as ChartBarSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightSolid,
  DocumentTextIcon as DocumentTextSolid,
  ScaleIcon as ScaleSolid,
  EnvelopeIcon as EnvelopeSolid,
  GiftIcon as GiftSolid,
  VideoCameraIcon as VideoCameraSolid,
  StarIcon as StarSolid,
  UserIcon as UserSolid
} from '@heroicons/react/24/solid';

// Icon mapping for easy replacement
export const IconMap = {
  // Outlined icons (default)
  'book': BookOpenIcon,
  'course': BookOpenIcon,
  'beginner': BookOpenIcon,
  'intermediate': BookOpenIcon,
  'advanced': AcademicCapIcon,
  'graduation': AcademicCapIcon,
  'chart': ChartBarIcon,
  'analysis': ChartBarIcon,
  'question': QuestionMarkCircleIcon,
  'faq': QuestionMarkCircleIcon,
  'chat': ChatBubbleLeftRightIcon,
  'communication': ChatBubbleLeftRightIcon,
  'document': DocumentTextIcon,
  'blog': DocumentTextIcon,
  'legal': ScaleIcon,
  'scale': ScaleIcon,
  'envelope': EnvelopeIcon,
  'email': EnvelopeIcon,
  'contact': EnvelopeIcon,
  'gift': GiftIcon,
  'referral': GiftIcon,
  'video': VideoCameraIcon,
  'live': VideoCameraIcon,
  'webinar': VideoCameraIcon,
  'star': StarIcon,
  'testimonial': StarIcon,
  'user': UserIcon,
  'profile': UserIcon,
  'signal': SignalIcon,
  'presentation': PresentationChartLineIcon,
  'community': UserGroupIcon,
  'trophy': TrophyIcon,
  'clock': ClockIcon,
  'calendar': CalendarIcon,
  'check': CheckCircleIcon,
  'warning': ExclamationTriangleIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-left': ArrowLeftIcon
};

// Solid icon variants
export const SolidIconMap = {
  'book': BookOpenSolid,
  'course': BookOpenSolid,
  'beginner': BookOpenSolid,
  'intermediate': BookOpenSolid,
  'advanced': AcademicCapSolid,
  'graduation': AcademicCapSolid,
  'chart': ChartBarSolid,
  'analysis': ChartBarSolid,
  'question': QuestionMarkCircleSolid,
  'faq': QuestionMarkCircleSolid,
  'chat': ChatBubbleLeftRightSolid,
  'communication': ChatBubbleLeftRightSolid,
  'document': DocumentTextSolid,
  'blog': DocumentTextSolid,
  'legal': ScaleSolid,
  'scale': ScaleSolid,
  'envelope': EnvelopeSolid,
  'email': EnvelopeSolid,
  'contact': EnvelopeSolid,
  'gift': GiftSolid,
  'referral': GiftSolid,
  'video': VideoCameraSolid,
  'live': VideoCameraSolid,
  'webinar': VideoCameraSolid,
  'star': StarSolid,
  'testimonial': StarSolid,
  'user': UserSolid,
  'profile': UserSolid
};

// Icon component for easy usage
export const Icon = ({ name, solid = false, className = "w-6 h-6", ...props }) => {
  const IconComponent = solid ? SolidIconMap[name] : IconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return <IconComponent className={className} {...props} />;
};

// Helper function to get icon component
export const getIcon = (name, solid = false) => {
  return solid ? SolidIconMap[name] : IconMap[name];
};

