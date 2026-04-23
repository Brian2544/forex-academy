import { Link, useParams } from 'react-router-dom';
import { COURSE_OUTLINE } from '../data/publicContent';

const courseLevelMap = {
  foundations: 'Level 1: Forex Foundations',
  'technical-analysis': 'Level 2: Technical Analysis',
  'fundamentals-market-drivers': 'Level 3: Fundamental Analysis & Market Drivers',
  'risk-psychology': 'Level 4: Risk Management & Trading Psychology',
  'strategy-development': 'Level 5: Strategy Development',
  'professional-practices': 'Level 6: Professional Trading Practices',
};

const CourseDetails = () => {
  const { levelSlug } = useParams();
  const levelTitle = courseLevelMap[levelSlug];
  const levelData = COURSE_OUTLINE.find((item) => item.level === levelTitle);

  if (!levelData) {
    return (
      <div className="min-h-screen bg-[#0A0E1A]">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-3xl mx-auto card text-center">
            <h1 className="text-3xl font-bold text-[#F5F7FF] mb-3">Course level not found</h1>
            <p className="text-[#B6C2E2] mb-5">Please choose a valid course level from the main courses page.</p>
            <Link to="/courses" className="btn btn-primary inline-block">
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-[#F5F7FF] mb-3">{levelData.level}</h1>
            <p className="text-[#B6C2E2]">
              Detailed module breakdown with practical topics for structured skill development.
            </p>
          </header>

          <div className="space-y-5">
            {levelData.modules.map((module) => (
              <article key={module.title} className="card">
                <h2 className="text-2xl font-semibold text-[#F5F7FF] mb-3">{module.title}</h2>
                <ul className="space-y-2 text-[#B6C2E2]">
                  {module.topics.map((topic) => (
                    <li key={topic}>- {topic}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
