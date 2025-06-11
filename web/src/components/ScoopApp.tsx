import React, { useState, useEffect } from 'react';
import TrustScoreBreakdown from './TrustScoreBreakdown';
import SocialAccountsModal from './SocialAccountsModal';
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
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [profileTab, setProfileTab] = useState('posts');
  const [eventFilter, setEventFilter] = useState('upcoming');
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [showEventReview, setShowEventReview] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showInbox, setShowInbox] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  
  // Fake user network state
  const [allUsers, setAllUsers] = useState<FakeUser[]>([]);
  const [currentUser, setCurrentUser] = useState<FakeUser | null>(null);
  const [userFriends, setUserFriends] = useState<FakeUser[]>([]);
  const [friendsFilter, setFriendsFilter] = useState('all');
  const [friendsSearchQuery, setFriendsSearchQuery] = useState('');
  const [networkStats, setNetworkStats] = useState<any>(null);

  // Inbox state
  const [inboxTab, setInboxTab] = useState('all');
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
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl relative rounded-3xl flex flex-col overflow-hidden mobile-frame" style={{width: '393px', height: '852px', maxHeight: '852px'}}>
        
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
        <div className="flex-1 overflow-hidden" style={{maxHeight: 'calc(852px - 120px)'}}>
          
          {/* Home Feed Screen */}
          {currentScreen === 'home' && (
            <div className="h-full flex flex-col" style={{background: 'linear-gradient(135deg, #f0fdff 0%, #e0f7fa 50%, #b2dfdb 100%)'}}>
              
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
                  {posts.map((post) => (
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
                <button 
                  onClick={() => setShowInbox(true)}
                  className="absolute top-4 right-4 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                >
                  <span className="text-white text-lg">📨</span>
                </button>
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

                {/* Social Accounts Preview */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">Social Accounts</h3>
                    <button 
                      onClick={() => setShowSocialAccounts(true)}
                      className="text-cyan-600 text-sm hover:text-cyan-700"
                    >
                      Manage
                    </button>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center text-white text-sm p-2">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg" alt="Twitter" className="w-full h-full filter invert" />
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm p-2">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" alt="LinkedIn" className="w-full h-full filter invert" />
                    </div>
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white text-sm p-2">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" alt="GitHub" className="w-full h-full filter invert" />
                    </div>
                    <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white text-sm p-2">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" className="w-full h-full filter invert" />
                    </div>
                    <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-lg">+</div>
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
                
                {/* Profile Tabs */}
                <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setProfileTab('posts')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      profileTab === 'posts' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Posts
                  </button>
                  <button 
                    onClick={() => setProfileTab('groups')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      profileTab === 'groups' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Groups
                  </button>
                  <button 
                    onClick={() => setProfileTab('likes')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      profileTab === 'likes' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Likes
                  </button>
                </div>
                
                {/* Tab Content */}
                <div className="overflow-y-auto" style={{ height: 'calc(100vh - 500px)', minHeight: '200px' }}>
                  {profileTab === 'posts' && (
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="text-sm font-medium text-gray-900 mb-1">Recent Review</div>
                        <p className="text-xs text-gray-600 mb-2">"Fantastic collaboration on the mobile app project. Sarah was professional and delivered quality work on time."</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">⭐ 5.0</span>
                          <span className="mr-2">👍 12</span>
                          <span>2 days ago</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="text-sm font-medium text-gray-900 mb-1">Product Review</div>
                        <p className="text-xs text-gray-600 mb-2">"Mike was incredibly honest about the car's condition. No hidden issues, fair price, smooth transaction."</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">⭐ 4.8</span>
                          <span className="mr-2">👍 8</span>
                          <span>1 week ago</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="text-sm font-medium text-gray-900 mb-1">Academic Collaboration</div>
                        <p className="text-xs text-gray-600 mb-2">"Emma helped me prepare for my certification exam. Patient teacher and shared great study materials."</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">⭐ 5.0</span>
                          <span className="mr-2">👍 15</span>
                          <span>2 weeks ago</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {profileTab === 'groups' && (
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-gray-900">Phoenix Tech Meetup</div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Organizer</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">Monthly meetup for software developers and tech enthusiasts in Phoenix.</p>
                        <div className="text-xs text-gray-500">247 members • 12 events hosted</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-gray-900">React Native Developers</div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Member</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">Community for React Native developers to share knowledge and collaborate.</p>
                        <div className="text-xs text-gray-500">1,429 members • Joined 3 months ago</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-gray-900">Phoenix Wine Enthusiasts</div>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Member</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">For wine lovers in the Phoenix area to share tastings and recommendations.</p>
                        <div className="text-xs text-gray-500">89 members • Joined 1 month ago</div>
                      </div>
                    </div>
                  )}
                  
                  {profileTab === 'likes' && (
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="text-sm font-medium text-gray-900 mb-1">Liked Review</div>
                        <p className="text-xs text-gray-600 mb-2">"Emma was incredibly helpful during our apartment hunt. Professional, patient, and found us the perfect place!"</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">By Sarah Chen</span>
                          <span className="mr-2">⭐ 5.0</span>
                          <span>Liked 3 days ago</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="text-sm font-medium text-gray-900 mb-1">Liked Event</div>
                        <p className="text-xs text-gray-600 mb-2">"Coffee & Code Session - Weekly meetup for developers to code together and share knowledge."</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">Organized by Alex Rodriguez</span>
                          <span>Liked 1 week ago</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="text-sm font-medium text-gray-900 mb-1">Liked Review</div>
                        <p className="text-xs text-gray-600 mb-2">"David's food truck serves authentic tacos. Great prices, generous portions, friendly service!"</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">By Mike Rodriguez</span>
                          <span className="mr-2">⭐ 4.9</span>
                          <span>Liked 1 week ago</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Friends Screen */}
          {currentScreen === 'friends' && (
            <div className="h-full bg-white">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Friends</h2>
                  <div className="relative">
                    <button 
                      onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                      className="bg-cyan-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      Create
                    </button>
                    
                    {showCreateDropdown && (
                      <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40 z-50">
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
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs hover:bg-gray-300">
                          View Profile
                        </button>
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
          )}

          {/* Events Screen */}
          {currentScreen === 'groups' && (
            <div className="h-full bg-white">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Local Events</h2>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <button 
                        onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                        className="bg-cyan-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Create
                      </button>
                      
                      {showCreateDropdown && (
                        <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40 z-50">
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
                    <button className="text-cyan-600 text-sm">📍 Phoenix, AZ</button>
                  </div>
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
              
              <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
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
            <button className="flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-colors text-gray-500">
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

        {showCreatePost && (
          <CreatePostModal 
            onClose={() => setShowCreatePost(false)}
            onSubmit={(newPost) => {
              setPosts([newPost, ...posts]);
            }}
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
          />
        )}
        
        {showAttendees && selectedEvent && (
          <AttendeesModal 
            onClose={() => setShowAttendees(false)}
            eventTitle={selectedEvent.title}
            eventId={selectedEvent.id}
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
      </div>
    </div>
  );
}