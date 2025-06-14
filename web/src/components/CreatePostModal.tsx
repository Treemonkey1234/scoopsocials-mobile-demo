import React, { useState } from 'react';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (post: any) => void;
  isUserBlocked?: (username: string) => boolean;
  preSelectedUser?: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSubmit, isUserBlocked, preSelectedUser }) => {
  const [reviewedPersons, setReviewedPersons] = useState<string[]>(preSelectedUser ? [preSelectedUser] : []);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [location, setLocation] = useState('');
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [showReviewProcess, setShowReviewProcess] = useState(false);
  const [acknowledgedWarning, setAcknowledgedWarning] = useState(false);
  const [friendSearchText, setFriendSearchText] = useState('');

  const categories = ['Professional', 'Marketplace', 'Academic', 'Social/Events', 'Dating', 'Childcare', 'General'];
  
  const friends = [
    { id: '1', name: 'Sarah Martinez', trustScore: 88, avatar: '👩', isReciprocal: true },
    { id: '2', name: 'Mike Johnson', trustScore: 92, avatar: '👨', isReciprocal: true },
    { id: '3', name: 'Emma Davis', trustScore: 85, avatar: '👩', isReciprocal: false },
    { id: '4', name: 'David Kim', trustScore: 90, avatar: '👨', isReciprocal: true },
    { id: '5', name: 'Rachel Brown', trustScore: 87, avatar: '👩', isReciprocal: false },
    { id: '6', name: 'Alex Martinez', trustScore: 89, avatar: '👨', isReciprocal: true }
  ];

  // Only show reciprocal friends for posting, excluding blocked users
  const reciprocalFriends = friends.filter(friend => friend.isReciprocal && !isUserBlocked?.(friend.name));

  const [filteredFriends, setFilteredFriends] = useState(reciprocalFriends);

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('Please write some content');
      return;
    }

    if (reviewedPersons.length === 0) {
      alert('Please specify who you are reviewing');
      return;
    }

    // Check if any selected persons are blocked
    const blockedPersons = reviewedPersons.filter(person => isUserBlocked?.(person));
    if (blockedPersons.length > 0) {
      alert(`You cannot create posts about blocked users: ${blockedPersons.join(', ')}`);
      return;
    }

    setShowReviewProcess(true);
  };
  
  const finalizePost = () => {
    if (!acknowledgedWarning) {
      alert('Please acknowledge the warning to continue');
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      reviewer: 'Riesling LeFluuf',
      reviewerTrustScore: 95,
      reviewedPerson: reviewedPersons.join(', '),
      content: content.trim(),
      timestamp: 'Just now',
      votes: 0,
      userVote: null,
      comments: 0,
      category,
      engagement: { agrees: 0, disagrees: 0, communityValidation: 50 },
      location: location || undefined
    };

    onSubmit(newPost);
    onClose();
  };
  
  const selectFriend = (friend: any) => {
    if (!reviewedPersons.includes(friend.name)) {
      setReviewedPersons([...reviewedPersons, friend.name]);
    }
    // Don't close the modal - let user continue selecting
  };
  
  const handleFriendSearch = (searchText: string) => {
    setFriendSearchText(searchText);
    if (searchText.trim() === '') {
      setFilteredFriends(reciprocalFriends);
    } else {
      const filtered = reciprocalFriends.filter(friend => 
        friend.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  };
  
  const removePerson = (personToRemove: string) => {
    setReviewedPersons(reviewedPersons.filter(person => person !== personToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Create Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Person(s) Being Reviewed */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">People You're Reviewing</label>
            
            {/* Selected People */}
            {reviewedPersons.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {reviewedPersons.map((person, index) => (
                  <div key={index} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm flex items-center">
                    <span>{person}</span>
                    <button
                      onClick={() => removePerson(person)}
                      className="ml-2 text-cyan-600 hover:text-cyan-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter name or @username"
onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const name = e.currentTarget.value.trim();
                    if (!reviewedPersons.includes(name)) {
                      setReviewedPersons([...reviewedPersons, name]);
                    }
                    e.currentTarget.value = '';
                  }
                }}
                list="friends-datalist"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                onClick={() => setShowFriendsList(true)}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Add Friends
              </button>
            </div>
            
            {/* Friend suggestions datalist - only reciprocal friends */}
            <datalist id="friends-datalist">
              {reciprocalFriends.map((friend) => (
                <option key={friend.id} value={friend.name} />
              ))}
            </datalist>
            
            {/* Reciprocal Friends Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
              <div className="flex items-center text-sm text-blue-800">
                <span className="text-blue-500 mr-2">ℹ️</span>
                You can only review reciprocal friends (people who follow you back)
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              rows={4}
              placeholder="Share your experience with this person..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">{content.length}/500 characters</div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>


          {/* Location (optional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location (Optional)</label>
            <input
              type="text"
              placeholder="Add location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-cyan-500 text-white py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors"
            >
              Review & Post
            </button>
          </div>
        </div>
      </div>
      
      {/* Friends List Modal */}
      {showFriendsList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg w-full max-w-sm max-h-[70vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Select Friends</h3>
              <button
                onClick={() => {
                  setShowFriendsList(false);
                  setFriendSearchText('');
                  setFilteredFriends(friends);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search friends..."
                value={friendSearchText}
                onChange={(e) => handleFriendSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {filteredFriends.map((friend) => {
                  const isSelected = reviewedPersons.includes(friend.name);
                  return (
                    <button
                      key={friend.id}
                      onClick={() => selectFriend(friend)}
                      disabled={isSelected}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isSelected 
                          ? 'bg-green-100 border border-green-300 cursor-not-allowed' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-2xl">{friend.avatar}</span>
                      <div className="flex-1 text-left">
                        <div className={`font-medium ${
                          isSelected ? 'text-green-800' : 'text-gray-900'
                        }`}>{friend.name}</div>
                        <div className="text-sm text-green-600">Trust: {friend.trustScore}</div>
                      </div>
                      {isSelected && (
                        <span className="text-green-600 text-lg">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {filteredFriends.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No friends found matching "{friendSearchText}"
                </div>
              )}
            </div>
            
            {/* Footer with Done button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowFriendsList(false);
                  setFriendSearchText('');
                  setFilteredFriends(friends);
                }}
                className="w-full bg-cyan-500 text-white py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors"
              >
                Done ({reviewedPersons.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Review Process Modal */}
      {showReviewProcess && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg w-full max-w-sm max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Review Your Post</h3>
              <button
                onClick={() => setShowReviewProcess(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {/* Post Preview */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-sm font-medium text-gray-900 mb-2">Post Preview:</div>
                <div className="text-xs text-gray-600 mb-1">Reviewing: {reviewedPersons.join(', ')}</div>
                <div className="text-xs text-gray-600 mb-2">Category: {category}</div>
                <p className="text-sm text-gray-800">{content}</p>
              </div>
              
              {/* Warning */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-3">
                  <span className="text-orange-500 text-xl mr-2">⚠️</span>
                  <span className="font-bold text-orange-800">Important Notice</span>
                </div>
                <div className="text-sm text-orange-700 space-y-2">
                  <p><strong>Impact on Others:</strong> Your review will be publicly visible and may affect the reviewed person's reputation and trust score.</p>
                  <p><strong>Impact on You:</strong> False or malicious reviews may result in penalties to your own trust score and account restrictions.</p>
                  <p><strong>Community Guidelines:</strong> Reviews should be honest, factual, and constructive. Personal attacks, harassment, or false information are prohibited.</p>
                  <p><strong>Permanence:</strong> Once posted, reviews become part of the permanent community record.</p>
                </div>
              </div>
              
              {/* Acknowledgment */}
              <div className="mb-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={acknowledgedWarning}
                    onChange={(e) => setAcknowledgedWarning(e.target.checked)}
                    className="mr-3 mt-1 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">
                    I understand the impact of my review and confirm that it is honest, accurate, and follows community guidelines.
                  </span>
                </label>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReviewProcess(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  Back to Edit
                </button>
                <button
                  onClick={finalizePost}
                  disabled={!acknowledgedWarning}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    acknowledgedWarning 
                      ? 'bg-cyan-500 text-white hover:bg-cyan-600' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Publish Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostModal;