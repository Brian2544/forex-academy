import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { getIcon } from '../../utils/icons';

const Communication = () => {
  return (
    <DetailPageLayout title="Communication Hub" iconName="communication">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Connect with the Community</h2>
          <p className="text-gray-300 mb-4">
            Join discussions, get updates, ask questions, and connect with other traders and our support team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-dark-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Member-Only Discussion Forums</h3>
            <p className="text-gray-300 mb-4">
              Engage with fellow traders in our exclusive member forums. Share strategies, ask questions,
              and learn from experienced traders.
            </p>
            <ul className="space-y-2 text-gray-300 text-sm mb-4">
              <li>• Strategy discussions</li>
              <li>• Trade analysis and reviews</li>
              <li>• Market insights sharing</li>
              <li>• Peer support and mentorship</li>
            </ul>
            <button className="btn-primary w-full">Access Forums</button>
          </div>

          <div className="bg-dark-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Announcements & Updates</h3>
            <p className="text-gray-300 mb-4">
              Stay informed about new courses, webinars, platform updates, and important news.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-dark-800 rounded">
                <p className="text-white font-medium text-sm">New Advanced Course Module Available</p>
                <p className="text-gray-400 text-xs mt-1">2 days ago</p>
              </div>
              <div className="p-3 bg-dark-800 rounded">
                <p className="text-white font-medium text-sm">Weekly Webinar: Risk Management</p>
                <p className="text-gray-400 text-xs mt-1">5 days ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Q&A Section</h3>
          <p className="text-gray-300 mb-4">
            Have questions? Browse answered questions or ask your own. Our team and community members
            are here to help.
          </p>
          <div className="flex gap-4">
            <button className="btn-primary">Browse Q&A</button>
            <button className="btn-secondary">Ask a Question</button>
          </div>
        </div>

        <div className="bg-dark-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Direct Support Contact</h3>
          <p className="text-gray-300 mb-4">
            Need immediate assistance? Contact our support team directly.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {(() => {
                const EnvelopeIcon = getIcon('envelope');
                return EnvelopeIcon ? (
                  <EnvelopeIcon className="w-8 h-8 text-primary-500" />
                ) : null;
              })()}
              <div>
                <p className="text-white font-medium">Email Support</p>
                <p className="text-gray-400 text-sm">support@forexacademy.com</p>
                <p className="text-gray-500 text-xs">Response time: Within 24 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(() => {
                const ChatIcon = getIcon('chat');
                return ChatIcon ? (
                  <ChatIcon className="w-8 h-8 text-primary-500" />
                ) : null;
              })()}
              <div>
                <p className="text-white font-medium">WhatsApp Channel</p>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-400 inline-flex items-center gap-1">
                  Join WhatsApp Channel
                  {(() => {
                    const ArrowIcon = getIcon('arrow-right');
                    return ArrowIcon ? (
                      <ArrowIcon className="w-4 h-4" />
                    ) : (
                      <span>→</span>
                    );
                  })()}
                </a>
                <p className="text-gray-500 text-xs">Get instant updates and support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default Communication;

