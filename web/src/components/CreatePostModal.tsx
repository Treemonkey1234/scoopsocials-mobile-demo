import React, { useState } from 'react';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (post: any) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSubmit }) => {
  const [postType, setPostType] = useState<'review' | 'general'>('review');
  const [reviewedPerson, setReviewedPerson] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [rating, setRating] = useState(5);
  const [location, setLocation] = useState('');
  const [privacy, setPrivacy] = useState('public');

  const categories = ['Professional', 'Marketplace', 'Academic', 'Social/Events', 'Dating', 'Childcare', 'General'];

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('Please write some content');
      return;
    }

    if (postType === 'review' && !reviewedPerson.trim()) {
      alert('Please specify who you are reviewing');
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      reviewer: 'Riesling LeFluuf',
      reviewerTrustScore: 95,
      reviewedPerson: postType === 'review' ? reviewedPerson : '',
      content: content.trim(),
      timestamp: 'Just now',
      votes: 0,
      userVote: null,
      comments: 0,
      category,
      engagement: { agrees: 0, disagrees: 0, communityValidation: 50 },
      postType,
      location: location || undefined,
      privacy
    };

    onSubmit(newPost);
    onClose();
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
          {/* Post Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setPostType('review')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  postType === 'review' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Review Person
              </button>
              <button
                onClick={() => setPostType('general')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  postType === 'general' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                General Post
              </button>
            </div>
          </div>

          {/* Person Being Reviewed (only for reviews) */}
          {postType === 'review' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Person You're Reviewing</label>
              <input
                type="text"
                placeholder="Enter their name or @username"
                value={reviewedPerson}
                onChange={(e) => setReviewedPerson(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          )}

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {postType === 'review' ? 'Your Review' : 'What\'s on your mind?'}
            </label>
            <textarea
              rows={4}
              placeholder={postType === 'review' ? 'Share your experience with this person...' : 'Share what\'s happening...'}
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

          {/* Rating (only for reviews) */}
          {postType === 'review' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          )}

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

          {/* Privacy */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="public">🌍 Public</option>
              <option value="friends">👥 Friends Only</option>
              <option value="private">🔒 Private</option>
            </select>
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
    </div>
  );
};

export default CreatePostModal;