import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll respond within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <DetailPageLayout title="Contact & Support" iconName="contact">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Get in Touch</h2>
          <p className="text-neutral-600 mb-4">
            Have questions or need support? We're here to help. Choose your preferred method of contact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Contact Form</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input w-full"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input w-full"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input w-full"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input w-full h-32 resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Email Support</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-neutral-600 text-sm mb-1">General Inquiries</p>
                  <a href="mailto:info@forexacademy.com" className="text-primary-600 hover:text-primary-700 font-medium link-primary">
                    info@forexacademy.com
                  </a>
                </div>
                <div>
                  <p className="text-neutral-600 text-sm mb-1">Technical Support</p>
                  <a href="mailto:support@forexacademy.com" className="text-primary-600 hover:text-primary-700 font-medium link-primary">
                    support@forexacademy.com
                  </a>
                </div>
                <div className="mt-4 p-3 bg-primary-50 rounded border border-primary-100">
                  <p className="text-neutral-700 text-sm">
                    <strong className="text-neutral-900">Response Time:</strong> We aim to respond within 24 hours
                    during business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-dark-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">WhatsApp Support</h3>
              <p className="text-gray-300 mb-4">
                Get instant support via WhatsApp. Our team is available for quick questions and assistance.
              </p>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-primary"
              >
                {(() => {
                  const ChatIcon = getIcon('chat');
                  return ChatIcon ? (
                    <ChatIcon className="w-5 h-5" />
                  ) : null;
                })()}
                Open WhatsApp
              </a>
              <p className="text-gray-400 text-sm mt-3">
                Available: Monday - Friday, 9 AM - 6 PM EST
              </p>
            </div>
          </div>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default Contact;

