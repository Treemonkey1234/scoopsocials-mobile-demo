import React, { useState } from 'react';

interface FlagModalProps {
  onClose: () => void;
  onSubmit: (flagData: any) => void;
  postId: string;
}

const FlagModal: React.FC<FlagModalProps> = ({ onClose, onSubmit, postId }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const flagReasons = [
    'Inappropriate content',
    'Harassment or bullying', 
    'False information',
    'Spam or promotional content',
    'Hate speech',
    'Privacy violation',
    'Other'
  ];

  const handleSubmit = () => {
    if (!reason) {
      alert('Please select a reason for flagging');
      return;
    }

    const flagData = {
      postId,
      reason,
      description: description.trim(),
      timestamp: Date.now(),
      reporter: 'Riesling LeFluuf'
    };

    onSubmit(flagData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Report Content</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Warning Message */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div className="flex items-center mb-2">
              <span className="text-orange-500 text-lg mr-2">⚠️</span>
              <span className="font-medium text-orange-800">Community Guidelines</span>
            </div>
            <p className="text-sm text-orange-700">
              Help us maintain a safe community by reporting content that violates our guidelines.
            </p>
          </div>

          {/* Reason Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why are you reporting this content?
            </label>
            <div className="space-y-2">
              {flagReasons.map((flagReason) => (
                <label key={flagReason} className="flex items-center">
                  <input
                    type="radio"
                    name="reason"
                    value={flagReason}
                    checked={reason === flagReason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mr-3 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">{flagReason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional details (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Provide more context about why this content should be reviewed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">{description.length}/300 characters</div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start">
              <span className="text-blue-500 text-sm mr-2 mt-0.5">🔒</span>
              <div>
                <p className="text-xs text-gray-600">
                  <strong>Privacy:</strong> Reports are submitted anonymously to our moderation team. 
                  The reported user will not see who flagged their content.
                </p>
              </div>
            </div>
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
              className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagModal;