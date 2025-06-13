import React, { useState, useEffect } from 'react';
import TrustScoreBreakdown from './TrustScoreBreakdown';
import SocialAccountsModal from './SocialAccountsModal';
import AddAccountModal from './AddAccountModal';
import CreatePostModal from './CreatePostModal';
import FlagModal from './FlagModal';
import CommentsModal from './CommentsModal';
import CreateEventModal from './CreateEventModal';
import EventDetailsModal from './EventDetailsModal';
import AttendeesModal from './AttendeesModal';
import EventReviewModal from './EventReviewModal';
import { getFakeUsers, getFriendsForUser, getRecommendedFriends, searchUsers, getNetworkAnalytics, FakeUser } from '../data/fakeUsers';

interface NavigationProps {
  onNavigate: (screen: string) => void;
}

interface Post {
  id: string;
  reviewer: string;
  reviewerTrustScore: number;
  reviewedPerson: string;
  content: string;
  timestamp: string;
  votes: number;
  userVote: 'up' | 'down' | null;
  comments: number;
  category: string;
  engagement: {
    agrees: number;
    disagrees: number;
    communityValidation: number;
  };
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime?: string;
  organizer: string;
  goingCount: number;
  trustRequired: number;
  category: string;
  location: string;
  isPrivate?: boolean;
  userRSVP?: 'going' | 'maybe' | 'not_going' | null;
}

