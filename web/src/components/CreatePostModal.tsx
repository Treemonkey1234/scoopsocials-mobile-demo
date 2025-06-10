import React, { useState } from 'react';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (post: any) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSubmit }) => {
  const [reviewedPerson, setReviewedPerson] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [location, setLocation] = useState('');
  const [showFriendsList, setShowFriendsList] = useState(false);

  const categories = ['Professional', 'Marketplace', 'Academic', 'Social/Events', 'Dating', 'Childcare', 'General'];
  
  const friends = [
    { id: '1', name: 'Sarah Martinez', trustScore: 88, avatar: '👩' },
    { id: '2', name: 'Mike Johnson', trustScore: 92, avatar: '👨' },
    { id: '3', name: 'Emma Davis', trustScore: 85, avatar: '👩' },
    { id: '4', name: 'David Kim', trustScore: 90, avatar: '👨' },
    { id: '5', name: 'Rachel Brown', trustScore: 87, avatar: '👩' },
    { id: '6', name: 'Alex Martinez', trustScore: 89, avatar: '👨' }
  ];

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('Please write some content');
      return;
    }

    if (!reviewedPerson.trim()) {
      alert('Please specify who you are reviewing');
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      reviewer: 'Riesling LeFluuf',
      reviewerTrustScore: 95,
      reviewedPerson: reviewedPerson,
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
    setReviewedPerson(friend.name);
    setShowFriendsList(false);
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
          {/* Person Being Reviewed */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Person You're Reviewing</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter their name or @username"
                value={reviewedPerson}
                onChange={(e) => setReviewedPerson(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                onClick={() => setShowFriendsList(true)}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Add Friends
              </button>
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
              className="flex-1 bg-cyan-400 text-white py-2 rounded-lg font-medium hover:bg-cyan-500 transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
      
      {/* Friends List Modal */}
      {showFriendsList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg w-full max-w-sm max-h-[70vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Select Friend</h3>
              <button
                onClick={() => setShowFriendsList(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {friends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => selectFriend(friend)}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-2xl">{friend.avatar}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{friend.name}</div>
                      <div className="text-sm text-green-600">Trust: {friend.trustScore}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostModal;