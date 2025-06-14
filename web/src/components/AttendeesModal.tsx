import React, { useState } from 'react';

interface Attendee {
  id: string;
  name: string;
  trustScore: number;
  status: 'going' | 'maybe' | 'not_going';
  avatar: string;
  joinedDate: string;
}

interface AttendeesModalProps {
  onClose: () => void;
  eventTitle: string;
  eventId: string;
  isUserBlocked?: (username: string) => boolean;
  onViewProfile?: (userName: string) => void;
}

const AttendeesModal: React.FC<AttendeesModalProps> = ({ onClose, eventTitle, isUserBlocked, onViewProfile }) => {
  const [attendees] = useState<Attendee[]>([
    {
      id: '1',
      name: 'Sarah Martinez',
      trustScore: 88,
      status: 'going',
      avatar: '👩',
      joinedDate: '2 days ago'
    },
    {
      id: '2',
      name: 'Mike Johnson',
      trustScore: 92,
      status: 'going',
      avatar: '👨',
      joinedDate: '3 days ago'
    },
    {
      id: '3',
      name: 'Emma Davis',
      trustScore: 85,
      status: 'going',
      avatar: '👩',
      joinedDate: '1 day ago'
    },
    {
      id: '4',
      name: 'David Kim',
      trustScore: 90,
      status: 'maybe',
      avatar: '👨',
      joinedDate: '4 days ago'
    },
    {
      id: '5',
      name: 'Rachel Brown',
      trustScore: 87,
      status: 'maybe',
      avatar: '👩',
      joinedDate: '2 days ago'
    },
    {
      id: '6',
      name: 'Alex Martinez',
      trustScore: 89,
      status: 'going',
      avatar: '👨',
      joinedDate: '5 days ago'
    },
    {
      id: '7',
      name: 'Jessica Wong',
      trustScore: 95,
      status: 'going',
      avatar: '👩',
      joinedDate: '1 week ago'
    },
    {
      id: '8',
      name: 'Tom Anderson',
      trustScore: 67,
      status: 'not_going',
      avatar: '👨',
      joinedDate: '3 days ago'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'going' | 'maybe' | 'not_going'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'going': return 'bg-green-100 text-green-800';
      case 'maybe': return 'bg-yellow-100 text-yellow-800';
      case 'not_going': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'going': return 'Going';
      case 'maybe': return 'Maybe';
      case 'not_going': return 'Not Going';
      default: return 'Unknown';
    }
  };

  // Filter out blocked users first, then apply status filter
  const nonBlockedAttendees = attendees.filter(a => !isUserBlocked?.(a.name));
  const filteredAttendees = filter === 'all' ? nonBlockedAttendees : nonBlockedAttendees.filter(a => a.status === filter);
  const goingCount = nonBlockedAttendees.filter(a => a.status === 'going').length;
  const maybeCount = nonBlockedAttendees.filter(a => a.status === 'maybe').length;
  const notGoingCount = nonBlockedAttendees.filter(a => a.status === 'not_going').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Event Attendees</h2>
            <p className="text-sm text-gray-600">{eventTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Summary Stats */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-100 rounded-lg p-2">
              <div className="text-lg font-bold text-green-800">{goingCount}</div>
              <div className="text-xs text-green-600">Going</div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-2">
              <div className="text-lg font-bold text-yellow-800">{maybeCount}</div>
              <div className="text-xs text-yellow-600">Maybe</div>
            </div>
            <div className="bg-red-100 rounded-lg p-2">
              <div className="text-lg font-bold text-red-800">{notGoingCount}</div>
              <div className="text-xs text-red-600">Not Going</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-1 overflow-x-auto">
            {['all', 'going', 'maybe', 'not_going'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption as any)}
                className={`flex-shrink-0 py-2 px-3 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  filter === filterOption 
                    ? 'bg-cyan-400 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {filterOption === 'all' ? 'All' : getStatusLabel(filterOption)}
                {filterOption !== 'all' && (
                  <span className="ml-1">
                    ({filterOption === 'going' ? goingCount : filterOption === 'maybe' ? maybeCount : notGoingCount})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Attendees List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {filteredAttendees.map((attendee) => (
              <div key={attendee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{attendee.avatar}</span>
                  <div>
                    <div className="font-medium text-gray-900">{attendee.name}</div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-green-600">Trust: {attendee.trustScore}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">Joined {attendee.joinedDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendee.status)}`}>
                    {getStatusLabel(attendee.status)}
                  </span>
                  <button 
                    onClick={() => onViewProfile?.(attendee.name)}
                    className="text-cyan-600 text-xs hover:text-cyan-700"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendeesModal;