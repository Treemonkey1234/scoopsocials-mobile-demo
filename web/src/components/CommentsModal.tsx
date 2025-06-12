import React, { useState } from 'react';

interface Comment {
  id: string;
  author: string;
  authorTrustScore: number;
  content: string;
  timestamp: string;
  likes: number;
  userLiked: boolean;
  replies?: Comment[];
}

interface CommentsModalProps {
  onClose: () => void;
  postId: string;
  postAuthor: string;
  postContent: string;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ onClose, postId, postAuthor, postContent }) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Sarah Martinez',
      authorTrustScore: 88,
      content: 'This is really helpful context! Thanks for sharing your experience.',
      timestamp: '2 hours ago',
      likes: 5,
      userLiked: false,
      replies: []
    },
    {
      id: '2', 
      author: 'Mike Johnson',
      authorTrustScore: 92,
      content: 'I had a similar experience with them. Very professional and reliable.',
      timestamp: '4 hours ago',
      likes: 3,
      userLiked: true,
      replies: []
    },
    {
      id: '3',
      author: 'Emma Davis',
      authorTrustScore: 85,
      content: 'Great to see honest reviews in the community. This builds trust for everyone.',
      timestamp: '6 hours ago',
      likes: 8,
      userLiked: false,
      replies: [
        {
          id: '3-1',
          author: 'Alex Chen',
          authorTrustScore: 91,
          content: 'Totally agree! Transparency is key.',
          timestamp: '5 hours ago',
          likes: 2,
          userLiked: false,
          replies: []
        }
      ]
    }
  ]);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      alert('Please write a comment');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Riesling LeFluuf',
      authorTrustScore: 95,
      content: newComment.trim(),
      timestamp: 'Just now',
      likes: 0,
      userLiked: false,
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleLikeComment = (commentId: string) => {
    const updateLikes = (commentsList: Comment[]): Comment[] => {
      return commentsList.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.userLiked ? comment.likes - 1 : comment.likes + 1,
            userLiked: !comment.userLiked
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateLikes(comment.replies)
          };
        }
        return comment;
      });
    };
    
    setComments(updateLikes(comments));
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyText('');
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyText.trim()) {
      alert('Please write a reply');
      return;
    }

    const newReply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: 'Riesling LeFluuf',
      authorTrustScore: 95,
      content: replyText.trim(),
      timestamp: 'Just now',
      likes: 0,
      userLiked: false,
      replies: []
    };

    const addReply = (commentsList: Comment[]): Comment[] => {
      return commentsList.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReply(comment.replies)
          };
        }
        return comment;
      });
    };

    setComments(addReply(comments));
    setReplyingTo(null);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const renderComment = (comment: Comment, depth: number = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'ml-4 border-l-2 border-gray-200 pl-3' : ''}`}>
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">{comment.author}</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Trust: {comment.authorTrustScore}
            </span>
          </div>
          <span className="text-xs text-gray-500">{comment.timestamp}</span>
        </div>
        
        <p className="text-sm text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
        
        <div className="flex items-center justify-between">
          <button 
            onClick={() => handleLikeComment(comment.id)}
            className={`flex items-center space-x-1 text-xs ${
              comment.userLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
            } transition-colors`}
          >
            <span>{comment.userLiked ? '❤️' : '🤍'}</span>
            <span>{comment.likes}</span>
          </button>
          <button 
            onClick={() => handleReply(comment.id)}
            className="text-gray-400 hover:text-gray-600 text-xs"
          >
            Reply
          </button>
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="mt-3 bg-white rounded-lg p-3 border">
            <textarea
              rows={2}
              placeholder={`Reply to ${comment.author}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">{replyText.length}/280 characters</span>
              <div className="flex space-x-2">
                <button
                  onClick={handleCancelReply}
                  className="px-3 py-1 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyText.trim()}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    replyText.trim() 
                      ? 'bg-cyan-500 text-white hover:bg-cyan-600' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mb-3">
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Original Post Preview */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="text-sm font-medium text-gray-900 mb-1">{postAuthor}</div>
          <p className="text-sm text-gray-600 line-clamp-3">{postContent}</p>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {comments.map((comment) => renderComment(comment))}
          </div>
        </div>

        {/* Add Comment */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              R
            </div>
            <div className="flex-1">
              <textarea
                rows={2}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{newComment.length}/280 characters</span>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
                    newComment.trim() 
                      ? 'bg-cyan-500 text-white hover:bg-cyan-600' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;