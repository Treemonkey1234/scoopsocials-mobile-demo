import React, { useState } from 'react';

interface SocialAccount {
  platform: string;
  username: string;
  verified: boolean;
  icon: string;
  color: string;
  connectedSince: string;
  category: 'social' | 'professional' | 'creative' | 'tech';
  profileUrl?: string;
}

interface FlagAccountModalProps {
  account: SocialAccount;
  userTrustScore: number;
  onClose: () => void;
  onSubmitFlag: (flagData: FlagSubmission) => void;
}

interface FlagSubmission {
  accountId: string;
  category: string;
  evidence: string;
  actualProfileUrl: string;
  flaggedUserName: string;
}

const FlagAccountModal: React.FC<FlagAccountModalProps> = ({ 
  account, 
  userTrustScore, 
  onClose, 
  onSubmitFlag 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [evidence, setEvidence] = useState<string>('');
  const [actualProfileUrl, setActualProfileUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConsequences, setShowConsequences] = useState<boolean>(false);

  const flagCategories = [
    {
      id: 'not_user_account',
      label: 'Account doesn\'t belong to this user',
      description: 'This social media account belongs to someone else'
    },
    {
      id: 'fabricated_account',
      label: 'Account is fabricated/doesn\'t exist',
      description: 'This account appears to be fake or non-existent'
    },
    {
      id: 'exists_not_connected',
      label: 'Account exists but not connected to user',
      description: 'The account exists but isn\'t actually owned by this user'
    },
    {
      id: 'misleading_professional',
      label: 'Misleading professional account',
      description: 'Professional credentials or status are misrepresented'
    }
  ];

  const getDailyFlagLimit = (trustScore: number): number => {
    if (trustScore >= 90) return 5;
    if (trustScore >= 70) return 3;
    if (trustScore >= 50) return 2;
    return 1;
  };

  const dailyLimit = getDailyFlagLimit(userTrustScore);

  const validateForm = (): boolean => {
    return selectedCategory !== '' && 
           evidence.trim().length >= 20 && 
           actualProfileUrl.trim().length > 0 &&
           actualProfileUrl.startsWith('http');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    const flagData: FlagSubmission = {
      accountId: `${account.platform}-${account.username}`,
      category: selectedCategory,
      evidence: evidence.trim(),
      actualProfileUrl: actualProfileUrl.trim(),
      flaggedUserName: account.username
    };

    try {
      await onSubmitFlag(flagData);
      onClose();
    } catch (error) {
      console.error('Error submitting flag:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Flag Account</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Account Info */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${account.color} rounded-lg flex items-center justify-center text-white p-2 relative`}>
              {account.icon.startsWith('http') ? (
                <img src={account.icon} alt={account.platform} className="w-6 h-6 filter invert" />
              ) : (
                <span className="text-lg">{account.icon}</span>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-800">{account.platform}</div>
              <div className="text-sm text-gray-600">{account.username}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Daily Limit Warning */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              <strong>Daily Flag Limit:</strong> {dailyLimit} flags per day (based on your {userTrustScore} trust score)
            </div>
          </div>

          {/* Flag Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Why are you flagging this account? *
            </label>
            <div className="space-y-2">
              {flagCategories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-3">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      name="flagCategory"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{category.label}</div>
                      <div className="text-sm text-gray-600">{category.description}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Commentary */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evidence/Commentary * (minimum 20 characters)
            </label>
            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Provide specific details about why you believe this account should be flagged..."
              minLength={20}
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              {evidence.length}/20 characters minimum
            </div>
          </div>

          {/* Actual Profile URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actual Profile URL for Verification *
            </label>
            <input
              type="url"
              value={actualProfileUrl}
              onChange={(e) => setActualProfileUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://..."
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              Provide the real profile URL to help moderators verify
            </div>
          </div>

          {/* Consequences Warning */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowConsequences(!showConsequences)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {showConsequences ? 'Hide' : 'Show'} consequences of false flagging
            </button>
            
            {showConsequences && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm text-red-800">
                  <strong>False Flag Consequences:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>1st offense: Warning + 5 point trust score reduction</li>
                    <li>2nd offense: Warning + 10 point trust score reduction</li>
                    <li>3rd+ offenses: Warning + 15+ point trust score reduction</li>
                    <li>Low trust scores restrict posting/commenting about others</li>
                    <li>May lose access to groups with trust score minimums</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!validateForm() || isSubmitting}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                validateForm() && !isSubmitting
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Flag'}
            </button>
          </div>
          <div className="text-xs text-gray-600 text-center mt-2">
            Flags are reviewed by moderators within 1-3 days
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagAccountModal;