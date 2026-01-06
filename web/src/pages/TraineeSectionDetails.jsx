import { useParams, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import WhatsAppButton from '../components/common/WhatsAppButton';
import { traineeSections } from '../data/traineeSections';
import { getIcon } from '../utils/icons';

const TraineeSectionDetails = () => {
  const { slug } = useParams();
  const section = traineeSections.find(s => s.slug === slug);

  const iconMap = {
    'learning-training': 'course',
    'market-analysis': 'analysis',
    'faqs': 'faq',
    'communication-box': 'communication',
    'blog': 'blog',
    'legal-disclaimer': 'legal',
    'contact-support': 'contact',
    'referral-system': 'referral',
    'live-classes-webinars': 'live',
    'testimonials-success-stories': 'testimonial',
    'profile': 'profile'
  };

  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    skillLevel: 'Intermediate',
    phone: '+1 (555) 123-4567',
    country: 'United States'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  if (!section) {
    return (
      <div className="min-h-screen bg-dark-950">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="card-dark text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Section Not Found</h1>
            <p className="text-gray-400 mb-6">The section you're looking for doesn't exist.</p>
            <Link
              to="/trainees"
              className="inline-flex items-center text-gold-500 hover:text-gold-400 font-medium"
            >
              <span className="mr-2">←</span>
              Back to Professionals Portal
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission to backend
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    // TODO: Implement profile update to backend
    console.log('Profile updated:', profileData);
  };

  const renderItem = (item, index) => {
    // Special rendering for FAQs
    if (section.slug === 'faqs') {
      return (
        <details
          key={index}
          className="bg-dark-800 rounded-lg overflow-hidden mb-4"
          open={openFAQIndex === index}
        >
          <summary
            className="p-6 cursor-pointer flex justify-between items-center hover:bg-dark-700 transition-colors list-none"
            onClick={(e) => {
              e.preventDefault();
              setOpenFAQIndex(openFAQIndex === index ? null : index);
            }}
          >
            <h3 className="text-lg font-semibold text-white pr-4">{item.title}</h3>
            <span className="text-gold-500 text-2xl flex-shrink-0">
              {openFAQIndex === index ? '−' : '+'}
            </span>
          </summary>
          {openFAQIndex === index && (
            <div className="px-6 pb-6">
              <p className="text-gray-300 leading-relaxed mb-3">{item.description}</p>
              <p className="text-gray-300 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </details>
      );
    }

    // Special rendering for Contact & Support
    if (section.slug === 'contact-support' && item.title === 'Contact Form') {
      return (
        <div key={index} className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
          <p className="text-gray-300 mb-4">{item.description}</p>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="input min-h-[120px] resize-none"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      );
    }

    // Special rendering for Live Classes & Webinars
    if (section.slug === 'live-classes-webinars') {
      const upcomingSessions = [
        { date: '2024-01-15', time: '10:00 AM', title: 'Beginner Trading Basics', instructor: 'John Smith', type: 'Live Class' },
        { date: '2024-01-17', time: '2:00 PM', title: 'Intermediate Strategies', instructor: 'Sarah Johnson', type: 'Live Class' },
        { date: '2024-01-20', time: '11:00 AM', title: 'Market Analysis Deep Dive', instructor: 'Mike Williams', type: 'Webinar' },
        { date: '2024-01-22', time: '3:00 PM', title: 'Advanced Risk Management', instructor: 'Emily Davis', type: 'Live Class' },
        { date: '2024-01-25', time: '10:00 AM', title: 'Q&A Session with Experts', instructor: 'Multiple', type: 'Webinar' }
      ];

      return (
        <div key={index} className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
          <p className="text-gray-300 mb-6">{item.description}</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-dark-800">
                  <th className="px-4 py-3 text-left text-gold-500 font-semibold border-b border-dark-700">Date</th>
                  <th className="px-4 py-3 text-left text-gold-500 font-semibold border-b border-dark-700">Time</th>
                  <th className="px-4 py-3 text-left text-gold-500 font-semibold border-b border-dark-700">Title</th>
                  <th className="px-4 py-3 text-left text-gold-500 font-semibold border-b border-dark-700">Instructor</th>
                  <th className="px-4 py-3 text-left text-gold-500 font-semibold border-b border-dark-700">Type</th>
                </tr>
              </thead>
              <tbody>
                {upcomingSessions.map((session, idx) => (
                  <tr key={idx} className="border-b border-dark-700 hover:bg-dark-800 transition-colors">
                    <td className="px-4 py-3 text-gray-300">{session.date}</td>
                    <td className="px-4 py-3 text-gray-300">{session.time}</td>
                    <td className="px-4 py-3 text-white font-medium">{session.title}</td>
                    <td className="px-4 py-3 text-gray-300">{session.instructor}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        session.type === 'Live Class' 
                          ? 'bg-gold-500/20 text-gold-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {session.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Special rendering for Profile - Details of the Professional
    if (section.slug === 'profile' && item.title === 'Details of the Professional') {
      return (
        <div key={index} className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
          <p className="text-gray-300 mb-6">{item.description}</p>
          <div className="bg-dark-800 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-dark-700">
              <span className="text-gray-400">Name:</span>
              <span className="text-white font-medium">{profileData.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dark-700">
              <span className="text-gray-400">Email:</span>
              <span className="text-white font-medium">{profileData.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dark-700">
              <span className="text-gray-400">Skill Level:</span>
              <span className="text-gold-500 font-medium">{profileData.skillLevel}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dark-700">
              <span className="text-gray-400">Phone:</span>
              <span className="text-white font-medium">{profileData.phone}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Country:</span>
              <span className="text-white font-medium">{profileData.country}</span>
            </div>
          </div>
          {item.bullets && item.bullets.length > 0 && (
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mt-4">
              {item.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="leading-relaxed">{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    // Special rendering for Profile - Slot for Changing the Details
    if (section.slug === 'profile' && item.title === 'Slot for Changing the Details') {
      return (
        <div key={index} className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
          <p className="text-gray-300 mb-6">{item.description}</p>
          {!isEditingProfile ? (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="btn btn-primary"
            >
              Edit Details
            </button>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Skill Level</label>
                <select
                  value={profileData.skillLevel}
                  onChange={(e) => setProfileData({ ...profileData, skillLevel: e.target.value })}
                  className="input"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Country</label>
                <input
                  type="text"
                  value={profileData.country}
                  onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                  className="input"
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          {item.bullets && item.bullets.length > 0 && (
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mt-4">
              {item.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="leading-relaxed">{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    // Default rendering for other items
    return (
      <div key={index} className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
        <p className="text-gray-300 mb-4 leading-relaxed">{item.description}</p>
        {item.bullets && item.bullets.length > 0 && (
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            {item.bullets.map((bullet, bulletIndex) => (
              <li key={bulletIndex} className="leading-relaxed">{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Link */}
          <Link
            to="/trainees"
            className="inline-flex items-center text-accent-400 hover:text-accent-300 mb-6 transition-colors group"
          >
          {(() => {
            const ArrowIcon = getIcon('arrow-left');
            return ArrowIcon ? (
              <ArrowIcon className="w-5 h-5 mr-2" />
            ) : (
              <span className="mr-2">←</span>
            );
          })()}
          Back to Professionals Page
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg gradient-gold flex items-center justify-center">
              {(() => {
                const iconName = iconMap[section.slug] || 'document';
                const IconComponent = getIcon(iconName);
                return IconComponent ? (
                  <IconComponent className="w-8 h-8 text-dark-950" />
                ) : null;
              })()}
            </div>
            <h1 className="text-4xl font-bold text-white">{section.title}</h1>
          </div>
          <p className="text-gray-400 text-lg">{section.shortDescription}</p>
        </div>

        {/* Content */}
        <div className="card-dark">
          <div className="space-y-8">
            {section.items.map((item, index) => renderItem(item, index))}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TraineeSectionDetails;

