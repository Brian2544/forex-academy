import DetailPageLayout from '../../components/dashboard/DetailPageLayout';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getIcon } from '../../utils/icons';
import { useAuth } from '../../context/AuthContext';

const Referral = () => {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const referralCode = profile?.referral_code || 'FX2024-USER';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DetailPageLayout title="Referral System" iconName="referral">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Earn Discounts by Referring Friends</h2>
          <p className="text-gray-300 mb-4">
            Share the academy with friends and earn discounts on your subscription. Both you and your
            referred friend will benefit!
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Your Referral Benefits</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { iconName: 'gift', title: '10% Discount', desc: 'For each successful referral' },
              { iconName: 'community', title: 'Unlimited Referrals', desc: 'No limit on referrals' },
              { iconName: 'referral', title: 'Stack Discounts', desc: 'Discounts accumulate' }
            ].map((item, idx) => {
              const IconComponent = getIcon(item.iconName);
              return (
                <div key={idx} className="bg-[#0B1220] rounded-lg p-4 border border-[rgba(255,255,255,0.08)]">
                  <div className="mb-2 flex justify-center">
                    {IconComponent && (
                      <IconComponent className="w-8 h-8 text-amber-500" />
                    )}
                  </div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)]">
          <h3 className="text-xl font-semibold text-white mb-4">Your Referral Link</h3>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 px-4 py-2 bg-[#0F1A2E] border border-[rgba(255,255,255,0.12)] rounded-lg text-white"
            />
            <button
              onClick={handleCopy}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium transition-colors whitespace-nowrap"
            >
              {copied ? (
                <>
                  {(() => {
                    const CheckIcon = getIcon('check');
                    return CheckIcon ? (
                      <CheckIcon className="w-4 h-4 mr-1 inline" />
                    ) : null;
                  })()}
                  Copied
                </>
              ) : 'Copy Link'}
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            Share this link with friends. When they sign up and subscribe, you'll both get a discount!
          </p>
        </div>

        <div className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)]">
          <h3 className="text-xl font-semibold text-white mb-4">How It Works</h3>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Share Your Referral Link', desc: 'Send your unique referral link to friends and family' },
              { step: '2', title: 'They Sign Up', desc: 'Your friend registers using your referral link' },
              { step: '3', title: 'Both Get Discounts', desc: 'When they subscribe, you both receive a 10% discount' }
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-[#0B1220] font-bold flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-white font-medium mb-1">{item.title}</p>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0B1220] rounded-lg p-6 border border-[rgba(255,255,255,0.08)]">
          <h3 className="text-xl font-semibold text-white mb-4">Your Referral Stats</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#0F1A2E] rounded border border-[rgba(255,255,255,0.05)]">
              <p className="text-3xl font-bold text-amber-500 mb-1">0</p>
              <p className="text-gray-400 text-sm">Total Referrals</p>
            </div>
            <div className="text-center p-4 bg-[#0F1A2E] rounded border border-[rgba(255,255,255,0.05)]">
              <p className="text-3xl font-bold text-amber-500 mb-1">0</p>
              <p className="text-gray-400 text-sm">Active Subscribers</p>
            </div>
            <div className="text-center p-4 bg-[#0F1A2E] rounded border border-[rgba(255,255,255,0.05)]">
              <p className="text-3xl font-bold text-amber-500 mb-1">0%</p>
              <p className="text-gray-400 text-sm">Total Discount</p>
            </div>
          </div>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default Referral;
