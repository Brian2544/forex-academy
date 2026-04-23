import { getIcon } from '../../utils/icons';

const CourseOutlineSection = ({ outline }) => {
  const CheckIcon = getIcon('check');

  return (
    <section className="card">
      <h2 className="text-3xl font-bold text-[#F5F7FF] mb-3">Outline of the Course</h2>
      <p className="text-[#B6C2E2] mb-8">
        A structured 6-level path built to develop technical skill, discipline, and responsible execution.
      </p>

      <div className="space-y-8">
        {outline.map((levelBlock) => (
          <div
            key={levelBlock.level}
            className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0B1220] p-5 md:p-6"
          >
            <h3 className="text-xl md:text-2xl font-bold text-primary-600 mb-5">{levelBlock.level}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {levelBlock.modules.map((module) => (
                <article
                  key={module.title}
                  className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0D1324] p-4"
                >
                  <h4 className="text-lg font-semibold text-[#F5F7FF] mb-3">{module.title}</h4>
                  <ul className="space-y-2">
                    {module.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-[#B6C2E2] text-sm">
                        {CheckIcon ? (
                          <CheckIcon className="w-4 h-4 mt-0.5 text-secondary-500 flex-shrink-0" />
                        ) : (
                          <span className="text-secondary-500">-</span>
                        )}
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseOutlineSection;
