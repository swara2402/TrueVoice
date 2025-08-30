import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Send, User, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api, API_CONFIG, buildApiUrl } from '../config/api';

interface Comment {
  _id: string;
  body: string;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

interface CommentSectionProps {
  blogId: string;
  comments: Comment[];
  currentUserId?: string;
  isAdmin?: boolean;
}

export function CommentSection({ blogId, comments: initialComments, currentUserId, isAdmin = false }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.BLOG_COMMENTS(blogId));
      const comment = await api.post(url, { body: newComment });
      setComments([...comments, comment]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.COMMENT(blogId, commentId));
      await api.delete(url);
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete comment');
    }
  };

  const canDeleteComment = (comment: Comment) => {
    return currentUserId === comment.author._id || isAdmin;
  };

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment._id} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {comment.author.username}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                  
                  {canDeleteComment(comment) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
