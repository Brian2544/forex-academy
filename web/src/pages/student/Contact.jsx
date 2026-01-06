import { useState } from 'react';
import toast from 'react-hot-toast';
import { getIcon } from '../../utils/icons';

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
    
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll respond within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Contact & Support</h1>
          <p className="text-slate-400 mb-8">
            Have questions or need support? We're here to help. Choose your preferred method of contact.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Contact Form</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input w-full h-32 resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/40 transition-all duration-300 disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-100 mb-4">Email Support</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">General Inquiries</p>
                    <a href="mailto:info@forexacademy.com" className="text-amber-400 hover:text-amber-300 font-medium">
                      info@forexacademy.com
                    </a>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Technical Support</p>
                    <a href="mailto:support@forexacademy.com" className="text-amber-400 hover:text-amber-300 font-medium">
                      support@forexacademy.com
                    </a>
                  </div>
                  <div className="mt-4 p-3 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-slate-300 text-sm">
                      <strong className="text-slate-100">Response Time:</strong> We aim to respond within 24 hours
                      during business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-100 mb-4">WhatsApp Support</h3>
                <p className="text-slate-300 mb-4">
                  Get instant support via WhatsApp. Our team is available for quick questions and assistance.
                </p>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/40 transition-all duration-300"
                >
                  Open WhatsApp
                </a>
                <p className="text-slate-400 text-sm mt-3">
                  Available: Monday - Friday, 9 AM - 6 PM EST
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

