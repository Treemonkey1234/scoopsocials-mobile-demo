import React, { useState } from 'react';

interface TrustScoreProps {
  trustScore: number;
  onClose: () => void;
}

const TrustScoreBreakdown: React.FC<TrustScoreProps> = ({ trustScore, onClose }) => {
  const factors = [
    { name: 'Social Media Verification', score: 85, weight: 20, icon: '🔗' },
    { name: 'Community Network', score: 92, weight: 20, icon: '👥' },
    { name: 'Platform Activity', score: 78, weight: 15, icon: '⚡' },
    { name: 'Content Quality', score: 88, weight: 15, icon: '✨' },
    { name: 'Time Investment', score: 95, weight: 10, icon: '⏰' },
    { name: 'Comment Engagement', score: 82, weight: 10, icon: '💬' },
    { name: 'Event Participation', score: 90, weight: 5, icon: '🎯' },
    { name: 'Validation Accuracy', score: 94, weight: 5, icon: '✅' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Trust Score Breakdown</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Overall Score */}
        <div className="p-4 text-center bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="text-3xl font-bold text-cyan-600 mb-2">{trustScore}</div>
          <div className="text-sm text-gray-600 mb-3">Overall Trust Score</div>
          <div className="bg-gray-200 rounded-full h-2 w-full">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${trustScore}%` }}
            ></div>
          </div>
        </div>

        {/* Factors */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {factors.map((factor, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{factor.icon}</span>
                    <span className="text-sm font-medium text-gray-800">{factor.name}</span>
                  </div>
                  <span className="text-sm font-bold text-cyan-600">{factor.score}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <div className="bg-gray-200 rounded-full h-1.5 flex-1 mr-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${factor.score}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{factor.weight}% weight</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Trust scores are calculated using our proprietary 11-factor algorithm and updated in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustScoreBreakdown;