import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-800 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/50">
                <span className="text-dark-950 font-black text-xl">FX</span>
              </div>
              <div>
                <span className="text-xl font-black text-white">Forex Academy</span>
                <div className="text-xs text-primary-400 font-medium">Learn. Practice. Trade.</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Master Forex trading with comprehensive courses, expert mentorship, and real-time signals.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Learn</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-primary-500 text-sm transition">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/live-classes" className="text-gray-400 hover:text-primary-500 text-sm transition">
                  Live Classes
                </Link>
              </li>
              <li>
                <Link to="/signals" className="text-gray-400 hover:text-primary-500 text-sm transition">
                  Trading Signals
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-primary-500 text-sm transition">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-500 text-sm transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-400 hover:text-primary-500 text-sm transition">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-primary-500 text-sm transition">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-500 text-sm transition">
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/legal/terms" className="text-gray-400 hover:text-primary-500 text-sm transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="text-gray-400 hover:text-primary-500 text-sm transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/disclaimer" className="text-gray-400 hover:text-primary-500 text-sm transition">
                  Risk Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Forex Trading Academy. All rights reserved.
            </p>
            <p className="text-yellow-400 text-xs text-center md:text-right max-w-2xl">
              <strong>⚠️ Risk Disclaimer:</strong> Trading forex involves substantial risk of loss. 
              Past performance is not indicative of future results. We do not guarantee profits. 
              Only trade with money you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
