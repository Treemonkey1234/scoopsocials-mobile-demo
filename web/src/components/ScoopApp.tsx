import React, { useState } from 'react';

// TypeScript interfaces for component props
interface ScreenProps {
  onNext: () => void;
}

interface NavigationProps {
  onNavigate: (screen: string) => void;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Mobile Container */}
      <div className="max-w-sm mx-auto bg-white min-h-screen shadow-xl relative">
        {/* Status Bar */}
        <div className="bg-cyan-400 text-white text-xs font-medium px-4 py-1 flex justify-between items-center">
          <span>6:12 ↗</span>
          <div className="flex items-center space-x-1">
            <span>📶</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Screen Content */}
        {currentScreen === 'login' && <LoginScreen onNext={() => setCurrentScreen('loginForm')} />}
        {currentScreen === 'loginForm' && <LoginFormScreen onNext={() => setCurrentScreen('profile')} />}
        {currentScreen === 'profile' && <ProfileScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'groups' && <GroupsScreen onNavigate={setCurrentScreen} />}

        {/* Bottom Navigation */}
        {(currentScreen === 'profile' || currentScreen === 'groups') && (
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-sm w-full bg-white border-t border-gray-200 z-50">
            <div className="flex">
              <button 
                onClick={() => setCurrentScreen('profile')}
                className="flex-1 py-3 text-center"
              >
                <div className="text-lg mb-1">🏠</div>
                <div className={`text-xs ${currentScreen === 'profile' ? 'text-cyan-400' : 'text-gray-600'}`}>HOME</div>
              </button>
              <button 
                onClick={() => setCurrentScreen('groups')}
                className="flex-1 py-3 text-center"
              >
                <div className="text-lg mb-1">🗓️</div>
                <div className={`text-xs ${currentScreen === 'groups' ? 'text-cyan-400' : 'text-gray-600'}`}>GROUPS</div>
              </button>
              <button 
                onClick={() => alert('Search feature coming soon!')}
                className="flex-1 py-3 text-center"
              >
                <div className="w-8 h-8 bg-cyan-400 rounded-full mx-auto mb-1 flex items-center justify-center">
                  <span className="text-white text-lg">🔍</span>
                </div>
                <div className="text-xs text-cyan-400">SEARCH</div>
              </button>
              <button 
                onClick={() => alert('Inbox feature coming soon!')}
                className="flex-1 py-3 text-center"
              >
                <div className="text-lg mb-1">🔔</div>
                <div className="text-xs text-gray-600">INBOX</div>
              </button>
              <button 
                onClick={() => setCurrentScreen('profile')}
                className="flex-1 py-3 text-center"
              >
                <div className="text-lg mb-1">👤</div>
                <div className={`text-xs ${currentScreen === 'profile' ? 'text-cyan-400' : 'text-gray-600'}`}>PROFILE</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Login Screen Component
const LoginScreen: React.FC<ScreenProps> = ({ onNext }) => {
  return (
    <div className="bg-gradient-to-b from-cyan-400 to-cyan-600 h-screen flex flex-col items-center justify-center text-white relative">
      {/* Scoop Logo */}
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="16" cy="16" r="6" fill="#00BCD4"/>
            <circle cx="32" cy="16" r="6" fill="#00BCD4"/>
            <circle cx="24" cy="32" r="6" fill="#00BCD4"/>
            <path d="M24 26 L16 22 L32 22 Z" fill="#00BCD4"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-center mb-2">scoop</h1>
      </div>
      
      {/* Login Buttons */}
      <div className="w-full max-w-sm px-8 space-y-4">
        <button 
          onClick={onNext}
          className="w-full bg-white text-cyan-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Sign in
        </button>
        <button 
          onClick={onNext}
          className="w-full border-2 border-white text-white py-3 rounded-lg font-semibold hover:bg-white hover:text-cyan-600 transition-colors"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

// Login Form Screen Component
const LoginFormScreen: React.FC<ScreenProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-cyan-400 to-cyan-600 h-32 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">scoop</h1>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">USERNAME</label>
            <input 
              type="email" 
              defaultValue="nickhemingway@gmail.com" 
              className="w-full border-b border-gray-300 py-2 focus:border-cyan-400 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">PASSWORD</label>
            <div className="relative">
              <input 
                type="password" 
                defaultValue="••••••••" 
                className="w-full border-b border-gray-300 py-2 focus:border-cyan-400 outline-none pr-12"
              />
              <button type="button" className="absolute right-0 top-2 text-gray-500 text-sm">SHOW</button>
            </div>
            <a href="#" className="text-sm text-gray-500 mt-1 block">Forgot Password?</a>
          </div>
          
          <button 
            onClick={onNext}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-gray-700 transition-colors"
          >
            Login
          </button>
          
          <div className="text-center">
            <a href="#" className="text-gray-500">Create Account</a>
          </div>
          
          <div className="text-center text-gray-500 text-sm">or</div>
          
          {/* Social Login */}
          <div className="flex justify-center space-x-4">
            <div className="w-12 h-12 bg-blue-400 rounded flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
              <span className="font-bold">t</span>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
              <span className="font-bold">f</span>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
              <span className="font-bold">G+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Screen Component
const ProfileScreen: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = React.useState('people');
  
  const demoGroupEvents = [
    { id: 1, title: 'Weekend Hiking Group', date: '2024-06-15', status: 'Going' },
    { id: 2, title: 'Photography Meetup', date: '2024-06-20', status: 'Maybe' },
    { id: 3, title: 'Book Club Discussion', date: '2024-06-25', status: 'Going' }
  ];
  
  const demoLikes = [
    { id: 1, type: 'event', title: 'Jazz Night at Blue Note', author: 'Sarah Wilson' },
    { id: 2, type: 'post', title: 'Amazing sunset at Central Park', author: 'Mike Chen' },
    { id: 3, type: 'event', title: 'Tech Startup Networking', author: 'Alex Rodriguez' }
  ];
  
  const demoPastEvents = [
    { id: 1, title: 'Coffee Meetup Downtown', date: '2024-05-20', status: 'Attended' },
    { id: 2, title: 'Art Gallery Opening', date: '2024-05-15', status: 'Attended' },
    { id: 3, title: 'Tech Conference 2024', date: '2024-05-10', status: 'Attended' }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-6 text-center text-white">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
            👤
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-2">
          <h2 className="text-xl font-bold mr-2">Nick Hemingway</h2>
          <span className="text-cyan-200 text-xl">✓</span>
        </div>
        
        <p className="opacity-90 text-sm">@nickhemingway9</p>
        
        <button className="bg-white text-cyan-600 px-4 py-1 rounded-full text-sm font-semibold mt-3 hover:bg-gray-50 transition-colors">
          Edit Profile
        </button>
      </div>

      {/* Bio Section */}
      <div className="p-4">
        <p className="text-gray-700 text-sm mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
        
        {/* Trust Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">VERIFIED</span>
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">OUTGOING</span>
          <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs">EXTROVERTED</span>
          <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">CARING</span>
          <span className="bg-pink-500 text-white px-2 py-1 rounded text-xs">DISCIPLINED</span>
        </div>
        
        {/* Social Links */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            {[
              { bg: 'bg-blue-500', text: 'in', label: 'LINKEDIN' },
              { bg: 'bg-blue-400', text: 't', label: 'TWITTER' },
              { bg: 'bg-blue-600', text: 'f', label: 'FACEBOOK' },
              { bg: 'bg-black', text: 'tt', label: 'TIK TOK' },
              { bg: 'bg-pink-500', text: 'ig', label: 'INSTAGRAM' },
              { bg: 'bg-red-500', text: 'yt', label: 'YOUTUBE' }
            ].map((social, index) => (
              <div key={index} className="text-center hover:scale-110 transition-transform cursor-pointer">
                <div className={`w-8 h-8 ${social.bg} rounded mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold`}>
                  {social.text}
                </div>
                <span className="text-xs text-gray-500">{social.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex">
            <button 
              onClick={() => setActiveTab('people')}
              className={`flex-1 py-3 text-center font-semibold ${activeTab === 'people' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}
            >
              PEOPLE
            </button>
            <button 
              onClick={() => setActiveTab('groups')}
              className={`flex-1 py-3 text-center font-semibold ${activeTab === 'groups' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}
            >
              GROUPS
            </button>
            <button 
              onClick={() => setActiveTab('likes')}
              className={`flex-1 py-3 text-center font-semibold ${activeTab === 'likes' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}
            >
              LIKES
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="max-h-96 overflow-y-auto">
          {/* People Tab */}
          {activeTab === 'people' && (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold">CS</div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-semibold text-sm">Cody Snow</span>
                        <span className="text-cyan-400 ml-1">✓</span>
                        <span className="text-gray-500 text-xs ml-2">• 2h</span>
                        <span className="ml-auto">😊</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt Lorem ipsum dolor sit amet, consectetur adipiscing</p>
                      <div className="flex items-center text-gray-500 text-sm space-x-4">
                        <span className="hover:text-cyan-400 cursor-pointer">💬</span>
                        <span className="hover:text-cyan-400 cursor-pointer">👍</span>
                        <span className="hover:text-cyan-400 cursor-pointer">↗️</span>
                        <span className="hover:text-cyan-400 cursor-pointer">⭐</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 mb-2">Upcoming Events</h4>
              {demoGroupEvents.map((event) => (
                <div key={event.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{event.title}</h5>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.status === 'Going' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
              
              <h4 className="font-semibold text-gray-800 mb-2 mt-4">Past Events</h4>
              {demoPastEvents.map((event) => (
                <div key={event.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{event.title}</h5>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Likes Tab */}
          {activeTab === 'likes' && (
            <div className="space-y-3">
              {demoLikes.map((like) => (
                <div key={like.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className="text-red-500 text-lg">❤️</div>
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{like.title}</h5>
                      <p className="text-xs text-gray-500">by {like.author}</p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                        like.type === 'event' ? 'bg-cyan-100 text-cyan-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {like.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Groups Screen Component with real API integration
const GroupsScreen: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [userLocation, setUserLocation] = React.useState<[number, number] | null>(null);
  const [activeTab, setActiveTab] = React.useState('upcoming');
  const [eventsTab, setEventsTab] = React.useState('upcoming');

  // Get user location and fetch events
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          fetchEvents(coords[0], coords[1]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to NYC
          fetchEvents(40.7128, -74.0060);
        }
      );
    }
  }, []);

  const fetchEvents = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || 'demo-token';
      const response = await fetch(`/api/events/map?lat=${lat}&lng=${lng}&radius=5000`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else {
        console.log('Using demo events - authentication required for real data');
        // Demo events for display
        setEvents([
          {
            id: 'demo1',
            title: 'NETWORKING HAPPY HOUR',
            startDate: new Date(Date.now() + 86400000).toISOString(),
            category: 'professional',
            organizer: { firstName: 'Sarah', lastName: 'Wilson', trustScore: { current: 87 } },
            goingCount: 12,
            address: 'Downtown Phoenix'
          },
          {
            id: 'demo2', 
            title: 'WEEKEND HIKING GROUP',
            startDate: new Date(Date.now() + 172800000).toISOString(),
            category: 'sports',
            organizer: { firstName: 'Mike', lastName: 'Chen', trustScore: { current: 92 } },
            goingCount: 8,
            address: 'South Mountain'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string, status: 'going' | 'maybe' | 'not-going') => {
    try {
      const token = localStorage.getItem('token') || 'demo-token';
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        console.log(`RSVP ${status} successful`);
        // Refresh events
        if (userLocation) {
          fetchEvents(userLocation[0], userLocation[1]);
        }
      } else {
        console.log(`Demo RSVP: ${status} for event ${eventId}`);
      }
    } catch (error) {
      console.error('RSVP error:', error);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="Search events near you" 
            className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="absolute right-3 top-2 text-cyan-400 text-lg hover:scale-110 transition-transform"
            title="Create Event"
          >
            +
          </button>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              activeTab === 'upcoming' ? 'bg-cyan-400 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            UPCOMING
          </button>
          <button 
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              activeTab === 'discover' ? 'bg-cyan-400 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            DISCOVER
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition-colors">
            MY EVENTS
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Finding events near you...</p>
          </div>
        ) : (
          <>
            {/* Tab Content */}
            {activeTab === 'upcoming' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900">UPCOMING EVENTS</h3>
                  <span className="text-sm text-gray-500">📍 {userLocation ? 'Location found' : 'Using default'}</span>
                </div>
                
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {events.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No upcoming events found</p>
                      <button 
                        onClick={() => setShowCreateForm(true)}
                        className="bg-cyan-400 text-white px-6 py-2 rounded-full font-medium hover:bg-cyan-500 transition-colors"
                      >
                        Create First Event
                      </button>
                    </div>
                  ) : (
                    events.map((event, index) => {
                      const dateInfo = formatEventDate(event.startDate);
                      return (
                        <div key={event.id || index} className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-xl p-4 hover:shadow-lg transition-shadow">
                          <div className="flex items-start mb-3">
                            <div className="text-center mr-4">
                              <div className="text-2xl font-bold">{dateInfo.day}</div>
                              <div className="text-sm opacity-90">{dateInfo.month}</div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-1">{event.title}</h4>
                              <div className="flex items-center mb-1 text-sm opacity-90">
                                <span className="mr-2">👤</span>
                                <span>By {event.organizer.firstName} {event.organizer.lastName}</span>
                                <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                                  Trust: {event.organizer.trustScore.current}
                                </span>
                              </div>
                              <div className="flex items-center text-sm opacity-90 mb-2">
                                <span className="mr-2">📍</span>
                                <span>{event.address}</span>
                              </div>
                              <div className="flex items-center text-sm opacity-90">
                                <span className="mr-2">👥</span>
                                <span>{event.goingCount} going</span>
                                <span className="ml-4 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                                  {event.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRSVP(event.id, 'going')}
                              className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                            >
                              Going
                            </button>
                            <button
                              onClick={() => handleRSVP(event.id, 'maybe')}
                              className="flex-1 bg-yellow-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                            >
                              Maybe
                            </button>
                            <button
                              onClick={() => handleRSVP(event.id, 'not-going')}
                              className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors"
                            >
                              Can&apos;t Go
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
            
            {activeTab === 'discover' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900">DISCOVER EVENTS</h3>
                  <span className="text-sm text-gray-500">📍 Explore new activities</span>
                </div>
                
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {events.map((event, index) => {
                    const dateInfo = formatEventDate(event.startDate);
                    return (
                      <div key={event.id || index} className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-xl p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start mb-3">
                          <div className="text-center mr-4">
                            <div className="text-2xl font-bold">{dateInfo.day}</div>
                            <div className="text-sm opacity-90">{dateInfo.month}</div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1">{event.title}</h4>
                            <div className="flex items-center mb-1 text-sm opacity-90">
                              <span className="mr-2">👤</span>
                              <span>By {event.organizer.firstName} {event.organizer.lastName}</span>
                              <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                                Trust: {event.organizer.trustScore.current}
                              </span>
                            </div>
                            <div className="flex items-center text-sm opacity-90 mb-2">
                              <span className="mr-2">📍</span>
                              <span>{event.address}</span>
                            </div>
                            <div className="flex items-center text-sm opacity-90">
                              <span className="mr-2">👥</span>
                              <span>{event.goingCount} going</span>
                              <span className="ml-4 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                                {event.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRSVP(event.id, 'going')}
                            className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                          >
                            Going
                          </button>
                          <button
                            onClick={() => handleRSVP(event.id, 'maybe')}
                            className="flex-1 bg-yellow-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                          >
                            Maybe
                          </button>
                          <button
                            onClick={() => handleRSVP(event.id, 'not-going')}
                            className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors"
                          >
                            Can&apos;t Go
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            
            {activeTab === 'my-events' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900">MY EVENTS</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEventsTab('upcoming')}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        eventsTab === 'upcoming' ? 'bg-cyan-400 text-white' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      UPCOMING
                    </button>
                    <button 
                      onClick={() => setEventsTab('past')}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        eventsTab === 'past' ? 'bg-cyan-400 text-white' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      PAST
                    </button>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {eventsTab === 'upcoming' ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No upcoming events you&apos;re attending</p>
                      <button 
                        onClick={() => setActiveTab('discover')}
                        className="bg-cyan-400 text-white px-6 py-2 rounded-full font-medium hover:bg-cyan-500 transition-colors"
                      >
                        Discover Events
                      </button>
                    </div>
                  ) : (
                    [
                      { id: 1, title: 'Coffee Meetup Downtown', date: new Date('2024-05-20').toISOString(), status: 'Attended' },
                      { id: 2, title: 'Art Gallery Opening', date: new Date('2024-05-15').toISOString(), status: 'Attended' },
                      { id: 3, title: 'Tech Conference 2024', date: new Date('2024-05-10').toISOString(), status: 'Attended' },
                      { id: 4, title: 'Photography Workshop', date: new Date('2024-05-05').toISOString(), status: 'Attended' },
                      { id: 5, title: 'Networking Happy Hour', date: new Date('2024-05-01').toISOString(), status: 'Attended' }
                    ].map((event) => {
                      const dateInfo = formatEventDate(event.date);
                      return (
                        <div key={event.id} className="bg-gray-100 text-gray-800 rounded-xl p-4 hover:shadow-lg transition-shadow">
                          <div className="flex items-start mb-3">
                            <div className="text-center mr-4">
                              <div className="text-2xl font-bold">{dateInfo.day}</div>
                              <div className="text-sm opacity-70">{dateInfo.month}</div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-1">{event.title}</h4>
                              <div className="flex items-center text-sm opacity-70">
                                <span className="mr-2">✓</span>
                                <span>{event.status}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                              View Photos
                            </button>
                            <button className="flex-1 bg-gray-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                              Share
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm max-h-[85vh] flex flex-col">
            {/* Fixed Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-bold">Create Event</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Event title" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <textarea 
                  placeholder="Event description" 
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <input 
                  type="datetime-local" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <input 
                  type="text" 
                  placeholder="Location address" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option>Social</option>
                  <option>Professional</option>
                  <option>Sports</option>
                  <option>Educational</option>
                </select>
              </div>
            </div>
            
            {/* Fixed Action Buttons */}
            <div className="border-t border-gray-200 p-4 flex-shrink-0">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-cyan-400 text-white py-2 rounded-lg font-medium hover:bg-cyan-500 transition-colors">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;