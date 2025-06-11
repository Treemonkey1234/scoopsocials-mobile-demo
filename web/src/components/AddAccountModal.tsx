import React, { useState } from 'react';

interface AddAccountModalProps {
  onClose: () => void;
  onAddAccount: (account: any) => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ onClose, onAddAccount }) => {
  const [newPlatform, setNewPlatform] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [customPlatform, setCustomPlatform] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [useCustomPlatform, setUseCustomPlatform] = useState(false);

  const availablePlatforms = [
    { name: 'Twitter', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg', color: 'bg-blue-400' },
    { name: 'Facebook', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg', color: 'bg-blue-600' },
    { name: 'TikTok', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tiktok.svg', color: 'bg-gray-900' },
    { name: 'Snapchat', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/snapchat.svg', color: 'bg-yellow-400' },
    { name: 'Discord', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg', color: 'bg-indigo-600' },
    { name: 'Twitch', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitch.svg', color: 'bg-purple-600' },
    { name: 'Reddit', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/reddit.svg', color: 'bg-orange-500' },
    { name: 'Pinterest', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/pinterest.svg', color: 'bg-red-500' }
  ];

  const handleAddAccount = () => {
    if (useCustomPlatform) {
      if (!customPlatform.trim() || !customUrl.trim() || !newUsername.trim()) {
        alert('Please fill in all custom platform fields');
        return;
      }
      
      const newAccount = {
        platform: customPlatform.trim(),
        username: newUsername,
        verified: false,
        icon: '🔗',
        color: 'bg-gray-500',
        connectedSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
      
      onAddAccount(newAccount);
      onClose();
      alert(`${customPlatform} account added! Verification pending.`);
    } else {
      if (!newPlatform || !newUsername) {
        alert('Please select a platform and enter username');
        return;
      }
      
      const selectedPlatform = availablePlatforms.find(p => p.name === newPlatform);
      const newAccount = {
        platform: newPlatform,
        username: newUsername,
        verified: false,
        icon: selectedPlatform?.icon || '🔗',
        color: selectedPlatform?.color || 'bg-gray-500',
        connectedSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
      
      onAddAccount(newAccount);
      onClose();
      alert(`${newPlatform} account added! Verification pending.`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Add Social Account</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Add Form */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Add New Account</h4>
            <div className="space-y-3">
              {/* Platform Type Selection */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setUseCustomPlatform(false)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                    !useCustomPlatform ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Popular Platforms
                </button>
                <button
                  onClick={() => setUseCustomPlatform(true)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                    useCustomPlatform ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Custom Platform
                </button>
              </div>
              
              {!useCustomPlatform ? (
                <select 
                  value={newPlatform} 
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">Select Platform</option>
                  {availablePlatforms.map((platform) => (
                    <option key={platform.name} value={platform.name}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-2">
                  <input 
                    type="text"
                    placeholder="Platform name (e.g., Mastodon, BeReal)"
                    value={customPlatform}
                    onChange={(e) => setCustomPlatform(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <input 
                    type="url"
                    placeholder="Platform URL (e.g., https://mastodon.social)"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              )}
              
              <input 
                type="text"
                placeholder="Username or handle"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              
              <div className="flex space-x-2 mt-4">
                <button 
                  onClick={() => {
                    setNewPlatform('');
                    setNewUsername('');
                    setCustomPlatform('');
                    setCustomUrl('');
                    setUseCustomPlatform(false);
                    onClose();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddAccount}
                  className="flex-1 bg-cyan-400 text-white py-2 rounded-lg font-medium hover:bg-cyan-500 transition-colors"
                >
                  Add Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;