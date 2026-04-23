import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import LearningCourseView from '../../components/dashboard/LearningCourseView';
import { learningCatalog } from '../../data/learningCatalog';

const AdvancedCourse = () => {
  return (
    <DetailPageLayout title="Advanced Course" iconName="advanced">
      <LearningCourseView courseLevel="advanced" config={learningCatalog.advanced} />
    </DetailPageLayout>
  );
};

export default AdvancedCourse;

