import React, { useState } from 'react';

interface SocialAccount {
  platform: string;
  username: string;
  verified: boolean;
  icon: string;
  color: string;
}

interface SocialAccountsModalProps {
  onClose: () => void;
}

const SocialAccountsModal: React.FC<SocialAccountsModalProps> = ({ onClose }) => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { platform: 'Twitter', username: '@BigStinky', verified: true, icon: '🐦', color: 'bg-blue-400' },
    { platform: 'LinkedIn', username: 'riesling-lefluuf', verified: true, icon: '💼', color: 'bg-blue-600' },
    { platform: 'Instagram', username: '@wine_and_code', verified: true, icon: '📸', color: 'bg-pink-500' },
    { platform: 'GitHub', username: 'RieslingCodes', verified: true, icon: '👨‍💻', color: 'bg-gray-800' },
    { platform: 'TikTok', username: '@BigStinkyWines', verified: false, icon: '🎵', color: 'bg-gray-900' },
    { platform: 'YouTube', username: 'Wine & Tech Reviews', verified: true, icon: '🎥', color: 'bg-red-500' },
    { platform: 'Discord', username: 'BigStinky#1337', verified: true, icon: '🎮', color: 'bg-indigo-600' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const availablePlatforms = [
    { name: 'Twitter', icon: '🐦' },
    { name: 'Facebook', icon: '👥' },
    { name: 'TikTok', icon: '🎵' },
    { name: 'Snapchat', icon: '👻' },
    { name: 'Discord', icon: '🎮' },
    { name: 'Twitch', icon: '🎮' }
  ];

  const handleAddAccount = () => {
    if (newPlatform && newUsername) {
      const platformColors = {
        'Twitter': 'bg-blue-400',
        'Facebook': 'bg-blue-600', 
        'TikTok': 'bg-gray-900',
        'Snapchat': 'bg-yellow-400',
        'Discord': 'bg-indigo-600',
        'Twitch': 'bg-purple-600'
      };
      
      const newAccount = {
        platform: newPlatform,
        username: newUsername,
        verified: false,
        icon: availablePlatforms.find(p => p.name === newPlatform)?.icon || '🔗',
        color: platformColors[newPlatform as keyof typeof platformColors] || 'bg-gray-500'
      };
      
      setAccounts([...accounts, newAccount]);
      setShowAddForm(false);
      setNewPlatform('');
      setNewUsername('');
      alert(`${newPlatform} account added! Verification pending.`);
    }
  };
  
  const handleRemoveAccount = (index: number) => {
    if (confirm('Are you sure you want to remove this account?')) {
      setAccounts(accounts.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Social Accounts</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Connected Accounts */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Connected Accounts</h3>
            {accounts.map((account, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${account.color} rounded-lg flex items-center justify-center text-white`}>
                    <span className="text-lg">{account.icon}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{account.platform}</div>
                    <div className="text-sm text-gray-600">{account.username}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {account.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                  <button 
                    onClick={() => handleRemoveAccount(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Account */}
          {!showAddForm ? (
            <button 
              onClick={() => setShowAddForm(true)}
              className="w-full bg-cyan-400 text-white py-3 rounded-lg font-medium hover:bg-cyan-500 transition-colors"
            >
              + Add Account
            </button>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">Add New Account</h4>
              <div className="space-y-3">
                <select 
                  value={newPlatform} 
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">Select Platform</option>
                  {availablePlatforms.map((platform) => (
                    <option key={platform.name} value={platform.name}>
                      {platform.icon} {platform.name}
                    </option>
                  ))}
                </select>
                <input 
                  type="text"
                  placeholder="Username or profile URL"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <div className="flex space-x-2">
                  <button 
                    onClick={handleAddAccount}
                    className="flex-1 bg-cyan-400 text-white py-2 rounded-lg font-medium hover:bg-cyan-500 transition-colors"
                  >
                    Add
                  </button>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-2">
              Verified accounts boost your trust score by up to 20 points.
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                <span className="text-green-700">{accounts.filter(a => a.verified).length} Verified</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                <span className="text-yellow-700">{accounts.filter(a => !a.verified).length} Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialAccountsModal;