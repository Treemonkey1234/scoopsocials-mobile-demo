import React, { useState } from 'react';

interface CreateEventModalProps {
  onClose: () => void;
  onSubmit: (event: any) => void;
  preSelectedFriend?: string;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose, onSubmit, preSelectedFriend }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Social');
  const [trustRequired, setTrustRequired] = useState(70);
  const [maxAttendees, setMaxAttendees] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>(preSelectedFriend ? [preSelectedFriend] : []);
  const [friendSearchQuery, setFriendSearchQuery] = useState('');

  const categories = ['Social', 'Professional', 'Sports', 'Tech', 'Academic', 'Community Service', 'Arts & Culture'];
  
  const friends = [
    { id: '1', name: 'Sarah Martinez', trustScore: 88, avatar: '👩' },
    { id: '2', name: 'Mike Johnson', trustScore: 92, avatar: '👨' },
    { id: '3', name: 'Emma Davis', trustScore: 85, avatar: '👩' },
    { id: '4', name: 'David Kim', trustScore: 90, avatar: '👨' },
    { id: '5', name: 'Rachel Brown', trustScore: 87, avatar: '👩' },
    { id: '6', name: 'Alex Martinez', trustScore: 89, avatar: '👨' }
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(friendSearchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Please enter an event title');
      return;
    }
    if (!date) {
      alert('Please select a date');
      return;
    }
    if (!time) {
      alert('Please select a time');
      return;
    }
    if (!location.trim()) {
      alert('Please enter a location');
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      endTime: endTime || undefined,
      location: location.trim(),
      category,
      organizer: 'Riesling LeFluuf (Trust: 95)',
      goingCount: 1, // Organizer automatically going
      trustRequired,
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
      isPrivate,
      createdBy: 'Riesling LeFluuf',
      createdAt: new Date().toISOString()
    };

    onSubmit(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Create Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Event Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
            <input
              type="text"
              placeholder="What's the name of your event?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              placeholder="Tell people what your event is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">{description.length}/500 characters</div>
          </div>

          {/* Date and Time */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={date || new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time (Optional)</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              placeholder="Where will this take place?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
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

          {/* Trust Requirement */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Trust Score: {trustRequired}
            </label>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={trustRequired}
              onChange={(e) => setTrustRequired(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50 (Open)</span>
              <span>70 (Moderate)</span>
              <span>95 (High Trust)</span>
            </div>
          </div>

          {/* Max Attendees */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees (Optional)</label>
            <input
              type="number"
              placeholder="Leave blank for unlimited"
              value={maxAttendees}
              onChange={(e) => setMaxAttendees(e.target.value)}
              min="2"
              max="500"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Privacy Settings */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mr-3 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-700">Private Event (invite only)</span>
            </label>
          </div>
          
          {/* Friends Selection for Private Events */}
          {isPrivate && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Invite Friends</label>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search friends to invite..."
                  value={friendSearchQuery}
                  onChange={(e) => setFriendSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                <div className="space-y-2">
                  {filteredFriends.map((friend) => (
                    <label key={friend.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFriends.includes(friend.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFriends([...selectedFriends, friend.id]);
                          } else {
                            setSelectedFriends(selectedFriends.filter(id => id !== friend.id));
                          }
                        }}
                        className="mr-3 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="text-lg mr-2">{friend.avatar}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{friend.name}</div>
                        <div className="text-xs text-green-600">Trust: {friend.trustScore}</div>
                      </div>
                    </label>
                  ))}
                  {filteredFriends.length === 0 && friendSearchQuery && (
                    <div className="text-sm text-gray-500 text-center py-2">
                      No friends found matching "{friendSearchQuery}"
                    </div>
                  )}
                </div>
              </div>
              {selectedFriends.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {selectedFriends.length} friend(s) selected
                </div>
              )}
            </div>
          )}

          {/* Trust Guidelines */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <span className="text-cyan-500 text-lg mr-2">🛡️</span>
              <span className="font-medium text-cyan-800">Trust & Safety</span>
            </div>
            <p className="text-sm text-cyan-700">
              Setting a higher trust score requirement helps ensure quality attendees and safer events.
            </p>
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
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;