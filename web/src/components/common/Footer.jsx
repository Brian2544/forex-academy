import { Link } from 'react-router-dom';
import { getIcon } from '../../utils/icons';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center shadow-md shadow-primary-500/30">
                <span className="text-white font-black text-xl">FX</span>
              </div>
              <div>
                <span className="text-xl font-black text-slate-100">Forex Academy</span>
                <div className="text-xs text-amber-400 font-medium">Learn. Practice. Trade.</div>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Master Forex trading with comprehensive courses, expert mentorship, and real-time signals.
            </p>
          </div>

          <div>
            <h3 className="text-slate-100 font-bold mb-4">Learn</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/live-classes" className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200">
                  Live Classes
                </Link>
              </li>
              <li>
                <Link to="/signals" className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200">
                  Trading Signals
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-100 font-bold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200">
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200">
                  Courses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-100 font-bold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/legal/terms" className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/disclaimer" className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200">
                  Risk Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Forex Trading Academy. All rights reserved.
            </p>
            <p className="text-amber-400 text-xs text-center md:text-right max-w-2xl">
              <span className="inline-flex items-center gap-1">
                {(() => {
                  const WarningIcon = getIcon('warning');
                  return WarningIcon ? (
                    <WarningIcon className="w-3 h-3" />
                  ) : null;
                })()}
                <strong>Risk Disclaimer:</strong>
              </span> Trading forex involves substantial risk of loss. 
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
