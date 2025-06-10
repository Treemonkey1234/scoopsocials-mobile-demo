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
    if (!attendanceConfirmed) {
      alert('Please confirm your attendance to submit a review');
      return;
    }

    if (!reviewText.trim()) {
      alert('Please write a review to help others');
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
      attendanceConfirmed,
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
            <h2 className="text-lg font-bold text-gray-800">Review Event</h2>
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
          {/* Attendance Confirmation */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={attendanceConfirmed}
                onChange={(e) => setAttendanceConfirmed(e.target.checked)}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-blue-800">
                I confirm that I attended this event
              </span>
            </label>
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
              disabled={!attendanceConfirmed}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                attendanceConfirmed
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventReviewModal;