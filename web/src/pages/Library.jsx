import { Link } from 'react-router-dom';

const libraryItems = [
  {
    title: 'Trading PDFs & Worksheets',
    description: 'Download practical worksheets, checklists, and study notes for structured learning.',
  },
  {
    title: 'Recorded Webinars & Replays',
    description: 'Access replay sessions to review lessons, planning frameworks, and market breakdowns.',
  },
  {
    title: 'E-books & Study Manuals',
    description: 'Reference materials covering core concepts, risk control, and strategy execution.',
  },
];

const Library = () => {
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#F5F7FF] mb-4">Books, Resources & Learning Library</h1>
            <p className="text-[#B6C2E2] text-lg">
              A centralized repository for educational materials, replay sessions, and study assets.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {libraryItems.map((item) => (
              <article key={item.title} className="card">
                <h2 className="text-xl font-semibold text-[#F5F7FF] mb-3">{item.title}</h2>
                <p className="text-[#B6C2E2]">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="card text-center">
            <p className="text-[#B6C2E2] mb-4">
              Logged-in learners can access resource files from the student dashboard library.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/student/resources" className="btn btn-primary">
                Open Student Library
              </Link>
              <Link to="/live-classes" className="btn btn-outline">
                View Webinar & Replay Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
