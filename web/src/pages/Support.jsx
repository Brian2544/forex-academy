import { Link } from 'react-router-dom';

const Support = () => {
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#F5F7FF] mb-4">Contact & Support</h1>
            <p className="text-[#B6C2E2] text-lg">
              Reach our team for platform guidance, learner support, and account assistance.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-6">
            <section className="card">
              <h2 className="text-xl font-semibold text-[#F5F7FF] mb-3">Support Channels</h2>
              <ul className="text-[#B6C2E2] space-y-2">
                <li>Email: support@sniperfxacademy.com</li>
                <li>General: info@sniperfxacademy.com</li>
                <li>Response window: 24-48 business hours</li>
              </ul>
            </section>
            <section className="card">
              <h2 className="text-xl font-semibold text-[#F5F7FF] mb-3">Need Student Help?</h2>
              <p className="text-[#B6C2E2] mb-3">
                If you are already enrolled, use the student support page for account-level and class-related help.
              </p>
              <Link to="/student/contact" className="btn btn-primary inline-block">
                Open Student Support
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
