import React, { useState } from 'react';
import FlagAccountModal from './FlagAccountModal';

interface SocialAccount {
  platform: string;
  username: string;
  verified: boolean;
  icon: string;
  color: string;
  connectedSince: string;
  category: 'social' | 'professional' | 'creative' | 'tech';
  profileUrl?: string;
  flagged?: boolean;
}

interface SocialAccountsModalProps {
  onClose: () => void;
  currentUserTrustScore?: number;
  onFlagSubmission?: (flagData: any) => void;
}

const SocialAccountsModal: React.FC<SocialAccountsModalProps> = ({ onClose, currentUserTrustScore = 75, onFlagSubmission }) => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    // Social Media
    { platform: 'Twitter', username: '@BigStinky', verified: true, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg', color: 'bg-blue-400', connectedSince: 'Mar 2024', category: 'social', profileUrl: 'https://twitter.com/BigStinky' },
    { platform: 'Instagram', username: '@wine_and_code', verified: true, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg', color: 'bg-pink-500', connectedSince: 'Dec 2023', category: 'social', profileUrl: 'https://instagram.com/wine_and_code' },
    { platform: 'Facebook', username: 'Riesling LeFluuf', verified: true, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg', color: 'bg-blue-600', connectedSince: 'Nov 2023', category: 'social', profileUrl: 'https://facebook.com/riesling.lefluuf' },
    { platform: 'Snapchat', username: 'BigStinkySnaps', verified: false, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/snapchat.svg', color: 'bg-yellow-400', connectedSince: 'Jan 2024', category: 'social', profileUrl: 'https://snapchat.com/add/BigStinkySnaps' },
    { platform: 'Discord', username: 'BigStinky#1234', verified: true, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg', color: 'bg-indigo-600', connectedSince: 'Aug 2023', category: 'social', profileUrl: 'https://discord.com/users/BigStinky' },
    { platform: 'Reddit', username: 'u/BigStinkyWines', verified: false, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/reddit.svg', color: 'bg-orange-600', connectedSince: 'Jul 2023', category: 'social', profileUrl: 'https://reddit.com/u/BigStinkyWines' },
    
    // Professional
    { platform: 'LinkedIn', username: 'riesling-lefluuf', verified: true, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg', color: 'bg-blue-700', connectedSince: 'Jan 2024', category: 'professional', profileUrl: 'https://linkedin.com/in/riesling-lefluuf' },
    { platform: 'AngelList', username: 'riesling_startup', verified: true, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/angellist.svg', color: 'bg-gray-900', connectedSince: 'Feb 2024', category: 'professional', profileUrl: 'https://angel.co/u/riesling_startup' },
    { platform: 'Glassdoor', username: 'Riesling L.', verified: false, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/glassdoor.svg', color: 'bg-green-600', connectedSince: 'Dec 2023', category: 'professional', profileUrl: 'https://glassdoor.com/profile/riesling-l' },
    
    // Creative
    { platform: 'TikTok', username: '@BigStinkyWines', verified: false, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tiktok.svg', color: 'bg-gray-900', connectedSince: 'Oct 2023', category: 'creative', profileUrl: 'https://tiktok.com/@BigStinkyWines' },
    { platform: 'YouTube', username: 'Wine & Tech Reviews', verified: true, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg', color: 'bg-red-500', connectedSince: 'Sep 2023', category: 'creative', profileUrl: 'https://youtube.com/c/WineTechReviews' },
    { platform: 'Pinterest', username: 'WineAndTechVibes', verified: false, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/pinterest.svg', color: 'bg-red-600', connectedSince: 'May 2023', category: 'creative', profileUrl: 'https://pinterest.com/WineAndTechVibes' },
    { platform: 'Behance', username: 'riesling_designs', verified: true, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/behance.svg', color: 'bg-blue-500', connectedSince: 'Jun 2023', category: 'creative', profileUrl: 'https://behance.net/riesling_designs' },
    { platform: 'Dribbble', username: 'BigStinkyDesigns', verified: false, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/dribbble.svg', color: 'bg-pink-600', connectedSince: 'Apr 2023', category: 'creative', profileUrl: 'https://dribbble.com/BigStinkyDesigns' },
    
    // Tech
    { platform: 'GitHub', username: 'RieslingCodes', verified: true, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg', color: 'bg-gray-800', connectedSince: 'Feb 2024', category: 'tech', profileUrl: 'https://github.com/RieslingCodes' },
    { platform: 'Stack Overflow', username: 'BigStinkyCoder', verified: true, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/stackoverflow.svg', color: 'bg-orange-500', connectedSince: 'Jan 2024', category: 'tech', profileUrl: 'https://stackoverflow.com/users/BigStinkyCoder' },
    { platform: 'Steam', username: 'BigStinkyGamer', verified: false, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/steam.svg', color: 'bg-gray-700', connectedSince: 'Mar 2024', category: 'tech', profileUrl: 'https://steamcommunity.com/id/BigStinkyGamer' },
    { platform: 'Twitch', username: 'BigStinkyStreams', verified: true, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitch.svg', color: 'bg-purple-600', connectedSince: 'Dec 2023', category: 'tech', profileUrl: 'https://twitch.tv/BigStinkyStreams' },
    { platform: 'Spotify', username: 'BigStinkyPlaylists', verified: false, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spotify.svg', color: 'bg-green-500', connectedSince: 'Nov 2023', category: 'tech', profileUrl: 'https://open.spotify.com/user/BigStinkyPlaylists' },
    { platform: 'Medium', username: '@bigstinky_tech', verified: true, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/medium.svg', color: 'bg-gray-900', connectedSince: 'Oct 2023', category: 'tech', profileUrl: 'https://medium.com/@bigstinky_tech' }
  ]);
  
  const [flagModalOpen, setFlagModalOpen] = useState<boolean>(false);
  const [accountToFlag, setAccountToFlag] = useState<SocialAccount | null>(null);
  
  const handleRemoveAccount = (index: number) => {
    if (confirm('Are you sure you want to remove this account?')) {
      setAccounts(accounts.filter((_, i) => i !== index));
    }
  };

  const handleFlagAccount = (account: SocialAccount) => {
    setAccountToFlag(account);
    setFlagModalOpen(true);
  };

  const handleSubmitFlag = async (flagData: any) => {
    // In a real app, this would make an API call to submit the flag
    console.log('Flag submitted:', flagData);
    
    // Call the parent's flag submission handler if provided
    if (onFlagSubmission) {
      onFlagSubmission(flagData);
    }
    
    // Hide the flagged account temporarily
    setAccounts(prev => prev.map(account => 
      account.platform === flagData.accountId.split('-')[0] && 
      account.username === flagData.accountId.split('-')[1]
        ? { ...account, flagged: true }
        : account
    ));
    
    setFlagModalOpen(false);
    setAccountToFlag(null);
  };

  const renderAccountItem = (account: SocialAccount, index: number) => (
    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-colors">
      <div 
        onClick={() => account.profileUrl && window.open(account.profileUrl, '_blank')}
        className="flex items-center space-x-3 flex-1 cursor-pointer hover:bg-gray-100 -m-3 p-3 rounded-lg"
      >
        <div className={`w-10 h-10 ${account.color} rounded-lg flex items-center justify-center text-white p-2 relative`}>
          {account.icon.startsWith('http') ? (
            <img src={account.icon} alt={account.platform} className="w-6 h-6 filter invert" />
          ) : (
            <span className="text-lg">{account.icon}</span>
          )}
          {account.verified && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
          {account.flagged && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">⚠</span>
            </div>
          )}
        </div>
        <div>
          <div className="font-medium text-gray-800">{account.platform}</div>
          <div className="text-sm text-gray-600">{account.username}</div>
          <div className="text-xs text-gray-500">Connected since {account.connectedSince}</div>
          {account.flagged && (
            <div className="text-xs text-red-600 font-medium">Under review</div>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFlagAccount(account);
          }}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Flag this account"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"></path>
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Connected Accounts</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Connected Accounts by Category */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Social Media */}
          {accounts.filter(a => a.category === 'social' && !a.flagged).length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                📱 Social Media
              </h3>
              <div className="space-y-3">
                {accounts.filter(a => a.category === 'social' && !a.flagged).map((account, index) => 
                  renderAccountItem(account, index)
                )}
              </div>
            </div>
          )}

          {/* Professional */}
          {accounts.filter(a => a.category === 'professional' && !a.flagged).length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                💼 Professional
              </h3>
              <div className="space-y-3">
                {accounts.filter(a => a.category === 'professional' && !a.flagged).map((account, index) => 
                  renderAccountItem(account, index)
                )}
              </div>
            </div>
          )}

          {/* Creative */}
          {accounts.filter(a => a.category === 'creative' && !a.flagged).length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                🎨 Creative & Entertainment
              </h3>
              <div className="space-y-3">
                {accounts.filter(a => a.category === 'creative' && !a.flagged).map((account, index) => 
                  renderAccountItem(account, index)
                )}
              </div>
            </div>
          )}

          {/* Tech */}
          {accounts.filter(a => a.category === 'tech' && !a.flagged).length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                💻 Tech & Development
              </h3>
              <div className="space-y-3">
                {accounts.filter(a => a.category === 'tech' && !a.flagged).map((account, index) => 
                  renderAccountItem(account, index)
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-2">
              Click accounts to visit profiles. Verified accounts boost trust score.
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                <span className="text-green-700">{accounts.filter(a => a.verified && !a.flagged).length} Connected</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                <span className="text-blue-700">{accounts.filter(a => !a.flagged).length} Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flag Modal */}
      {flagModalOpen && accountToFlag && (
        <FlagAccountModal
          account={accountToFlag}
          userTrustScore={currentUserTrustScore}
          onClose={() => {
            setFlagModalOpen(false);
            setAccountToFlag(null);
          }}
          onSubmitFlag={handleSubmitFlag}
        />
      )}
    </div>
  );
};

export default SocialAccountsModal;