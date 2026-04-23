import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import LearningCourseView from '../../components/dashboard/LearningCourseView';
import { learningCatalog } from '../../data/learningCatalog';

const IntermediateCourse = () => {
  return (
    <DetailPageLayout title="Intermediate Course" iconName="intermediate">
      <LearningCourseView courseLevel="intermediate" config={learningCatalog.intermediate} />
    </DetailPageLayout>
  );
};

export default IntermediateCourse;