export default function ScoopApp() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showTrustBreakdown, setShowTrustBreakdown] = useState(false);
  const [showSocialAccounts, setShowSocialAccounts] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [eventFilter, setEventFilter] = useState('upcoming');
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [showEventReview, setShowEventReview] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showInbox, setShowInbox] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Fake user network state
  const [allUsers, setAllUsers] = useState<FakeUser[]>([]);
  const [currentUser, setCurrentUser] = useState<FakeUser | null>(null);
  const [userFriends, setUserFriends] = useState<FakeUser[]>([]);
  const [friendsFilter, setFriendsFilter] = useState('all');
  const [friendsSearchQuery, setFriendsSearchQuery] = useState('');
  const [networkStats, setNetworkStats] = useState<any>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [searchResults, setSearchResults] = useState<{
    events: Event[];
    people: FakeUser[];
    posts: Post[];
  }>({ events: [], people: [], posts: [] });

  // Inbox state
  const [inboxTab, setInboxTab] = useState('all');
  
  // Profile tab state
  const [profileActiveTab, setProfileActiveTab] = useState(0);
  
  // Other user profile viewing state
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<FakeUser | null>(null);
  const [userProfileActiveTab, setUserProfileActiveTab] = useState(0);
  const [showUserFriends, setShowUserFriends] = useState(false);
  const [selectedUserFriends, setSelectedUserFriends] = useState<FakeUser[]>([]);
  
  // Block system state
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  
  // Block system functions
  const blockUser = (username: string) => {
    setBlockedUsers(prev => [...prev, username]);
    // Remove from friends if they were friends
    setUserFriends(prev => prev.filter(friend => friend.name !== username));
    console.log(`Blocked user: ${username}`);
  };
  
  const unblockUser = (username: string) => {
    setBlockedUsers(prev => prev.filter(blocked => blocked !== username));
    console.log(`Unblocked user: ${username}`);
  };
  
  const isUserBlocked = (username: string) => {
    return blockedUsers.includes(username);
  };
  
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'friend_request',
      from: 'Sarah Martinez',
      message: 'sent you a friend request',
      timestamp: '2 hours ago',
      isRead: false,
      actions: ['accept', 'decline']
    },
    {
      id: '2',
      type: 'event_invitation',
      from: 'Mike Johnson',
      message: 'Invited to "Tech Meetup Phoenix"',
      timestamp: '5 hours ago',
      isRead: false,
      actions: ['going', 'maybe', 'pass']
    },
    {
      id: '3',
      type: 'post_mention',
      from: 'Emma Davis',
      message: 'reviewed you',
      content: 'Great collaboration on the mobile app project...',
      timestamp: '1 day ago',
      isRead: true,
      actions: []
    },
    {
      id: '4',
      type: 'friend_reciprocal',
      from: 'David Kim',
      message: 'You and David Kim are now reciprocal friends!',
      timestamp: '2 days ago',
      isRead: true,
      actions: []
    },
    {
      id: '5',
      type: 'event_reminder',
      from: 'System',
      message: '"Coffee & Code" starts in 1 hour',
      timestamp: '3 hours ago',
      isRead: false,
      actions: []
    },
    {
      id: '6',
      type: 'profile_view',
      from: 'Alex Martinez',
      message: 'viewed your profile',
      timestamp: '1 week ago',
      isRead: true,
      actions: []
    },
    {
      id: '7',
      type: 'trust_milestone',
      from: 'System',
      message: 'Congratulations! You\'ve reached Trust Score 95',
      timestamp: '1 week ago',
      isRead: true,
      actions: []
    },
    {
      id: '8',
      type: 'event_invitation',
      from: 'Rachel Brown',
      message: 'Invited to "Book Club Discussion"',
      timestamp: '1 day ago',
      isRead: false,
      actions: ['going', 'maybe', 'pass']
    },
    {
      id: '9',
      type: 'friend_request',
      from: 'Kevin Patel',
      message: 'sent you a friend request',
      timestamp: '3 days ago',
      isRead: false,
      actions: ['accept', 'decline']
    }
  ]);

  // Initialize fake user network
  useEffect(() => {
    try {
      const users = getFakeUsers();
      const stats = getNetworkAnalytics();
      setAllUsers(users);
      setNetworkStats(stats);
      
      // Set the first user as current user for demo
      if (users.length > 0) {
        const user = users[0];
        setCurrentUser(user);
        const friends = getFriendsForUser(user.id);
        setUserFriends(friends);
      }
    } catch (error) {
      console.error('Error initializing fake user network:', error);
    }
  }, []);

  // Search function across all content
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults({ events: [], people: [], posts: [] });
      return;
    }

    const searchTerm = query.toLowerCase();
    
    // Search events
    const filteredEvents = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm) ||
      event.category.toLowerCase().includes(searchTerm) ||
      event.organizer.toLowerCase().includes(searchTerm)
    );

    // Search people (excluding blocked users)
    const filteredPeople = allUsers.filter(user =>
      !isUserBlocked(user.name) &&
      (user.name.toLowerCase().includes(searchTerm) ||
      user.username.toLowerCase().includes(searchTerm) ||
      user.location.city.toLowerCase().includes(searchTerm) ||
      user.location.state.toLowerCase().includes(searchTerm) ||
      (user.occupation && user.occupation.toLowerCase().includes(searchTerm)))
    );

    // Search posts (excluding blocked users)
    const filteredPosts = posts.filter(post =>
      !isUserBlocked(post.reviewer) && !isUserBlocked(post.reviewedPerson) &&
      (post.content.toLowerCase().includes(searchTerm) ||
      post.reviewer.toLowerCase().includes(searchTerm) ||
      post.reviewedPerson.toLowerCase().includes(searchTerm) ||
      post.category.toLowerCase().includes(searchTerm))
    );

    setSearchResults({
      events: filteredEvents,
      people: filteredPeople,
      posts: filteredPosts
    });
  };

  // Filter friends based on search and filter criteria
  const getFilteredFriends = () => {
    let filtered = userFriends;

    // Apply search filter
    if (friendsSearchQuery.trim()) {
      filtered = filtered.filter(friend => 
        friend.name.toLowerCase().includes(friendsSearchQuery.toLowerCase()) ||
        friend.username.toLowerCase().includes(friendsSearchQuery.toLowerCase()) ||
        friend.location.city.toLowerCase().includes(friendsSearchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (friendsFilter) {
      case 'reciprocal':
        // For demo, just show friends with high connection counts as "reciprocal"
        filtered = filtered.filter(friend => friend.connectionCount > 20);
        break;
      case 'recent':
        // Sort by join date (most recent first)
        filtered = filtered.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
        break;
      default:
        // Show all friends
        break;
    }

    return filtered;
  };

  const getAvatarGradient = (name: string): string => {
    const colors = [
      'from-pink-400 to-purple-400',
      'from-blue-400 to-cyan-400', 
      'from-green-400 to-teal-400',
      'from-yellow-400 to-orange-400',
      'from-purple-400 to-pink-400',
      'from-red-400 to-pink-400',
      'from-teal-400 to-blue-400',
      'from-indigo-400 to-purple-400',
      'from-gray-400 to-gray-600',
      'from-emerald-400 to-green-400',
      'from-rose-400 to-red-400',
      'from-amber-400 to-orange-400',
      'from-sky-400 to-cyan-400',
      'from-violet-400 to-purple-400',
      'from-lime-400 to-green-400',
      'from-fuchsia-400 to-pink-400'
    ];
    
    // Use name hash to get consistent color for each user
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const formatLastSeen = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Online';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  // Inbox functionality
  const getFilteredNotifications = () => {
    switch (inboxTab) {
      case 'events':
        return notifications.filter(n => n.type === 'event_invitation' || n.type === 'event_reminder');
      case 'posts':
        return notifications.filter(n => n.type === 'post_mention' || n.type === 'trust_milestone');
      case 'other':
        return notifications.filter(n => n.type === 'friend_request' || n.type === 'friend_reciprocal' || n.type === 'profile_view');
      default:
        return notifications;
    }
  };

  const getNotificationCounts = () => {
    const all = notifications.length;
    const events = notifications.filter(n => n.type === 'event_invitation' || n.type === 'event_reminder').length;
    const posts = notifications.filter(n => n.type === 'post_mention' || n.type === 'trust_milestone').length;
    const other = notifications.filter(n => n.type === 'friend_request' || n.type === 'friend_reciprocal' || n.type === 'profile_view').length;
    return { all, events, posts, other };
  };

  const handleNotificationAction = (notificationId: string, action: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    let message = '';
    
    switch (action) {
      case 'accept':
        message = `✅ Accepted friend request from ${notification.from}`;
        break;
      case 'decline':
        message = `❌ Declined friend request from ${notification.from}`;
        break;
      case 'going':
        message = `✅ RSVP'd "Going" to the event`;
        break;
      case 'maybe':
        message = `🤔 RSVP'd "Maybe" to the event`;
        break;
      case 'pass':
        message = `❌ Passed on the event`;
        break;
    }

    // Remove the notification after action
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    // Show feedback
    alert(message);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    alert('✅ All notifications marked as read');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return { icon: '👥', color: 'bg-blue-500' };
      case 'event_invitation':
        return { icon: '📅', color: 'bg-green-500' };
      case 'post_mention':
        return { icon: '⭐', color: 'bg-purple-500' };
      case 'friend_reciprocal':
        return { icon: '💫', color: 'bg-pink-500' };
      case 'event_reminder':
        return { icon: '🔔', color: 'bg-orange-500' };
      case 'profile_view':
        return { icon: '👁️', color: 'bg-indigo-500' };
      case 'trust_milestone':
        return { icon: '🏆', color: 'bg-yellow-500' };
      default:
        return { icon: '📢', color: 'bg-gray-500' };
    }
  };
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      reviewer: 'Jessica Wong',
      reviewerTrustScore: 95,
      reviewedPerson: 'David Kim',
      content: 'Great project manager! Jessica helped coordinate our agency collaboration and was incredibly organized. Always responded quickly and kept everyone on track.',
      timestamp: '2 days ago',
      votes: 18,
      userVote: null,
      comments: 3,
      category: 'Professional',
      engagement: { agrees: 22, disagrees: 4, communityValidation: 85 }
    },
    {
      id: '2',
      reviewer: 'Mike Johnson',
      reviewerTrustScore: 92,
      reviewedPerson: 'Emma Davis',
      content: 'Honest marketplace seller! Mike bought my gaming laptop and I was completely upfront about the minor scratches. Fair pricing and smooth transaction.',
      timestamp: '3 days ago',
      votes: 15,
      userVote: null,
      comments: 4,
      category: 'Marketplace',
      engagement: { agrees: 18, disagrees: 2, communityValidation: 90 }
    },
    {
      id: '3',
      reviewer: 'Sarah Chen',
      reviewerTrustScore: 89,
      reviewedPerson: 'Alex Martinez',
      content: 'Amazing study partner! Alex and I prepared for the CPA exam together and his motivation kept me going. We both passed thanks to our collaboration.',
      timestamp: '4 days ago',
      votes: 22,
      userVote: null,
      comments: 5,
      category: 'Academic',
      engagement: { agrees: 26, disagrees: 1, communityValidation: 96 }
    },
    {
      id: '4',
      reviewer: 'David Kim',
      reviewerTrustScore: 85,
      reviewedPerson: 'Rachel Brown',
      content: 'Reliable moving help! Sarah showed up early with her truck when I was moving apartments. Refused to take payment and helped until everything was done.',
      timestamp: '5 days ago',
      votes: 19,
      userVote: null,
      comments: 6,
      category: 'Social/Events',
      engagement: { agrees: 23, disagrees: 3, communityValidation: 88 }
    },
    {
      id: '5',
      reviewer: 'Tom Anderson',
      reviewerTrustScore: 67,
      reviewedPerson: 'Kevin Lee',
      content: 'Poor professional follow-through. Kevin asked for help with his resume, I spent hours on it, then he ghosted when it came time to return the favor.',
      timestamp: '1 week ago',
      votes: -5,
      userVote: null,
      comments: 8,
      category: 'Professional',
      engagement: { agrees: 8, disagrees: 15, communityValidation: 35 }
    }
  ]);

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Tech Meetup Phoenix',
      date: 'Tomorrow',
      time: '7:00 PM',
      endTime: '9:00 PM',
      organizer: 'Sarah Wilson (Trust: 87)',
      goingCount: 12,
      trustRequired: 75,
      category: 'Professional',
      location: 'Downtown Phoenix',
      isPrivate: false,
      userRSVP: null
    },
    {
      id: '2',
      title: 'Weekend Hiking Group',
      date: 'Saturday',
      time: '6:00 AM',
      endTime: '12:00 PM',
      organizer: 'Mike Chen (Trust: 92)',
      goingCount: 8,
      trustRequired: 80,
      category: 'Sports',
      location: 'South Mountain',
      isPrivate: true,
      userRSVP: null
    },
    {
      id: '3',
      title: 'Coffee & Code',
      date: 'Sunday',
      time: '10:00 AM',
      endTime: '2:00 PM',
      organizer: 'Alex Rodriguez (Trust: 88)',
      goingCount: 15,
      trustRequired: 70,
      category: 'Social',
      location: 'Central Coffee',
      isPrivate: false,
      userRSVP: null
    },
    {
      id: '4',
      title: 'Happy Hour Networking',
      date: 'Friday',
      time: '5:00 PM',
      endTime: '8:00 PM',
      organizer: 'Jessica Wong (Trust: 95)',
      goingCount: 24,
      trustRequired: 65,
      category: 'Social',
      location: 'The Rooftop Bar',
      isPrivate: false,
      userRSVP: null
    },
    {
      id: '5',
      title: 'Craft Beer Tasting',
      date: 'Thursday',
      time: '7:00 PM',
      endTime: '10:00 PM',
      organizer: 'David Kim (Trust: 85)',
      goingCount: 16,
      trustRequired: 70,
      category: 'Social',
      location: 'Downtown Brewhouse',
      isPrivate: false,
      userRSVP: null
    },
    {
      id: '6',
      title: 'Trivia Night at O\'Malleys Bar',
      date: 'Wednesday',
      time: '8:00 PM',
      endTime: '11:00 PM',
      organizer: 'Sarah Chen (Trust: 89)',
      goingCount: 18,
      trustRequired: 60,
      category: 'Entertainment',
      location: 'O\'Malleys Irish Bar',
      isPrivate: false,
      userRSVP: null
    }
  ]);

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        let newVotes = post.votes;
        let newUserVote: 'up' | 'down' | null = voteType;

        if (post.userVote === voteType) {
          newUserVote = null;
          newVotes = voteType === 'up' ? post.votes - 1 : post.votes + 1;
        } else if (post.userVote === null) {
          newVotes = voteType === 'up' ? post.votes + 1 : post.votes - 1;
        } else {
          newVotes = voteType === 'up' ? post.votes + 2 : post.votes - 2;
        }

        return { ...post, votes: newVotes, userVote: newUserVote };
      }
      return post;
    }));
  };

  const handleRSVP = (eventId: string, status: 'going' | 'maybe' | 'not_going') => {
    console.log(`RSVP to event ${eventId} with status: ${status}`);
    
    // Update the event in state
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, userRSVP: status }
        : event
    ));
  };
  
  const handleViewAttendees = (eventId: string) => {
    setShowAttendees(true);
  };
  
  const handleEventReview = (eventTitle: string, eventId: string) => {
    setSelectedEvent({ id: eventId, title: eventTitle } as Event);
    setShowEventReview(true);
  };
  
  const handleSubmitEventReview = (review: any) => {
    console.log('Event review submitted:', review);
    alert('Thank you for your review! It helps improve future events.');
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen flex items-center justify-center p-4 transition-colors duration-300`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl relative rounded-3xl flex flex-col overflow-hidden mobile-frame transition-colors duration-300`} style={{width: '393px', height: '852px', maxHeight: '852px'}}>
        
        {/* Status Bar */}
        <div className="bg-black text-white px-6 py-2 rounded-t-3xl flex items-center justify-between text-sm flex-shrink-0">
          <span>9:41</span>
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            </div>
            <span className="ml-2">📶</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 overflow-hidden ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`} style={{maxHeight: 'calc(852px - 120px)'}}>
          
          {/* Home Feed Screen */}
          {currentScreen === 'home' && (
            <div className={`h-full flex flex-col transition-all duration-300`} style={{background: isDarkMode ? 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)' : 'linear-gradient(135deg, #f0fdff 0%, #e0f7fa 50%, #b2dfdb 100%)'}}>
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-cyan-300 flex-shrink-0 shadow-lg" style={{background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 20%, #155e75 100%)'}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white drop-shadow-md">Community Feed</h1>
                      <p className="text-xs text-cyan-100 opacity-90">Real people, real reviews</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                      className="w-12 h-12 bg-white shadow-lg border-2 border-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 text-xl font-bold hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-200 hover:scale-105"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                    
                    {showCreateDropdown && (
                      <div className="absolute right-0 top-14 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40 z-50">
                        <button
                          onClick={() => {
                            setShowCreatePost(true);
                            setShowCreateDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          📝 Create Post
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateEvent(true);
                            setShowCreateDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          📅 Create Event
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateDropdown(false);
                            alert('Add Friend functionality would open here');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          👥 Add Friend
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Feed Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar" style={{scrollbarWidth: 'thin', scrollbarColor: '#9CA3AF #F3F4F6'}}>
                <div className="px-4 py-3 space-y-3 pb-4">
                  {posts.filter(post => !isUserBlocked(post.reviewer) && !isUserBlocked(post.reviewedPerson)).map((post) => (
                    <div key={post.id} className="rounded-lg shadow-md border border-cyan-200" style={{background: 'linear-gradient(145deg, #ffffff 0%, #f8fdff 100%)'}}>
                      <div className="flex">
                        {/* Vote Column */}
                        <div className="flex flex-col items-center justify-center py-4 px-3 border-r border-cyan-200 w-16" style={{background: 'linear-gradient(180deg, #f0fdff 0%, #e6fffa 100%)'}}>
                          <button 
                            onClick={() => handleVote(post.id, 'up')}
                            className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                              post.userVote === 'up' ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                            } hover:scale-105`}
                          >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path d="M5 15l7-7 7 7"></path>
                            </svg>
                          </button>
                          <span className={`text-lg font-bold py-2 ${post.votes > 0 ? 'text-green-600' : post.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {post.votes}
                          </span>
                          <button 
                            onClick={() => handleVote(post.id, 'down')}
                            className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                              post.userVote === 'down' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            } hover:scale-105`}
                          >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </button>
                        </div>

                        {/* Post Content */}
                        <div className="flex-1 p-4">
                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-medium text-gray-900 mr-2">{post.reviewer}</span>
                              <span className="text-gray-400 mx-2">reviewed</span>
                              <span className="text-sm font-medium text-cyan-600 cursor-pointer hover:text-cyan-700 ml-2">{post.reviewedPerson}</span>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="px-3 py-1 rounded-full text-xs font-medium shadow-sm bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300">
                                Trust: {post.reviewerTrustScore}
                              </span>
                              <span className="text-xs text-gray-500">{post.timestamp}</span>
                              <span className="px-2 py-1 bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 rounded-full text-xs font-medium border border-cyan-300 shadow-sm">
                                {post.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1 text-xs">
                                <span className="text-green-600">👍 {post.engagement.agrees}</span>
                                <span className="text-red-600">👎 {post.engagement.disagrees}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  post.engagement.communityValidation >= 80 ? 'bg-green-100 text-green-800' : 
                                  post.engagement.communityValidation >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
                                }`}>
                                  Community: {post.engagement.communityValidation}%
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="cursor-pointer hover:bg-gray-50 rounded p-2 -m-2 transition-colors mb-3">
                            <p className="text-gray-800 text-sm leading-relaxed hover:text-gray-900">{post.content}</p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center space-x-4">
                              <button 
                                onClick={() => {
                                  setSelectedPost(post);
                                  setShowComments(true);
                                }}
                                className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                                <span className="text-sm">{post.comments}</span>
                              </button>
                              <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                                </svg>
                                <span className="text-sm">Share</span>
                              </button>
                            </div>
                            <button 
                              onClick={() => {
                                setSelectedPost(post);
                                setShowFlagModal(true);
                              }}
                              className="flex items-center text-gray-500 hover:text-red-600 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"></path>
                              </svg>
                              <span className="text-sm">Flag</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Screen */}
          {currentScreen === 'profile' && (
            <div className="h-full bg-white">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-6 text-center text-white relative">
                <div className="absolute top-4 left-4 flex space-x-2">
                  <button 
                    onClick={() => setShowInbox(true)}
                    className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <span className="text-white text-lg">📨</span>
                  </button>
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <span className="text-white text-lg">⚙️</span>
                  </button>
                </div>
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                    className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                  
                  {showCreateDropdown && (
                    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40 z-50">
                      <button
                        onClick={() => {
                          setShowCreatePost(true);
                          setShowCreateDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📝 Create Post
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateEvent(true);
                          setShowCreateDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📅 Create Event
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateDropdown(false);
                          alert('Add Friend functionality would open here');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        👥 Add Friend
                      </button>
                    </div>
                  )}
                </div>
                <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-cyan-600 text-2xl">👤</span>
                </div>
                <h2 className="text-xl font-bold">Riesling LeFluuf</h2>
                <p className="opacity-90 text-sm">@BigStinky</p>
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <button 
                    onClick={() => setShowTrustBreakdown(true)}
                    className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Trust Score: 95 📊
                  </button>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">✓ Verified</span>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-700 text-sm mb-4">
                  Software engineer passionate about building trust and connection in digital communities. Always looking to collaborate on meaningful projects.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">VERIFIED</span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">OUTGOING</span>
                  <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs">TECH</span>
                  <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">RELIABLE</span>
                </div>

                {/* Social Accounts Preview - Side by Side */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Social Accounts</h3>
                    <button 
                      onClick={() => setShowSocialAccounts(true)}
                      className="text-cyan-600 text-sm hover:text-cyan-700"
                    >
                      View all
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Connected Accounts - Side by Side */}
                    <div className="flex space-x-2">
                      {/* Twitter */}
                      <button 
                        onClick={() => window.open('https://twitter.com/BigStinky', '_blank')}
                        className="w-11 h-11 bg-blue-400 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-blue-500 transition-colors"
                      >
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg" alt="Twitter" className="w-full h-full filter invert" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </button>
                      
                      {/* LinkedIn */}
                      <button 
                        onClick={() => window.open('https://linkedin.com/in/riesling-lefluuf', '_blank')}
                        className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-blue-700 transition-colors"
                      >
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" alt="LinkedIn" className="w-full h-full filter invert" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </button>
                      
                      {/* GitHub */}
                      <button 
                        onClick={() => window.open('https://github.com/RieslingCodes', '_blank')}
                        className="w-11 h-11 bg-gray-800 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-gray-900 transition-colors"
                      >
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" alt="GitHub" className="w-full h-full filter invert" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </button>

                      {/* Instagram */}
                      <button 
                        onClick={() => window.open('https://instagram.com/wine_and_code', '_blank')}
                        className="w-11 h-11 bg-pink-500 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-pink-600 transition-colors"
                      >
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" className="w-full h-full filter invert" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </button>

                      {/* YouTube */}
                      <button 
                        onClick={() => window.open('https://youtube.com/c/WineTechReviews', '_blank')}
                        className="w-11 h-11 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-red-600 transition-colors"
                      >
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg" alt="YouTube" className="w-full h-full filter invert" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </button>
                    </div>
                    
                    {/* Add Account Button */}
                    <button 
                      onClick={() => setShowAddAccount(true)}
                      className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-cyan-400 hover:bg-cyan-50 transition-colors flex items-center justify-center"
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm hover:bg-cyan-500 transition-colors">+</div>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <div className="text-xl font-bold text-cyan-600">127</div>
                    <div className="text-xs text-gray-500">Reviews</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-cyan-600">{currentUser?.connectionCount || 0}</div>
                    <div className="text-xs text-gray-500">Connections</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-cyan-600">15</div>
                    <div className="text-xs text-gray-500">Events</div>
                  </div>
                </div>
                
                {/* Horizontal Swipeable Sections */}
                <div className="mb-6">
                  {/* Tab Navigation */}
                  <div className="flex border-b border-gray-200 mb-4">
                    {['Posts', 'Groups', 'Likes'].map((tab, index) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setProfileActiveTab(index);
                          const container = document.getElementById('profile-content-container');
                          if (container) {
                            container.scrollTo({
                              left: index * container.offsetWidth,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={`flex-1 py-3 text-center font-semibold text-sm transition-colors ${
                          profileActiveTab === index
                            ? 'text-cyan-500 border-b-2 border-cyan-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Horizontal Scrollable Content */}
                  <div 
                    id="profile-content-container"
                    className="overflow-x-auto overflow-y-hidden scrollbar-hide"
                    onScroll={(e) => {
                      const container = e.currentTarget;
                      const scrollLeft = container.scrollLeft;
                      const containerWidth = container.offsetWidth;
                      const newActiveIndex = Math.round(scrollLeft / containerWidth);
                      
                      if (newActiveIndex !== profileActiveTab) {
                        setProfileActiveTab(newActiveIndex);
                      }
                    }}
                    style={{ scrollSnapType: 'x mandatory', height: '400px' }}
                  >
                    <div className="flex h-full" style={{ width: '300%' }}>
                      {/* Posts Section */}
                      <div className="w-1/3 h-full overflow-y-auto scrollbar-hide pr-4" style={{ scrollSnapAlign: 'start' }}>
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-bold">R</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">Coffee Shop Review</p>
                                <p className="text-xs text-gray-500">2 hours ago</p>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3 text-sm">Amazing coffee and great WiFi for remote work! Perfect spot for morning meetings. ☕</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center text-gray-500">
                                  <span className="mr-1">👍</span>
                                  <span className="text-sm">24</span>
                                </button>
                                <button className="flex items-center text-gray-500">
                                  <span className="mr-1">💬</span>
                                  <span className="text-sm">5</span>
                                </button>
                              </div>
                              <div className="flex items-center">
                                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-bold">R</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">App Collaboration Review</p>
                                <p className="text-xs text-gray-500">2 days ago</p>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3 text-sm">Worked with @TechGuru on a mobile app project. Great communication and delivered quality code on time! 📱</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center text-gray-500">
                                  <span className="mr-1">👍</span>
                                  <span className="text-sm">18</span>
                                </button>
                                <button className="flex items-center text-gray-500">
                                  <span className="mr-1">💬</span>
                                  <span className="text-sm">3</span>
                                </button>
                              </div>
                              <div className="flex items-center">
                                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-bold">R</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">Marketplace Transaction</p>
                                <p className="text-xs text-gray-500">1 week ago</p>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3 text-sm">Bought a laptop from @TechSeller. Item was exactly as described and shipped quickly. Highly recommend! 💻</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center text-gray-500">
                                  <span className="mr-1">👍</span>
                                  <span className="text-sm">15</span>
                                </button>
                                <button className="flex items-center text-gray-500">
                                  <span className="mr-1">💬</span>
                                  <span className="text-sm">2</span>
                                </button>
                              </div>
                              <div className="flex items-center">
                                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Groups Section - Public Events */}
                      <div className="w-1/3 h-full overflow-y-auto scrollbar-hide px-2" style={{ scrollSnapAlign: 'start' }}>
                        <div className="space-y-4">
                          {/* Events I'm Attending */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Events I'm Attending</h4>
                            {events.filter(event => !event.isPrivate && event.userRSVP === 'going').length === 0 ? (
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <p className="text-sm text-gray-500 text-center">No public events attended yet</p>
                              </div>
                            ) : (
                              events.filter(event => !event.isPrivate && event.userRSVP === 'going').map((event) => (
                                <div key={event.id} className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                                  <div className="flex items-center mb-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-3">
                                      <span className="text-white text-sm font-bold">📅</span>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-800 text-sm">{event.title}</p>
                                      <p className="text-xs text-gray-500">{event.date}, {event.time}</p>
                                    </div>
                                    <span className="text-xs text-green-600 font-semibold">Going</span>
                                  </div>
                                  <p className="text-gray-600 text-xs">{event.location} • {event.goingCount} attending</p>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Public Events I Created */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Events I Created</h4>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                              <div className="flex items-center mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">🎯</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 text-sm">Phoenix Startup Pitch Night</p>
                                  <p className="text-xs text-gray-500">Next Friday, 6:00 PM</p>
                                </div>
                                <span className="text-xs text-purple-600 font-semibold">Organizer</span>
                              </div>
                              <p className="text-gray-600 text-xs">Downtown Phoenix • 28 going</p>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                              <div className="flex items-center mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">☕</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 text-sm">Monthly Coffee Meetup</p>
                                  <p className="text-xs text-gray-500">Next Saturday, 10:00 AM</p>
                                </div>
                                <span className="text-xs text-blue-600 font-semibold">Organizer</span>
                              </div>
                              <p className="text-gray-600 text-xs">Central Coffee • 15 going</p>
                            </div>
                          </div>

                          {/* All Public Events */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Upcoming Public Events</h4>
                            {events.filter(event => !event.isPrivate).slice(0, 3).map((event) => (
                              <div key={event.id} className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                                <div className="flex items-center mb-2">
                                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3">
                                    <span className="text-white text-sm font-bold">
                                      {event.category === 'Professional' && '💼'}
                                      {event.category === 'Social' && '🎉'}
                                      {event.category === 'Sports' && '⚽'}
                                      {event.category === 'Entertainment' && '🎭'}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-800 text-sm">{event.title}</p>
                                    <p className="text-xs text-gray-500">{event.date}, {event.time}</p>
                                  </div>
                                  <button className="text-xs text-cyan-600 font-semibold">View</button>
                                </div>
                                <p className="text-gray-600 text-xs">{event.location} • {event.goingCount} going</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Likes Section - User Interactions */}
                      <div className="w-1/3 h-full overflow-y-auto scrollbar-hide pl-2" style={{ scrollSnapAlign: 'start' }}>
                        <div className="space-y-4">
                          {/* Posts I've Liked */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Posts I've Liked</h4>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">S</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 text-sm">Sarah's Restaurant Review</p>
                                  <p className="text-xs text-gray-500">👍 You liked this • 3 hours ago</p>
                                </div>
                              </div>
                              <p className="text-gray-700 mb-2 text-xs">Amazing Italian food! The pasta was homemade and the service was outstanding. 🍝</p>
                              <div className="flex items-center">
                                <span className="text-yellow-500 mr-2 text-xs">⭐⭐⭐⭐⭐</span>
                                <span className="text-xs text-gray-500">Tony's Italian Kitchen</span>
                              </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">M</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 text-sm">Marcus's Tech Review</p>
                                  <p className="text-xs text-gray-500">👍 You liked this • 1 day ago</p>
                                </div>
                              </div>
                              <p className="text-gray-700 mb-2 text-xs">Amazing developer to work with! Clean code and great communication throughout the project. 💻</p>
                              <div className="flex items-center">
                                <span className="text-yellow-500 mr-2 text-xs">⭐⭐⭐⭐⭐</span>
                                <span className="text-xs text-gray-500">Professional Review</span>
                              </div>
                            </div>
                          </div>

                          {/* Events I've Interacted With */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Events I've Interacted With</h4>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">🎵</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 text-sm">Jazz Night at Blue Note</p>
                                  <p className="text-xs text-gray-500">💬 You commented • 2 days ago</p>
                                </div>
                              </div>
                              <p className="text-gray-700 text-xs">Amazing atmosphere and incredible musicians! Best jazz club in the city. 🎷</p>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">☕</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 text-sm">Coffee & Code Meetup</p>
                                  <p className="text-xs text-gray-500">📅 You RSVP'd Going • 1 week ago</p>
                                </div>
                              </div>
                              <p className="text-gray-700 text-xs">Perfect networking event for developers. Great coffee and even better conversations!</p>
                            </div>
                          </div>

                          {/* Comments I've Made */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Recent Comments</h4>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">A</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 text-sm">Alex's Coffee Shop Post</p>
                                  <p className="text-xs text-gray-500">💬 You commented • 3 days ago</p>
                                </div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <p className="text-gray-700 text-xs italic">"Totally agree! This place has become my go-to workspace. The barista team is fantastic too!"</p>
                              </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">L</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 text-sm">Lisa's Professional Review</p>
                                  <p className="text-xs text-gray-500">💬 You commented • 4 days ago</p>
                                </div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <p className="text-gray-700 text-xs italic">"Lisa is an amazing project manager! Made our development process so much smoother."</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Friends Screen */}
          {currentScreen === 'friends' && (
            <div className="h-full flex flex-col" style={{background: 'linear-gradient(135deg, #f0fdff 0%, #e0f7fa 50%, #b2dfdb 100%)'}}>
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-cyan-300 flex-shrink-0 shadow-lg" style={{background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 20%, #155e75 100%)'}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white drop-shadow-md">Friends</h1>
                      <p className="text-xs text-cyan-100 opacity-90">Your trusted network</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                      className="w-12 h-12 bg-white shadow-lg border-2 border-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 text-xl font-bold hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-200 hover:scale-105"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                    
                    {showCreateDropdown && (
                      <div className="absolute right-0 top-14 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40 z-50">
                        <button
                          onClick={() => {
                            setShowCreatePost(true);
                            setShowCreateDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          📝 Create Post
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateEvent(true);
                            setShowCreateDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          📅 Create Event
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateDropdown(false);
                            alert('Add Friend functionality would open here');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          👥 Add Friend
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Friends Content */}
              <div className="flex-1 overflow-hidden bg-white">
                <div className="p-4 border-b border-gray-200">
                
                {/* Search Bar */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search friends..."
                    value={friendsSearchQuery}
                    onChange={(e) => setFriendsSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                
                {/* Friend Categories */}
                <div className="flex space-x-2 mb-4">
                  <button 
                    onClick={() => setFriendsFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      friendsFilter === 'all' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All ({userFriends.length})
                  </button>
                  <button 
                    onClick={() => setFriendsFilter('reciprocal')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      friendsFilter === 'reciprocal' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Reciprocal ({userFriends.filter(f => f.connectionCount > 20).length})
                  </button>
                  <button 
                    onClick={() => setFriendsFilter('recent')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      friendsFilter === 'recent' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Most Recent
                  </button>
                </div>
              </div>
              
              {/* Friends List */}
              <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                <div className="space-y-3">
                  {getFilteredFriends().map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getAvatarGradient(friend.name)} rounded-full flex items-center justify-center text-white font-bold`}>
                          {friend.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{friend.name}</div>
                          <div className="text-sm text-gray-600">
                            Trust Score: {friend.trustScore} • {friend.isOnline ? 'Online' : formatLastSeen(friend.lastSeen)}
                          </div>
                          <div className="text-xs text-gray-500">{friend.location.city}, {friend.location.state}</div>
                          {friend.occupation && (
                            <div className="text-xs text-gray-400">{friend.occupation}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedUser(friend);
                            setCurrentScreen('user-profile');
                            setUserProfileActiveTab(0);
                          }}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs hover:bg-gray-300"
                        >
                          View Profile
                        </button>
                        {isUserBlocked(friend.name) ? (
                          <button 
                            onClick={() => unblockUser(friend.name)}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button 
                            onClick={() => blockUser(friend.name)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600"
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {getFilteredFriends().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-lg mb-2">🔍</div>
                      <div>No friends found</div>
                      <div className="text-sm">Try adjusting your search or filters</div>
                    </div>
                  )}
                  
                  {getFilteredFriends().length > 0 && (
                    <div className="text-center py-4 text-sm text-gray-500">
                      Showing {getFilteredFriends().length} of {userFriends.length} friends
                      {networkStats && (
                        <div className="mt-2 text-xs">
                          Network: {networkStats.totalUsers} users, {networkStats.avgConnections} avg connections
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          )}

          {/* Events Screen */}
          {currentScreen === 'groups' && (
            <div className="h-full flex flex-col" style={{background: 'linear-gradient(135deg, #f0fdff 0%, #e0f7fa 50%, #b2dfdb 100%)'}}>
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-cyan-300 flex-shrink-0 shadow-lg" style={{background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 20%, #155e75 100%)'}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white drop-shadow-md">Local Events</h1>
                      <p className="text-xs text-cyan-100 opacity-90">Discover and connect</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                      className="w-12 h-12 bg-white shadow-lg border-2 border-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 text-xl font-bold hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-200 hover:scale-105"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                    
                    {showCreateDropdown && (
                      <div className="absolute right-0 top-14 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40 z-50">
                        <button
                          onClick={() => {
                            setShowCreatePost(true);
                            setShowCreateDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          📝 Create Post
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateEvent(true);
                            setShowCreateDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          📅 Create Event
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateDropdown(false);
                            alert('Add Friend functionality would open here');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          👥 Add Friend
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Events Content */}
              <div className="flex-1 flex flex-col bg-white">
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <button className="text-cyan-600 text-sm">📍 Phoenix, AZ</button>
                  </div>
                
                <div className="flex space-x-2 mb-4 overflow-x-auto">
                  <button 
                    onClick={() => setEventFilter('upcoming')}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                      eventFilter === 'upcoming' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Upcoming
                  </button>
                  <button 
                    onClick={() => setEventFilter('past')}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                      eventFilter === 'past' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Past
                  </button>
                  <button 
                    onClick={() => setEventFilter('discover')}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                      eventFilter === 'discover' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Discover
                  </button>
                </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  
                  {eventFilter === 'upcoming' && events.filter(event => event.date === 'Tomorrow' || event.date === 'Saturday' || event.date === 'Sunday').map((event) => (
                    <div key={event.id} className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl p-4 shadow-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <p className="text-sm opacity-90">{event.date}, {event.time} - {event.endTime}</p>
                          <p className="text-xs opacity-75">{event.location}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="inline-block bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">Upcoming</span>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              event.isPrivate ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {event.isPrivate ? 'Private' : 'Public'}
                            </span>
                            {event.userRSVP && (
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                event.userRSVP === 'going' ? 'bg-green-100 text-green-800' :
                                event.userRSVP === 'maybe' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                You: {event.userRSVP === 'going' ? 'Going' : event.userRSVP === 'maybe' ? 'Maybe' : 'Not Going'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">{event.goingCount} going</span>
                          <div className="text-xs mt-1 opacity-75">Min Trust: {event.trustRequired}</div>
                        </div>
                      </div>
                      <p className="text-sm mb-3 opacity-90">By {event.organizer}</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleRSVP(event.id, 'going')}
                          className="flex-1 bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                        >
                          RSVP Going
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowEventDetails(true);
                          }}
                          className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {eventFilter === 'past' && (
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-xl p-4 shadow-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">Phoenix Developers Mixer</h3>
                            <p className="text-sm opacity-90">Last Friday, 7:00 PM</p>
                            <p className="text-xs opacity-75">CityScape Center</p>
                            <span className="inline-block bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs font-medium mt-1">Completed</span>
                          </div>
                          <div className="text-right">
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">24 attended</span>
                            <div className="text-xs mt-1 opacity-75">Trust: 75+</div>
                          </div>
                        </div>
                        <p className="text-sm mb-3 opacity-90">By Mike Johnson (Trust: 92)</p>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium">
                            ✓ Attended
                          </button>
                          <button 
                            onClick={() => handleEventReview('Phoenix Developers Mixer', '1')}
                            className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-xl p-4 shadow-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">Startup Pitch Night</h3>
                            <p className="text-sm opacity-90">2 weeks ago, 6:30 PM</p>
                            <p className="text-xs opacity-75">Innovation Hub</p>
                            <span className="inline-block bg-purple-300 text-purple-700 px-2 py-1 rounded-full text-xs font-medium mt-1">Completed</span>
                          </div>
                          <div className="text-right">
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">18 attended</span>
                            <div className="text-xs mt-1 opacity-75">Trust: 80+</div>
                          </div>
                        </div>
                        <p className="text-sm mb-3 opacity-90">By Sarah Wilson (Trust: 87)</p>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium">
                            ✓ Attended
                          </button>
                          <button 
                            onClick={() => handleEventReview('Startup Pitch Night', '2')}
                            className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {eventFilter === 'discover' && (
                    <div className="space-y-3">
                      {/* Map View */}
                      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl p-4 shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-lg">📍 Events Near You</h4>
                          <button className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg text-sm hover:bg-opacity-30 transition-colors">
                            Full Map
                          </button>
                        </div>
                        <div className="bg-white bg-opacity-90 rounded-lg p-3 text-gray-800">
                          <div className="text-center text-xs text-gray-600 mb-2">Phoenix, AZ Area</div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-red-100 text-red-800 p-2 rounded text-center">
                              📸 Photography<br/>Papago Park<br/>5 mi
                            </div>
                            <div className="bg-green-100 text-green-800 p-2 rounded text-center">
                              📚 Book Club<br/>Central Library<br/>3 mi
                            </div>
                            <div className="bg-purple-100 text-purple-800 p-2 rounded text-center">
                              🎨 Art Class<br/>Arts District<br/>7 mi
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl p-4 shadow-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">Photography Meetup</h3>
                            <p className="text-sm opacity-90">Next Friday, 5:00 PM - 8:00 PM</p>
                            <p className="text-xs opacity-75">Papago Park</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="inline-block bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">New Discovery</span>
                              <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Public</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">6 going</span>
                            <div className="text-xs mt-1 opacity-75">Min Trust: 65</div>
                          </div>
                        </div>
                        <p className="text-sm mb-3 opacity-90">By Emma Davis (Trust: 88)</p>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleRSVP('discover-1', 'going')}
                            className="flex-1 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                          >
                            Join Event
                          </button>
                          <button 
                            onClick={() => {
                              const discoverEvent = {
                                id: 'discover-1',
                                title: 'Photography Meetup',
                                date: 'Next Friday',
                                time: '5:00 PM',
                                endTime: '8:00 PM',
                                organizer: 'Emma Davis (Trust: 88)',
                                goingCount: 6,
                                trustRequired: 65,
                                category: 'Arts',
                                location: 'Papago Park',
                                isPrivate: false
                              };
                              setSelectedEvent(discoverEvent);
                              setShowEventDetails(true);
                            }}
                            className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-xl p-4 shadow-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">Book Club Discussion</h3>
                            <p className="text-sm opacity-90">Next Wednesday, 7:30 PM - 9:30 PM</p>
                            <p className="text-xs opacity-75">Central Library</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="inline-block bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">Recommended</span>
                              <span className="inline-block bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">Private</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">9 going</span>
                            <div className="text-xs mt-1 opacity-75">Min Trust: 70</div>
                          </div>
                        </div>
                        <p className="text-sm mb-3 opacity-90">By Rachel Brown (Trust: 91)</p>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleRSVP('discover-2', 'going')}
                            className="flex-1 bg-white text-pink-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                          >
                            Join Event
                          </button>
                          <button 
                            onClick={() => {
                              const discoverEvent = {
                                id: 'discover-2',
                                title: 'Book Club Discussion',
                                date: 'Next Wednesday',
                                time: '7:30 PM',
                                endTime: '9:30 PM',
                                organizer: 'Rachel Brown (Trust: 91)',
                                goingCount: 9,
                                trustRequired: 70,
                                category: 'Academic',
                                location: 'Central Library',
                                isPrivate: true
                              };
                              setSelectedEvent(discoverEvent);
                              setShowEventDetails(true);
                            }}
                            className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Screen */}
          {currentScreen === 'search' && (
            <div className="h-full flex flex-col" style={{background: 'linear-gradient(135deg, #f0fdff 0%, #e0f7fa 50%, #b2dfdb 100%)'}}>
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-cyan-300 flex-shrink-0 shadow-lg" style={{background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 20%, #155e75 100%)'}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white drop-shadow-md">Search</h1>
                      <p className="text-xs text-cyan-100 opacity-90">Find people, events & posts</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                      className="w-12 h-12 bg-white shadow-lg border-2 border-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 text-xl font-bold hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-200 hover:scale-105"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                    
                    {showCreateDropdown && (
                      <div className="absolute right-0 top-14 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40 z-50">
                        <button
                          onClick={() => {
                            setShowCreatePost(true);
                            setShowCreateDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          📝 Create Post
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateEvent(true);
                            setShowCreateDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          📅 Create Event
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateDropdown(false);
                            alert('Add Friend functionality would open here');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          👥 Add Friend
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Content */}
              <div className="flex-1 flex flex-col bg-white">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search for people, events, bars, happy hour..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        performSearch(e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Search Filters */}
                  <div className="flex space-x-2 mt-3">
                    <button 
                      onClick={() => setSearchFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        searchFilter === 'all' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setSearchFilter('events')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        searchFilter === 'events' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Events ({searchResults.events.length})
                    </button>
                    <button 
                      onClick={() => setSearchFilter('people')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        searchFilter === 'people' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      People ({searchResults.people.length})
                    </button>
                    <button 
                      onClick={() => setSearchFilter('posts')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        searchFilter === 'posts' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Posts ({searchResults.posts.length})
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-y-auto p-4">
                  {!searchQuery.trim() ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-lg mb-2">🔍</div>
                      <div className="text-lg font-medium">Start searching</div>
                      <div className="text-sm">Find people, events, or posts in your community</div>
                      <div className="mt-4 space-y-2 text-xs text-gray-400">
                        <div>Try: "bar", "happy hour", "Sarah", "tech meetup"</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Events Results */}
                      {(searchFilter === 'all' || searchFilter === 'events') && searchResults.events.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Events</h3>
                          <div className="space-y-3">
                            {searchResults.events.map((event) => (
                              <div 
                                key={event.id} 
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setShowEventDetails(true);
                                }}
                                className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg p-3 shadow-md cursor-pointer hover:from-green-500 hover:to-green-700 transition-all"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="font-bold">{event.title}</h4>
                                    <p className="text-sm opacity-90">{event.date}, {event.time}</p>
                                    <p className="text-xs opacity-75">{event.location}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">{event.goingCount} going</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* People Results */}
                      {(searchFilter === 'all' || searchFilter === 'people') && searchResults.people.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">People</h3>
                          <div className="space-y-3">
                            {searchResults.people.map((person) => (
                              <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-10 h-10 bg-gradient-to-r ${getAvatarGradient(person.name)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                                    {person.avatar}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-800">{person.name}</div>
                                    <div className="text-sm text-gray-600">Trust Score: {person.trustScore}</div>
                                    <div className="text-xs text-gray-500">{person.location.city}, {person.location.state}</div>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => {
                                      setSelectedUser(person);
                                      setCurrentScreen('user-profile');
                                      setUserProfileActiveTab(0);
                                    }}
                                    className="bg-cyan-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-cyan-600"
                                  >
                                    View Profile
                                  </button>
                                  {isUserBlocked(person.name) ? (
                                    <button 
                                      onClick={() => unblockUser(person.name)}
                                      className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                                    >
                                      Unblock
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => blockUser(person.name)}
                                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                                    >
                                      Block
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Posts Results */}
                      {(searchFilter === 'all' || searchFilter === 'posts') && searchResults.posts.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Posts</h3>
                          <div className="space-y-3">
                            {searchResults.posts.filter(post => !isUserBlocked(post.reviewer) && !isUserBlocked(post.reviewedPerson)).map((post) => (
                              <div 
                                key={post.id} 
                                onClick={() => {
                                  setSelectedPost(post);
                                  setShowComments(true);
                                }}
                                className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-900">{post.reviewer}</span>
                                    <span className="text-gray-400 text-xs">reviewed</span>
                                    <span className="text-sm font-medium text-cyan-600">{post.reviewedPerson}</span>
                                  </div>
                                  <span className="px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-xs">
                                    Trust: {post.reviewerTrustScore}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>{post.category}</span>
                                  <span>{post.timestamp}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No Results */}
                      {searchQuery.trim() && 
                       searchResults.events.length === 0 && 
                       searchResults.people.length === 0 && 
                       searchResults.posts.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <div className="text-lg mb-2">😔</div>
                          <div className="text-lg font-medium">No results found</div>
                          <div className="text-sm">Try different keywords or check your spelling</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* User Profile Screen */}
          {currentScreen === 'user-profile' && selectedUser && (
            <div className="h-full bg-white">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-6 text-center text-white relative">
                <div className="absolute top-4 left-4 flex space-x-2">
                  <button 
                    onClick={() => setCurrentScreen('search')}
                    className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => {
                      const friends = getFriendsForUser(selectedUser.id);
                      setSelectedUserFriends(friends);
                      setShowUserFriends(true);
                    }}
                    className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <span className="text-white text-lg">👥</span>
                  </button>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    onClick={() => blockUser(selectedUser.name)}
                    className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                    className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                  
                  {showCreateDropdown && (
                    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40 z-50">
                      <button
                        onClick={() => {
                          setShowCreatePost(true);
                          setShowCreateDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📝 Create Post
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateEvent(true);
                          setShowCreateDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📅 Create Event
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateDropdown(false);
                          alert('Add Friend functionality would open here');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        👥 Add Friend
                      </button>
                    </div>
                  )}
                </div>
                <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-cyan-600 text-2xl">{selectedUser.avatar}</span>
                </div>
                <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                <p className="opacity-90 text-sm">@{selectedUser.username}</p>
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <button 
                    onClick={() => setShowTrustBreakdown(true)}
                    className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Trust Score: {selectedUser.trustScore} 📊
                  </button>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">✓ Verified</span>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-700 text-sm mb-4">
                  {selectedUser.occupation} from {selectedUser.location.city}, {selectedUser.location.state}. 
                  Interests include {selectedUser.interests.slice(0, 3).join(', ')}.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">VERIFIED</span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">TRUSTED</span>
                  <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs">{selectedUser.interests[0].toUpperCase()}</span>
                  <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
                </div>

                {/* Social Accounts Preview - Side by Side */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Social Accounts</h3>
                    <button 
                      onClick={() => setShowSocialAccounts(true)}
                      className="text-cyan-600 text-sm hover:text-cyan-700"
                    >
                      View all
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Connected Accounts - Side by Side */}
                    <div className="flex space-x-2">
                      {/* Twitter */}
                      <button 
                        onClick={() => window.open(`https://twitter.com/${selectedUser.username}`, '_blank')}
                        className="w-11 h-11 bg-blue-400 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-blue-500 transition-colors"
                      >
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg" alt="Twitter" className="w-full h-full filter invert" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </button>
                      
                      {/* LinkedIn */}
                      <button 
                        onClick={() => window.open(`https://linkedin.com/in/${selectedUser.username}`, '_blank')}
                        className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-blue-700 transition-colors"
                      >
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" alt="LinkedIn" className="w-full h-full filter invert" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </button>
                      
                      {/* GitHub */}
                      <button 
                        onClick={() => window.open(`https://github.com/${selectedUser.username}`, '_blank')}
                        className="w-11 h-11 bg-gray-800 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-gray-900 transition-colors"
                      >
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" alt="GitHub" className="w-full h-full filter invert" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </button>

                      {/* Instagram */}
                      <button 
                        onClick={() => window.open(`https://instagram.com/${selectedUser.username}`, '_blank')}
                        className="w-11 h-11 bg-pink-500 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-pink-600 transition-colors"
                      >
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" className="w-full h-full filter invert" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </button>

                      {/* YouTube */}
                      <button 
                        onClick={() => window.open(`https://youtube.com/${selectedUser.username}`, '_blank')}
                        className="w-11 h-11 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-red-600 transition-colors"
                      >
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg" alt="YouTube" className="w-full h-full filter invert" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </button>
                    </div>
                    
                    {/* Add Account Button */}
                    <button 
                      onClick={() => setShowAddAccount(true)}
                      className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-cyan-400 hover:bg-cyan-50 transition-colors flex items-center justify-center"
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm hover:bg-cyan-500 transition-colors">+</div>
                    </button>
                  </div>
                </div>

                  <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <div className="text-xl font-bold text-cyan-600">12</div>
                    <div className="text-xs text-gray-500">Reviews</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-cyan-600">89</div>
                    <div className="text-xs text-gray-500">Connections</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-cyan-600">8</div>
                    <div className="text-xs text-gray-500">Events</div>
                  </div>
                </div>


                
                {/* Horizontal Swipeable Sections */}
                <div className="mb-6">
                  {/* Tab Navigation */}
                  <div className="flex border-b border-gray-200 mb-4">
                    {['Posts', 'Groups', 'Likes'].map((tab, index) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setUserProfileActiveTab(index);
                          const container = document.getElementById('user-profile-content-container');
                          if (container) {
                            container.scrollTo({
                              left: index * container.offsetWidth,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={`flex-1 py-3 text-center font-semibold text-sm transition-colors ${
                          userProfileActiveTab === index
                            ? 'text-cyan-500 border-b-2 border-cyan-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Horizontal Scrollable Content */}
                  <div 
                    id="user-profile-content-container"
                    className="overflow-x-auto overflow-y-hidden scrollbar-hide"
                    onScroll={(e) => {
                      const container = e.currentTarget;
                      const scrollLeft = container.scrollLeft;
                      const containerWidth = container.offsetWidth;
                      const newActiveIndex = Math.round(scrollLeft / containerWidth);
                      
                      if (newActiveIndex !== userProfileActiveTab) {
                        setUserProfileActiveTab(newActiveIndex);
                      }
                    }}
                    style={{ scrollSnapType: 'x mandatory', height: '400px' }}
                  >
                    <div className="flex h-full" style={{ width: '300%' }}>
                      {/* Posts Section */}
                      <div className="w-1/3 h-full overflow-y-auto pr-4" style={{ scrollSnapAlign: 'start' }}>
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start mb-3">
                              <div className={`w-8 h-8 bg-gradient-to-r ${getAvatarGradient(selectedUser.name)} rounded-full flex items-center justify-center mr-3 text-white font-bold text-sm`}>
                                {selectedUser.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="font-semibold text-gray-800 text-sm">{selectedUser.name}</span>
                                  <span className="text-gray-500 text-xs ml-2">• 2 hours ago</span>
                                </div>
                                <p className="text-gray-700 text-sm mb-2">
                                  Just finished an amazing {selectedUser.interests[0].toLowerCase()} session! 
                                  Really excited about the progress I'm making.
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>❤️ 15 likes</span>
                                  <span>💬 3 comments</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start mb-3">
                              <div className={`w-8 h-8 bg-gradient-to-r ${getAvatarGradient(selectedUser.name)} rounded-full flex items-center justify-center mr-3 text-white font-bold text-sm`}>
                                {selectedUser.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="font-semibold text-gray-800 text-sm">{selectedUser.name}</span>
                                  <span className="text-gray-500 text-xs ml-2">• 1 day ago</span>
                                </div>
                                <p className="text-gray-700 text-sm mb-2">
                                  Had a wonderful time at the local {selectedUser.interests[1].toLowerCase()} meetup yesterday. 
                                  Met some incredible people and learned so much!
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>❤️ 23 likes</span>
                                  <span>💬 7 comments</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start mb-3">
                              <div className={`w-8 h-8 bg-gradient-to-r ${getAvatarGradient(selectedUser.name)} rounded-full flex items-center justify-center mr-3 text-white font-bold text-sm`}>
                                {selectedUser.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="font-semibold text-gray-800 text-sm">{selectedUser.name}</span>
                                  <span className="text-gray-500 text-xs ml-2">• 3 days ago</span>
                                </div>
                                <p className="text-gray-700 text-sm mb-2">
                                  Looking forward to the weekend! Planning to check out some new places in {selectedUser.location.city}.
                                  Any recommendations?
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>❤️ 8 likes</span>
                                  <span>💬 12 comments</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start mb-3">
                              <div className={`w-8 h-8 bg-gradient-to-r ${getAvatarGradient(selectedUser.name)} rounded-full flex items-center justify-center mr-3 text-white font-bold text-sm`}>
                                {selectedUser.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="font-semibold text-gray-800 text-sm">{selectedUser.name}</span>
                                  <span className="text-gray-500 text-xs ml-2">• 5 days ago</span>
                                </div>
                                <p className="text-gray-700 text-sm mb-2">
                                  Great networking event last week! Connected with so many like-minded professionals.
                                  Building real connections in our community.
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>❤️ 19 likes</span>
                                  <span>💬 5 comments</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Groups Section */}
                      <div className="w-1/3 h-full overflow-y-auto pr-4" style={{ scrollSnapAlign: 'start' }}>
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-bold">💼</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Tech Networking Event</p>
                                <p className="text-xs text-gray-500">Attended • Last week</p>
                              </div>
                            </div>
                            <p className="text-gray-600 text-xs">{selectedUser.location.city} Convention Center • 45 attended</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-bold">🎯</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">{selectedUser.interests[0]} Meetup</p>
                                <p className="text-xs text-gray-500">Going • This weekend</p>
                              </div>
                            </div>
                            <p className="text-gray-600 text-xs">Downtown Community Center • 28 going</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-bold">🎨</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Creative Workshop</p>
                                <p className="text-xs text-gray-500">Created • Next month</p>
                              </div>
                            </div>
                            <p className="text-gray-600 text-xs">Local Art Studio • 15 interested</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-bold">🍕</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Food Truck Friday</p>
                                <p className="text-xs text-gray-500">Attended • 2 weeks ago</p>
                              </div>
                            </div>
                            <p className="text-gray-600 text-xs">City Park • 120 attended</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-bold">📚</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Book Club Meeting</p>
                                <p className="text-xs text-gray-500">Going • Next Tuesday</p>
                              </div>
                            </div>
                            <p className="text-gray-600 text-xs">Local Library • 12 going</p>
                          </div>
                        </div>
                      </div>

                      {/* Likes Section */}
                      <div className="w-1/3 h-full overflow-y-auto" style={{ scrollSnapAlign: 'start' }}>
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-bold">❤️</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Liked Sarah's Restaurant Review</p>
                                <p className="text-xs text-gray-500">2 hours ago</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-bold">💬</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Commented on Tech Meetup Event</p>
                                <p className="text-xs text-gray-500">1 day ago</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-bold">👍</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Liked Mike's Coffee Shop Post</p>
                                <p className="text-xs text-gray-500">2 days ago</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-bold">💬</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Commented on Art Gallery Opening</p>
                                <p className="text-xs text-gray-500">3 days ago</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-bold">❤️</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Liked Local Band Performance</p>
                                <p className="text-xs text-gray-500">4 days ago</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-bold">💬</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Commented on Fitness Class Review</p>
                                <p className="text-xs text-gray-500">5 days ago</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 px-2 py-2 rounded-b-3xl flex-shrink-0 relative z-50">
          <div className="flex justify-around items-center">
            <button 
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-colors ${
                currentScreen === 'home' ? 'text-cyan-600' : 'text-gray-500'
              }`}
            >
              <span className="text-lg mb-1">🏠</span>
              <span className="text-xs font-medium leading-tight">Home</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('groups')}
              className={`flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-colors ${
                currentScreen === 'groups' ? 'text-cyan-600' : 'text-gray-500'
              }`}
            >
              <span className="text-lg mb-1">📅</span>
              <span className="text-xs font-medium leading-tight">Events</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('search')}
              className={`flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-colors ${
                currentScreen === 'search' ? 'text-cyan-600' : 'text-gray-500'
              }`}
            >
              <span className="text-lg mb-1">🔍</span>
              <span className="text-xs font-medium leading-tight">Search</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('friends')}
              className={`flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-colors ${
                currentScreen === 'friends' ? 'text-cyan-600' : 'text-gray-500'
              }`}
            >
              <span className="text-lg mb-1">👥</span>
              <span className="text-xs font-medium leading-tight">Friends</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('profile')}
              className={`flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-colors ${
                currentScreen === 'profile' ? 'text-cyan-600' : 'text-gray-500'
              }`}
            >
              <span className="text-lg mb-1">👤</span>
              <span className="text-xs font-medium leading-tight">Profile</span>
            </button>
          </div>
        </div>

        {/* Modals */}
        {showTrustBreakdown && (
          <TrustScoreBreakdown 
            trustScore={95} 
            onClose={() => setShowTrustBreakdown(false)} 
          />
        )}
        
        {showSocialAccounts && (
          <SocialAccountsModal 
            onClose={() => setShowSocialAccounts(false)} 
          />
        )}
        
        {showAddAccount && (
          <AddAccountModal 
            onClose={() => setShowAddAccount(false)}
            onAddAccount={(account) => {
              // Handle adding account (could update state here if needed)
              console.log('Account added:', account);
            }}
          />
        )}

        {showCreatePost && (
          <CreatePostModal 
            onClose={() => setShowCreatePost(false)}
            onSubmit={(newPost) => {
              setPosts([newPost, ...posts]);
            }}
            isUserBlocked={isUserBlocked}
          />
        )}

        {showFlagModal && selectedPost && (
          <FlagModal 
            onClose={() => {
              setShowFlagModal(false);
              setSelectedPost(null);
            }}
            onSubmit={(flagData) => {
              console.log('Post flagged:', flagData);
              alert('Thank you for your report. Our moderation team will review this content.');
            }}
            postId={selectedPost.id}
          />
        )}

        {showComments && selectedPost && (
          <CommentsModal 
            onClose={() => {
              setShowComments(false);
              setSelectedPost(null);
            }}
            postId={selectedPost.id}
            postAuthor={selectedPost.reviewer}
            postContent={selectedPost.content}
            isUserBlocked={isUserBlocked}
          />
        )}

        {showCreateEvent && (
          <CreateEventModal 
            onClose={() => setShowCreateEvent(false)}
            onSubmit={(newEvent) => {
              setEvents([newEvent, ...events]);
              alert('Event created successfully! It will appear in the events list.');
            }}
          />
        )}
        
        {showEventDetails && selectedEvent && (
          <EventDetailsModal 
            onClose={() => {
              setShowEventDetails(false);
              setSelectedEvent(null);
            }}
            event={selectedEvent}
            onRSVP={handleRSVP}
            onViewAttendees={handleViewAttendees}
            isUserBlocked={isUserBlocked}
          />
        )}
        
        {showAttendees && selectedEvent && (
          <AttendeesModal 
            onClose={() => setShowAttendees(false)}
            eventTitle={selectedEvent.title}
            eventId={selectedEvent.id}
            isUserBlocked={isUserBlocked}
          />
        )}
        
        {showEventReview && selectedEvent && (
          <EventReviewModal 
            onClose={() => {
              setShowEventReview(false);
              setSelectedEvent(null);
            }}
            eventTitle={selectedEvent.title}
            eventId={selectedEvent.id}
            onSubmitReview={handleSubmitEventReview}
          />
        )}
        
        {showInbox && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-sm max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Inbox</h2>
                <button
                  onClick={() => setShowInbox(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex border-b border-gray-200">
                <button 
                  onClick={() => setInboxTab('all')}
                  className={`flex-1 py-2 px-3 text-sm font-medium ${
                    inboxTab === 'all' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  All ({getNotificationCounts().all})
                </button>
                <button 
                  onClick={() => setInboxTab('events')}
                  className={`flex-1 py-2 px-3 text-sm font-medium ${
                    inboxTab === 'events' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Events ({getNotificationCounts().events})
                </button>
                <button 
                  onClick={() => setInboxTab('posts')}
                  className={`flex-1 py-2 px-3 text-sm font-medium ${
                    inboxTab === 'posts' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Posts ({getNotificationCounts().posts})
                </button>
                <button 
                  onClick={() => setInboxTab('other')}
                  className={`flex-1 py-2 px-3 text-sm font-medium ${
                    inboxTab === 'other' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Other ({getNotificationCounts().other})
                </button>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-100">
                  
                  {getFilteredNotifications().map((notification) => {
                    const { icon, color } = getNotificationIcon(notification.type);
                    
                    return (
                      <div key={notification.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white text-sm`}>
                            {icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.from !== 'System' && (
                                <span className="font-semibold">{notification.from}</span>
                              )}
                              {notification.from !== 'System' ? ` ${notification.message}` : notification.message}
                            </p>
                            {notification.content && (
                              <p className="text-xs text-gray-600 mt-1">"{notification.content}"</p>
                            )}
                            <p className="text-xs text-gray-500">{notification.timestamp}</p>
                            
                            {/* Action Buttons */}
                            {notification.actions.length > 0 && (
                              <div className="flex space-x-2 mt-2">
                                {notification.actions.map((action) => {
                                  let buttonClass = '';
                                  let buttonText = '';
                                  
                                  switch (action) {
                                    case 'accept':
                                      buttonClass = 'bg-cyan-500 text-white hover:bg-cyan-600';
                                      buttonText = 'Accept';
                                      break;
                                    case 'decline':
                                      buttonClass = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
                                      buttonText = 'Decline';
                                      break;
                                    case 'going':
                                      buttonClass = 'bg-green-500 text-white hover:bg-green-600';
                                      buttonText = 'Going';
                                      break;
                                    case 'maybe':
                                      buttonClass = 'bg-yellow-500 text-white hover:bg-yellow-600';
                                      buttonText = 'Maybe';
                                      break;
                                    case 'pass':
                                      buttonClass = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
                                      buttonText = 'Pass';
                                      break;
                                  }
                                  
                                  return (
                                    <button
                                      key={action}
                                      onClick={() => handleNotificationAction(notification.id, action)}
                                      className={`px-3 py-1 rounded text-xs ${buttonClass}`}
                                    >
                                      {buttonText}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {getFilteredNotifications().length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <div className="text-lg mb-2">📭</div>
                      <div>No notifications in this category</div>
                      <div className="text-sm">You're all caught up!</div>
                    </div>
                  )}

                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <button 
                  onClick={markAllAsRead}
                  className="w-full text-center text-sm text-cyan-600 hover:text-cyan-700"
                >
                  Mark All as Read
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg w-full max-w-md max-h-[85vh] flex flex-col transition-colors duration-300`}>
              {/* Header */}
              <div className={`flex justify-between items-center p-4 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Settings Content */}
              <div className="flex-1 overflow-y-auto">
                
                {/* Account Section */}
                <div className={`p-4 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Account</h3>
                  <div className="space-y-3">
                    <button className={`w-full flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}>
                      <div className="flex items-center">
                        <span className="text-lg mr-3">👤</span>
                        <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Edit Profile</span>
                      </div>
                      <span className="text-gray-400">→</span>
                    </button>
                  </div>
                </div>

                {/* Privacy & Security Section */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Privacy & Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">👁️</span>
                        <span className="text-gray-700">Trust Score Always Visible</span>
                      </div>
                      <span className="text-sm text-gray-500">Enabled</span>
                    </div>
                    
                    <button 
                      onClick={() => setShowBlockedUsers(true)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-3">🚫</span>
                        <span className="text-gray-700">Blocked Users ({blockedUsers.length})</span>
                      </div>
                      <span className="text-gray-400">→</span>
                    </button>
                  </div>
                </div>

                {/* Notifications Section */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">📧</span>
                        <span className="text-gray-700">Email Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">📱</span>
                        <span className="text-gray-700">SMS Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">🌙</span>
                        <span className="text-gray-700">Dark Mode</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={isDarkMode}
                          onChange={(e) => setIsDarkMode(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">🌍</span>
                        <span className="text-gray-700">Language</span>
                      </div>
                      <select className="text-sm border border-gray-300 rounded px-2 py-1">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Support Section */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Support</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">❓</span>
                        <span className="text-gray-700">Help Center</span>
                      </div>
                      <span className="text-gray-400">→</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">📞</span>
                        <span className="text-gray-700">Contact Support</span>
                      </div>
                      <span className="text-gray-400">→</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">📋</span>
                        <span className="text-gray-700">Terms of Service</span>
                      </div>
                      <span className="text-gray-400">→</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">🔒</span>
                        <span className="text-gray-700">Privacy Policy</span>
                      </div>
                      <span className="text-gray-400">→</span>
                    </button>
                  </div>
                </div>

                {/* Account Actions Section */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Account</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">🚪</span>
                        <span className="text-red-600 font-medium">Log Out</span>
                      </div>
                      <span className="text-red-400">→</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">🗑️</span>
                        <span className="text-red-600 font-medium">Delete Account</span>
                      </div>
                      <span className="text-red-400">→</span>
                    </button>
                  </div>
                </div>

              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">ScoopSocials v1.0.0</p>
                <p className="text-xs text-gray-400 mt-1">Building trust in digital connections</p>
              </div>
            </div>
          </div>
        )}

        {/* Blocked Users Modal */}
        {showBlockedUsers && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Blocked Users</h2>
                <button 
                  onClick={() => setShowBlockedUsers(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto max-h-96">
                {blockedUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🚫</div>
                    <div className="text-lg font-medium mb-1">No blocked users</div>
                    <div className="text-sm">You haven't blocked anyone yet</div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {blockedUsers.map((username) => (
                      <div key={username} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getAvatarGradient(username)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                            {username.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{username}</div>
                            <div className="text-xs text-gray-500">Blocked user</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => unblockUser(username)}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Blocked users won't appear in your feed, search results, or friend recommendations
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Modal - Matches Main Profile Format */}
        {showUserProfile && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col" style={{height: '600px'}}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-800">{selectedUser.name}'s Profile</h2>
                <button 
                  onClick={() => setShowUserProfile(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Profile Content - Matching Main Profile Format */}
              <div className="flex-1 overflow-y-auto">
                {/* Profile Header Section */}
                <div className="text-center p-6" style={{background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 20%, #155e75 100%)'}}>
                  <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className={`text-2xl bg-gradient-to-r ${getAvatarGradient(selectedUser.name)} bg-clip-text text-transparent font-bold`}>
                      {selectedUser.avatar}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedUser.name}</h2>
                  <p className="opacity-90 text-sm text-cyan-100">@{selectedUser.username}</p>
                  <div className="flex justify-center items-center mt-4 space-x-2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Trust Score: {selectedUser.trustScore} 📊
                    </span>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">✓ Verified</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-700 text-sm mb-4">
                    {selectedUser.occupation} from {selectedUser.location.city}, {selectedUser.location.state}. 
                    Interests include {selectedUser.interests.slice(0, 3).join(', ')}.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">VERIFIED</span>
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">TRUSTED</span>
                    <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs">{selectedUser.interests[0].toUpperCase()}</span>
                    <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
                  </div>

                  {/* Social Accounts Preview */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-800">Social Accounts</h3>
                      <button 
                        onClick={() => setShowSocialAccounts(true)}
                        className="text-cyan-600 text-sm hover:text-cyan-700"
                      >
                        View all
                      </button>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      {/* Connected Accounts - Side by Side */}
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => window.open(`https://twitter.com/${selectedUser.username}`, '_blank')}
                          className="w-11 h-11 bg-blue-400 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-blue-500 transition-colors"
                        >
                          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg" alt="Twitter" className="w-full h-full filter invert" />
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => window.open(`https://linkedin.com/in/${selectedUser.username}`, '_blank')}
                          className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-blue-700 transition-colors"
                        >
                          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" alt="LinkedIn" className="w-full h-full filter invert" />
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => window.open(`https://github.com/${selectedUser.username}`, '_blank')}
                          className="w-11 h-11 bg-gray-800 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-gray-900 transition-colors"
                        >
                          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" alt="GitHub" className="w-full h-full filter invert" />
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </button>

                        <button 
                          onClick={() => window.open(`https://instagram.com/${selectedUser.username}`, '_blank')}
                          className="w-11 h-11 bg-pink-500 rounded-lg flex items-center justify-center text-white text-sm p-1.5 relative hover:bg-pink-600 transition-colors"
                        >
                          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" className="w-full h-full filter invert" />
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </button>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => {
                            const userFriends = getFriendsForUser(selectedUser.id);
                            setSelectedUserFriends(userFriends);
                            setShowUserFriends(true);
                          }}
                          className="bg-cyan-500 text-white py-1 px-3 rounded-lg text-xs font-semibold hover:bg-cyan-600"
                        >
                          👥 Friends
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to block ${selectedUser.name}? They won't appear in your feed or search results.`)) {
                              blockUser(selectedUser.name);
                              setShowUserProfile(false);
                            }
                          }}
                          className="bg-red-100 text-red-700 py-1 px-3 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors"
                        >
                          🚫 Block?
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div>
                      <div className="text-xl font-bold text-cyan-600">45</div>
                      <div className="text-xs text-gray-500">Reviews</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-cyan-600">{selectedUser.connectionCount}</div>
                      <div className="text-xs text-gray-500">Connections</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-cyan-600">8</div>
                      <div className="text-xs text-gray-500">Events</div>
                    </div>
                  </div>
                  
                  {/* Horizontal Swipeable Sections */}
                  <div className="mb-6">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200 mb-4">
                      {['Posts', 'Groups', 'Likes'].map((tab, index) => (
                        <button
                          key={tab}
                          onClick={() => setUserProfileActiveTab(index)}
                          className={`flex-1 py-3 text-center font-semibold text-sm transition-colors ${
                            userProfileActiveTab === index
                              ? 'text-cyan-500 border-b-2 border-cyan-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div style={{ height: '200px' }} className="overflow-y-auto">
                      {userProfileActiveTab === 0 && (
                        // Posts Tab
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-3">
                              <div className={`w-8 h-8 bg-gradient-to-r ${getAvatarGradient(selectedUser.name)} rounded-full flex items-center justify-center mr-3`}>
                                <span className="text-white text-sm font-bold">{selectedUser.avatar}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 text-sm">{selectedUser.occupation} Review</p>
                                <p className="text-xs text-gray-500">3 days ago</p>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3 text-sm">Amazing experience working with this professional! Great communication and delivered excellent results on time. 💼</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center text-gray-500">
                                  <span className="mr-1">👍</span>
                                  <span className="text-sm">12</span>
                                </button>
                                <button className="flex items-center text-gray-500">
                                  <span className="mr-1">💬</span>
                                  <span className="text-sm">3</span>
                                </button>
                              </div>
                              <div className="flex items-center">
                                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-3">
                              <div className={`w-8 h-8 bg-gradient-to-r ${getAvatarGradient(selectedUser.name)} rounded-full flex items-center justify-center mr-3`}>
                                <span className="text-white text-sm font-bold">{selectedUser.avatar}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 text-sm">Coffee Shop Review</p>
                                <p className="text-xs text-gray-500">1 week ago</p>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3 text-sm">Found this hidden gem! Perfect atmosphere for remote work and the coffee is incredible. ☕</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center text-gray-500">
                                  <span className="mr-1">👍</span>
                                  <span className="text-sm">18</span>
                                </button>
                                <button className="flex items-center text-gray-500">
                                  <span className="mr-1">💬</span>
                                  <span className="text-sm">5</span>
                                </button>
                              </div>
                              <div className="flex items-center">
                                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {userProfileActiveTab === 1 && (
                        // Groups/Events Tab
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Recent Events</h4>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">💼</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 text-sm">Tech Networking Event</p>
                                  <p className="text-xs text-gray-500">Attended • Last week</p>
                                </div>
                              </div>
                              <p className="text-gray-600 text-xs">{selectedUser.location.city} Convention Center • 45 attended</p>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">🎯</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 text-sm">{selectedUser.interests[0]} Meetup</p>
                                  <p className="text-xs text-gray-500">Going • This weekend</p>
                                </div>
                              </div>
                              <p className="text-gray-600 text-xs">Local Community Center • 23 going</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {userProfileActiveTab === 2 && (
                        // Likes Tab
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Recent Activity</h4>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                              <div className="flex items-center mb-2">
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-xs font-bold">❤️</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 text-sm">Liked Sarah's Restaurant Review</p>
                                  <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center mb-2">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-xs font-bold">💬</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 text-sm">Commented on Tech Meetup Event</p>
                                  <p className="text-xs text-gray-500">1 day ago</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Friends Modal */}
        {showUserFriends && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedUser?.name}'s Friends ({selectedUserFriends.length})
                </h2>
                <button 
                  onClick={() => setShowUserFriends(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Friends List */}
              <div className="flex-1 overflow-y-auto max-h-96">
                {selectedUserFriends.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">👥</div>
                    <div className="text-lg font-medium mb-1">No friends to show</div>
                    <div className="text-sm">This user hasn't connected with anyone yet</div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {selectedUserFriends.map((friend) => (
                      <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getAvatarGradient(friend.name)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                            {friend.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{friend.name}</div>
                            <div className="text-sm text-gray-600">
                              Trust Score: {friend.trustScore} • {friend.isOnline ? 'Online' : 'Offline'}
                            </div>
                            <div className="text-xs text-gray-500">{friend.location.city}, {friend.location.state}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setShowUserFriends(false);
                            setSelectedUser(friend);
                            setCurrentScreen('user-profile');
                            setUserProfileActiveTab(0);
                          }}
                          className="bg-cyan-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-cyan-600"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  These are {selectedUser?.name}'s connections in their network
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}