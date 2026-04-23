import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import LearningCourseView from '../../components/dashboard/LearningCourseView';
import { learningCatalog } from '../../data/learningCatalog';

const BeginnerCourse = () => {
  return (
    <DetailPageLayout title="Beginner Course" iconName="beginner">
      <LearningCourseView courseLevel="beginner" config={learningCatalog.beginner} />
    </DetailPageLayout>
  );
};

export default BeginnerCourse;

