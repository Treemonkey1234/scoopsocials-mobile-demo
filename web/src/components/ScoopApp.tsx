import React, { useState } from 'react';

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
}

export default function ScoopApp() {
  const [currentScreen, setCurrentScreen] = useState('home');
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
      category: 'Professional'
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
      category: 'Marketplace'
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
      category: 'Academic'
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
                      <h1 className="text-xl font-bold text-white drop-shadow-md">Home Feed</h1>
                      <p className="text-xs text-cyan-100 opacity-90">Friend reviews & trust scores</p>
                    </div>
                  </div>
                  <button className="w-12 h-12 bg-white shadow-lg border-2 border-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 text-xl font-bold hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-200 hover:scale-105">
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
                            <div className="flex items-center space-x-3">
                              <span className="px-3 py-1 rounded-full text-xs font-medium shadow-sm bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300">
                                Trust: {post.reviewerTrustScore}
                              </span>
                              <span className="text-xs text-gray-500">{post.timestamp}</span>
                              <span className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 rounded-full text-xs font-medium border border-cyan-300 shadow-sm">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          
                          <div className="cursor-pointer hover:bg-gray-50 rounded p-2 -m-2 transition-colors mb-3">
                            <p className="text-gray-800 text-sm leading-relaxed hover:text-gray-900">{post.content}</p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
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
                            <button className="flex items-center text-gray-500 hover:text-red-600 transition-colors">
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
                <h2 className="text-xl font-bold">Nick Hemingway</h2>
                <p className="opacity-90 text-sm">@nickhemingway9</p>
                <div className="flex justify-center items-center mt-4">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">Trust Score: 95</span>
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
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
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
              </div>
            </div>
          )}

          {/* Groups Screen */}
          {currentScreen === 'groups' && (
            <div className="h-full bg-white">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Local Events</h2>
                
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">Tech Meetup Phoenix</h3>
                        <p className="text-sm opacity-90">Tomorrow, 7:00 PM</p>
                      </div>
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">12 going</span>
                    </div>
                    <p className="text-sm mb-3">Join us for networking and tech talks in downtown Phoenix.</p>
                    <button className="bg-white text-cyan-600 px-4 py-2 rounded-lg font-medium w-full">
                      RSVP
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">Hiking Group</h3>
                        <p className="text-sm opacity-90">Saturday, 6:00 AM</p>
                      </div>
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">8 going</span>
                    </div>
                    <p className="text-sm mb-3">Early morning hike at South Mountain Park.</p>
                    <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium w-full">
                      RSVP
                    </button>
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
              <span className="text-lg mb-1">👥</span>
              <span className="text-xs font-medium leading-tight">Groups</span>
            </button>
            <button className="flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-colors text-gray-500">
              <span className="text-lg mb-1">🔍</span>
              <span className="text-xs font-medium leading-tight">Search</span>
            </button>
            <button className="flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-colors text-gray-500">
              <span className="text-lg mb-1">💬</span>
              <span className="text-xs font-medium leading-tight">Inbox</span>
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
      </div>
    </div>
  );
}