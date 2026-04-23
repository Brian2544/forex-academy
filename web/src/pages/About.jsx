import { Link } from 'react-router-dom';
import { BRAND } from '../data/publicContent';

const About = () => {
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-[#F5F7FF] mb-4">About {BRAND.name}</h1>
            <p className="text-[#B6C2E2] text-lg">{BRAND.slogan}</p>
          </header>

          <section className="card space-y-4">
            <h2 className="text-2xl font-semibold text-[#F5F7FF]">Our Mission</h2>
            <p className="text-[#B6C2E2]">
              {BRAND.name} exists to deliver structured, responsible, and practical forex education. We focus
              on disciplined execution, risk management, and continuous learning rather than speculation.
            </p>
            <p className="text-[#B6C2E2]">
              Our training model is designed for beginners and developing traders who want a reliable path
              from foundational knowledge to professional trading practices.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-[#F5F7FF] mb-3">What We Teach</h3>
              <ul className="text-[#B6C2E2] space-y-2">
                <li>Structured level-based curriculum</li>
                <li>Technical and fundamental analysis</li>
                <li>Risk management and trading psychology</li>
                <li>Strategy development and journaling</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-[#F5F7FF] mb-3">Who We Serve</h3>
              <ul className="text-[#B6C2E2] space-y-2">
                <li>Beginners starting from scratch</li>
                <li>Intermediate traders refining systems</li>
                <li>Self-paced learners</li>
                <li>Market-focused education seekers</li>
              </ul>
            </div>
          </section>

          <div className="text-center">
            <Link to="/courses" className="btn btn-primary inline-block">
              View Course Structure
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
