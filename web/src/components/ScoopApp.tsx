import React, { useState } from 'react';
import TrustScoreBreakdown from './TrustScoreBreakdown';
import SocialAccountsModal from './SocialAccountsModal';
import CreatePostModal from './CreatePostModal';
import FlagModal from './FlagModal';
import CommentsModal from './CommentsModal';
import CreateEventModal from './CreateEventModal';

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
  organizer: string;
  goingCount: number;
  trustRequired: number;
  category: string;
  location: string;
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
  const [eventFilter, setEventFilter] = useState('all');
  
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
      organizer: 'Sarah Wilson (Trust: 87)',
      goingCount: 12,
      trustRequired: 75,
      category: 'Professional',
      location: 'Downtown Phoenix'
    },
    {
      id: '2',
      title: 'Weekend Hiking Group',
      date: 'Saturday',
      time: '6:00 AM',
      organizer: 'Mike Chen (Trust: 92)',
      goingCount: 8,
      trustRequired: 80,
      category: 'Sports',
      location: 'South Mountain'
    },
    {
      id: '3',
      title: 'Coffee & Code',
      date: 'Sunday',
      time: '10:00 AM',
      organizer: 'Alex Rodriguez (Trust: 88)',
      goingCount: 15,
      trustRequired: 70,
      category: 'Social',
      location: 'Central Coffee'
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

  const handleRSVP = (eventId: string) => {
    console.log(`RSVP to event ${eventId}`);
    // In a real app, this would make an API call
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
                  <button 
                    onClick={() => setShowCreatePost(true)}
                    className="w-12 h-12 bg-white shadow-lg border-2 border-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 text-xl font-bold hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-200 hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
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
              <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-6 text-center text-white">
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
                  <div className="flex space-x-2 mb-4">
                    <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center text-white text-sm">🐦</div>
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">💼</div>
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white text-sm">👨‍💻</div>
                    <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white text-sm">📸</div>
                    <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-lg">+</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <div className="text-xl font-bold text-cyan-600">127</div>
                    <div className="text-xs text-gray-500">Reviews</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-cyan-600">89</div>
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
                <div className="space-y-3">
                  {profileTab === 'posts' && (
                    <div>
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
                        <div className="text-sm font-medium text-gray-900 mb-1">Community Post</div>
                        <p className="text-xs text-gray-600 mb-2">"Looking for iOS developers in Phoenix area for a fintech project. DM me if interested!"</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">💬 8</span>
                          <span className="mr-2">👍 15</span>
                          <span>1 week ago</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {profileTab === 'groups' && (
                    <div>
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
                    </div>
                  )}
                  
                  {profileTab === 'likes' && (
                    <div>
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
                    <button 
                      onClick={() => setShowCreateEvent(true)}
                      className="bg-cyan-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors"
                    >
                      + Create
                    </button>
                    <button className="text-cyan-600 text-sm">📍 Phoenix, AZ</button>
                  </div>
                </div>
                
                <div className="flex space-x-2 mb-4 overflow-x-auto">
                  <button 
                    onClick={() => setEventFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                      eventFilter === 'all' ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All
                  </button>
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
                  {eventFilter === 'all' && events.map((event) => (
                    <div key={event.id} className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-xl p-4 shadow-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <p className="text-sm opacity-90">{event.date}, {event.time}</p>
                          <p className="text-xs opacity-75">{event.location}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">{event.goingCount} going</span>
                          <div className="text-xs mt-1 opacity-75">Min Trust: {event.trustRequired}</div>
                        </div>
                      </div>
                      <p className="text-sm mb-3 opacity-90">By {event.organizer}</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleRSVP(event.id)}
                          className="flex-1 bg-white text-cyan-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                        >
                          RSVP Going
                        </button>
                        <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors">
                          Maybe
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {eventFilter === 'upcoming' && events.filter(event => event.date === 'Tomorrow' || event.date === 'Saturday' || event.date === 'Sunday').map((event) => (
                    <div key={event.id} className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl p-4 shadow-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <p className="text-sm opacity-90">{event.date}, {event.time}</p>
                          <p className="text-xs opacity-75">{event.location}</p>
                          <span className="inline-block bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium mt-1">Upcoming</span>
                        </div>
                        <div className="text-right">
                          <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">{event.goingCount} going</span>
                          <div className="text-xs mt-1 opacity-75">Min Trust: {event.trustRequired}</div>
                        </div>
                      </div>
                      <p className="text-sm mb-3 opacity-90">By {event.organizer}</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleRSVP(event.id)}
                          className="flex-1 bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                        >
                          RSVP Going
                        </button>
                        <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors">
                          Maybe
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
                          <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors">
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
                          <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors">
                            Review
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {eventFilter === 'discover' && (
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl p-4 shadow-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">Photography Meetup</h3>
                            <p className="text-sm opacity-90">Next Friday, 5:00 PM</p>
                            <p className="text-xs opacity-75">Papago Park</p>
                            <span className="inline-block bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs font-medium mt-1">New Discovery</span>
                          </div>
                          <div className="text-right">
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">6 going</span>
                            <div className="text-xs mt-1 opacity-75">Min Trust: 65</div>
                          </div>
                        </div>
                        <p className="text-sm mb-3 opacity-90">By Emma Davis (Trust: 88)</p>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            Join Event
                          </button>
                          <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors">
                            Info
                          </button>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-xl p-4 shadow-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">Book Club Discussion</h3>
                            <p className="text-sm opacity-90">Next Wednesday, 7:30 PM</p>
                            <p className="text-xs opacity-75">Central Library</p>
                            <span className="inline-block bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-xs font-medium mt-1">Recommended</span>
                          </div>
                          <div className="text-right">
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">9 going</span>
                            <div className="text-xs mt-1 opacity-75">Min Trust: 70</div>
                          </div>
                        </div>
                        <p className="text-sm mb-3 opacity-90">By Rachel Brown (Trust: 91)</p>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-white text-pink-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            Join Event
                          </button>
                          <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors">
                            Info
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
            <button className="flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-colors text-gray-500">
              <span className="text-lg mb-1">💬</span>
              <span className="text-xs font-medium leading-tight">Chat</span>
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
      </div>
    </div>
  );
}