import React, { useState } from 'react';

interface FlaggedUser {
  name: string;
  username: string;
  trustScore: number;
  avatar: string;
  accountAge: string;
  flaggedAccount: {
    platform: string;
    username: string;
    profileUrl?: string;
  };
  socialAccounts: Array<{
    platform: string;
    username: string;
    verified: boolean;
    profileUrl: string;
  }>;
}

interface FlaggerUser {
  name: string;
  username: string;
  trustScore: number;
  avatar: string;
  flagHistory: {
    flagsSubmitted: number;
    falseFlags: number;
    accuracy: number;
  };
}

interface FlagPackage {
  id: string;
  flaggedUser: FlaggedUser;
  flaggerUser: FlaggerUser;
  flagCategory: string;
  evidence: string;
  verificationInfo: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'denied' | 'need_info';
  mutualFriends: number;
  priority: 'high' | 'medium' | 'low';
}

interface ModeratorInterfaceProps {
  onClose: () => void;
}

const ModeratorInterface: React.FC<ModeratorInterfaceProps> = ({ onClose }) => {
  const [selectedFlag, setSelectedFlag] = useState<FlagPackage | null>(null);
  const [decision, setDecision] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('pending');

  // Sample flag data for testing
  const [flagPackages, setFlagPackages] = useState<FlagPackage[]>([
    {
      id: 'flag_001',
      flaggedUser: {
        name: 'Alex Chen',
        username: '@alexc_dev',
        trustScore: 72,
        avatar: '👨‍💻',
        accountAge: '8 months',
        flaggedAccount: {
          platform: 'GitHub',
          username: 'alex-chen-senior',
          profileUrl: 'https://github.com/alex-chen-senior'
        },
        socialAccounts: [
          { platform: 'LinkedIn', username: 'alex-chen-dev', verified: true, profileUrl: 'https://linkedin.com/in/alex-chen-dev' },
          { platform: 'Twitter', username: '@alexcodes', verified: false, profileUrl: 'https://twitter.com/alexcodes' }
        ]
      },
      flaggerUser: {
        name: 'Sarah Martinez',
        username: '@sarah_m',
        trustScore: 88,
        avatar: '👩‍🔬',
        flagHistory: {
          flagsSubmitted: 12,
          falseFlags: 1,
          accuracy: 92
        }
      },
      flagCategory: 'Account doesn\'t belong to this user',
      evidence: 'This GitHub profile shows 5+ years of senior development experience, but Alex told me he\'s a junior developer who just graduated. The commit history and repositories don\'t match his actual skill level.',
      verificationInfo: '@alexdev2023',
      submittedAt: '2 hours ago',
      status: 'pending',
      mutualFriends: 3,
      priority: 'high'
    },
    {
      id: 'flag_002',
      flaggedUser: {
        name: 'Mike Johnson',
        username: '@mikej_photos',
        trustScore: 65,
        avatar: '📸',
        accountAge: '1 year',
        flaggedAccount: {
          platform: 'Instagram',
          username: 'mike_professional_photos',
          profileUrl: 'https://instagram.com/mike_professional_photos'
        },
        socialAccounts: [
          { platform: 'Facebook', username: 'mike.johnson.photos', verified: false, profileUrl: 'https://facebook.com/mike.johnson.photos' },
          { platform: 'TikTok', username: '@mikephotos', verified: false, profileUrl: 'https://tiktok.com/@mikephotos' }
        ]
      },
      flaggerUser: {
        name: 'Emma Davis',
        username: '@emma_creative',
        trustScore: 91,
        avatar: '🎨',
        flagHistory: {
          flagsSubmitted: 8,
          falseFlags: 0,
          accuracy: 100
        }
      },
      flagCategory: 'Account is fabricated/doesn\'t exist',
      evidence: 'Reverse image search shows these photos are stock images from Shutterstock. The account has 50k followers but engagement rates are suspiciously low. Comments seem to be from bots.',
      verificationInfo: 'Real Instagram should be @mike_j_amateur_photos',
      submittedAt: '5 hours ago',
      status: 'pending',
      mutualFriends: 1,
      priority: 'medium'
    }
  ]);

  const handleDecision = async () => {
    if (!selectedFlag || !decision || explanation.trim().length < 10) return;

    // In a real app, this would make an API call
    console.log('Moderator decision:', {
      flagId: selectedFlag.id,
      decision,
      explanation: explanation.trim()
    });

    // Update the flag status
    setFlagPackages(prev => prev.map(flag => 
      flag.id === selectedFlag.id 
        ? { ...flag, status: decision as any }
        : flag
    ));

    // Reset form
    setSelectedFlag(null);
    setDecision('');
    setExplanation('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'need_info': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFlags = flagPackages.filter(flag => 
    filterStatus === 'all' || flag.status === filterStatus
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Moderator Interface</h1>
            <p className="text-sm text-gray-600">Review and manage flagged connected accounts</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Inbox Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Filter Controls */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
                <option value="need_info">Need More Info</option>
                <option value="all">All Flags</option>
              </select>
            </div>

            {/* Flag List */}
            <div className="flex-1 overflow-y-auto">
              {filteredFlags.map((flag) => (
                <div
                  key={flag.id}
                  onClick={() => setSelectedFlag(flag)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedFlag?.id === flag.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{flag.flaggedUser.avatar}</span>
                      <div>
                        <div className="font-medium text-gray-800">{flag.flaggedUser.name}</div>
                        <div className="text-sm text-gray-600">{flag.flaggedUser.flaggedAccount.platform}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(flag.priority)}`}>
                        {flag.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(flag.status)}`}>
                        {flag.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Category:</strong> {flag.flagCategory}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Flagged by {flag.flaggerUser.name} • {flag.submittedAt}
                  </div>
                  <div className="text-sm text-gray-700 line-clamp-2">
                    {flag.evidence}
                  </div>
                </div>
              ))}
              
              {filteredFlags.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>No flags found for the selected filter.</p>
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="flex-1 flex flex-col">
            {selectedFlag ? (
              <>
                {/* Flag Details */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Flagged User Info */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                        <span className="text-lg mr-2">🚩</span>
                        Flagged User
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{selectedFlag.flaggedUser.avatar}</span>
                          <div>
                            <div className="font-medium text-gray-800">{selectedFlag.flaggedUser.name}</div>
                            <div className="text-sm text-gray-600">{selectedFlag.flaggedUser.username}</div>
                            <div className="text-xs text-gray-500">Account age: {selectedFlag.flaggedUser.accountAge}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                            Trust: {selectedFlag.flaggedUser.trustScore}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                            Mutual: {selectedFlag.mutualFriends}
                          </span>
                        </div>
                        
                        {/* Flagged Account */}
                        <div className="border-t border-red-200 pt-3">
                          <div className="font-medium text-red-800 mb-2">Flagged Account:</div>
                          <div className="bg-white border border-red-200 rounded p-3">
                            <div className="font-medium">{selectedFlag.flaggedUser.flaggedAccount.platform}</div>
                            <div className="text-sm text-gray-600">{selectedFlag.flaggedUser.flaggedAccount.username}</div>
                            {selectedFlag.flaggedUser.flaggedAccount.profileUrl && (
                              <a 
                                href={selectedFlag.flaggedUser.flaggedAccount.profileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                View Profile →
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Other Social Accounts */}
                        <div className="border-t border-red-200 pt-3">
                          <div className="font-medium text-red-800 mb-2">Other Connected Accounts:</div>
                          <div className="space-y-2">
                            {selectedFlag.flaggedUser.socialAccounts.map((account, idx) => (
                              <div key={idx} className="bg-white border border-red-200 rounded p-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-medium">{account.platform}</span>
                                    <span className="text-gray-600 ml-2">{account.username}</span>
                                  </div>
                                  {account.verified && <span className="text-green-600 text-xs">✓ Verified</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Flagger User Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                        <span className="text-lg mr-2">👤</span>
                        Reporting User
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{selectedFlag.flaggerUser.avatar}</span>
                          <div>
                            <div className="font-medium text-gray-800">{selectedFlag.flaggerUser.name}</div>
                            <div className="text-sm text-gray-600">{selectedFlag.flaggerUser.username}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                            Trust: {selectedFlag.flaggerUser.trustScore}
                          </span>
                        </div>
                        
                        {/* Flag History */}
                        <div className="border-t border-blue-200 pt-3">
                          <div className="font-medium text-blue-800 mb-2">Flag History:</div>
                          <div className="bg-white border border-blue-200 rounded p-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Flags Submitted:</span>
                              <span className="font-medium">{selectedFlag.flaggerUser.flagHistory.flagsSubmitted}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>False Flags:</span>
                              <span className="font-medium text-red-600">{selectedFlag.flaggerUser.flagHistory.falseFlags}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Accuracy Rate:</span>
                              <span className="font-medium text-green-600">{selectedFlag.flaggerUser.flagHistory.accuracy}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flag Details */}
                  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Flag Details</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Category:</div>
                        <div className="text-sm text-gray-900">{selectedFlag.flagCategory}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Submitted:</div>
                        <div className="text-sm text-gray-900">{selectedFlag.submittedAt}</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Evidence Provided:</div>
                      <div className="bg-white border border-gray-300 rounded p-3 text-sm text-gray-900">
                        {selectedFlag.evidence}
                      </div>
                    </div>
                    
                    {selectedFlag.verificationInfo && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Verification Info:</div>
                        <div className="bg-white border border-gray-300 rounded p-3 text-sm text-gray-900">
                          {selectedFlag.verificationInfo}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decision Panel */}
                {selectedFlag.status === 'pending' && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h3 className="font-semibold text-gray-800 mb-4">Make Decision</h3>
                    
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <button
                        onClick={() => setDecision('approved')}
                        className={`p-3 rounded-lg border transition-colors ${
                          decision === 'approved'
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        ✅ Approve Flag
                      </button>
                      <button
                        onClick={() => setDecision('denied')}
                        className={`p-3 rounded-lg border transition-colors ${
                          decision === 'denied'
                            ? 'bg-red-100 border-red-300 text-red-800'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        ❌ Deny Flag
                      </button>
                      <button
                        onClick={() => setDecision('need_info')}
                        className={`p-3 rounded-lg border transition-colors ${
                          decision === 'need_info'
                            ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        ℹ️ Need More Info
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation (Required - minimum 10 characters)
                      </label>
                      <textarea
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Explain your decision and reasoning..."
                        minLength={10}
                        required
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {explanation.length}/10 characters minimum
                      </div>
                    </div>

                    <button
                      onClick={handleDecision}
                      disabled={!decision || explanation.trim().length < 10}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        decision && explanation.trim().length >= 10
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Submit Decision
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">📧</div>
                  <p className="text-lg">Select a flag to review</p>
                  <p className="text-sm">Choose a flag from the inbox to see detailed information</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorInterface;