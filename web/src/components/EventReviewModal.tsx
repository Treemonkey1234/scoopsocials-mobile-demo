import React, { useState } from 'react';

interface EventReviewModalProps {
  onClose: () => void;
  eventTitle: string;
  eventId: string;
  onSubmitReview: (review: any) => void;
}

const EventReviewModal: React.FC<EventReviewModalProps> = ({ onClose, eventTitle, eventId, onSubmitReview }) => {
  const [overallRating, setOverallRating] = useState(5);
  const [organizationRating, setOrganizationRating] = useState(5);
  const [venueRating, setVenueRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [improvements, setImprovements] = useState('');
  const [newFriendsMet, setNewFriendsMet] = useState<string[]>([]);
  const [showAttendeeRoster, setShowAttendeeRoster] = useState(false);
  
  const eventAttendees = [
    { id: '1', name: 'Sarah Martinez', avatar: '👩', trustScore: 88 },
    { id: '2', name: 'Mike Johnson', avatar: '👨', trustScore: 92 },
    { id: '3', name: 'Emma Davis', avatar: '👩', trustScore: 85 },
    { id: '4', name: 'David Kim', avatar: '👨', trustScore: 90 },
    { id: '5', name: 'Alex Martinez', avatar: '👨', trustScore: 89 },
    { id: '6', name: 'Jessica Wong', avatar: '👩', trustScore: 95 }
  ];

  const highlightOptions = [
    'Great networking opportunities',
    'Well organized',
    'Excellent speakers/content',
    'Perfect venue',
    'Good food/refreshments',
    'On time',
    'Valuable learning',
    'Friendly attendees'
  ];

  const handleHighlightToggle = (highlight: string) => {
    if (highlights.includes(highlight)) {
      setHighlights(highlights.filter(h => h !== highlight));
    } else {
      setHighlights([...highlights, highlight]);
    }
  };

  const handleSubmit = () => {
    if (!reviewText.trim()) {
      alert('Please write about your experience to help others');
      return;
    }

    const review = {
      eventId: eventId,
      eventTitle,
      reviewer: 'Riesling LeFluuf',
      overallRating,
      ratings: {
        organization: organizationRating,
        venue: venueRating,
        value: valueRating
      },
      reviewText: reviewText.trim(),
      highlights,
      improvements: improvements.trim(),
      wouldRecommend,
      newFriendsMet,
      attendanceConfirmed: true,
      submittedAt: new Date().toISOString()
    };

    onSubmitReview(review);
    onClose();
  };

  const StarRating = ({ rating, setRating, label }: { rating: number, setRating: (r: number) => void, label: string }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            ⭐
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Share Your Experience</h2>
            <p className="text-sm text-gray-600">{eventTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Attendance Note */}
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <span className="text-green-600 text-lg mr-2">✓</span>
              <span className="text-sm font-medium text-green-800">
                You attended this event
              </span>
            </div>
            <p className="text-xs text-green-700">
              Share your experience with other attendees and make new connections!
            </p>
          </div>

          {/* Overall Rating */}
          <StarRating 
            rating={overallRating} 
            setRating={setOverallRating} 
            label="Overall Experience" 
          />

          {/* Detailed Ratings */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-3">Rate Different Aspects:</h3>
            <div className="space-y-3">
              <StarRating 
                rating={organizationRating} 
                setRating={setOrganizationRating} 
                label="Organization" 
              />
              <StarRating 
                rating={venueRating} 
                setRating={setVenueRating} 
                label="Venue" 
              />
              <StarRating 
                rating={valueRating} 
                setRating={setValueRating} 
                label="Value" 
              />
            </div>
          </div>

          {/* Written Review */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              rows={4}
              placeholder="Share your experience to help others decide..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">{reviewText.length}/500 characters</div>
          </div>

          {/* Highlights */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">What stood out? (Select all that apply)</label>
            <div className="grid grid-cols-2 gap-2">
              {highlightOptions.map((highlight) => (
                <label key={highlight} className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={highlights.includes(highlight)}
                    onChange={() => handleHighlightToggle(highlight)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{highlight}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Suggestions for Improvement (Optional)</label>
            <textarea
              rows={2}
              placeholder="How could this event be better next time?"
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          {/* People You Met */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">People You Met & Want to Connect With</label>
              <button
                onClick={() => setShowAttendeeRoster(true)}
                className="text-cyan-600 text-sm hover:text-cyan-700"
              >
                View Attendees
              </button>
            </div>
            
            {newFriendsMet.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {newFriendsMet.map((friend, index) => (
                  <div key={index} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm flex items-center">
                    <span>{friend}</span>
                    <button
                      onClick={() => setNewFriendsMet(newFriendsMet.filter(f => f !== friend))}
                      className="ml-2 text-cyan-600 hover:text-cyan-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-gray-500">
              Tag people you met to send them friend requests and grow your network!
            </p>
          </div>
          
          {/* Recommendation */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Would you recommend this event to others?</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={wouldRecommend === true}
                  onChange={() => setWouldRecommend(true)}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={wouldRecommend === false}
                  onChange={() => setWouldRecommend(false)}
                  className="mr-2 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
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
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Share Experience
            </button>
          </div>
        </div>
      </div>
      
      {/* Attendee Roster Modal */}
      {showAttendeeRoster && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-70">
          <div className="bg-white rounded-lg w-full max-w-sm max-h-[70vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Event Attendees</h3>
              <button
                onClick={() => setShowAttendeeRoster(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {eventAttendees.map((attendee) => {
                  const isSelected = newFriendsMet.includes(attendee.name);
                  return (
                    <button
                      key={attendee.id}
                      onClick={() => {
                        if (isSelected) {
                          setNewFriendsMet(newFriendsMet.filter(f => f !== attendee.name));
                        } else {
                          setNewFriendsMet([...newFriendsMet, attendee.name]);
                        }
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isSelected 
                          ? 'bg-cyan-100 border border-cyan-300' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-2xl">{attendee.avatar}</span>
                      <div className="flex-1 text-left">
                        <div className={`font-medium ${
                          isSelected ? 'text-cyan-800' : 'text-gray-900'
                        }`}>{attendee.name}</div>
                        <div className="text-sm text-green-600">Trust: {attendee.trustScore}</div>
                      </div>
                      {isSelected && (
                        <span className="text-cyan-600 text-lg">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowAttendeeRoster(false)}
                className="w-full bg-cyan-500 text-white py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors"
              >
                Done ({newFriendsMet.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventReviewModal;