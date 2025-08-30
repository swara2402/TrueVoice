import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, User, Calendar, ThumbsUp, Zap } from 'lucide-react';
import { api, API_CONFIG, buildApiUrl } from '../config/api';

interface Blog {
  id: number;
  title: string;
  snippet: string;
  author: string;
  date: string;
  likes: number;
  claps: number;
  hearts: number;
  published: boolean;
  tags: string[];
  userReactions?: {
    liked: boolean;
    clapped: boolean;
    hearted: boolean;
  };
}

interface BlogCardProps {
  blog: Blog;
  variant?: 'default' | 'trending';
}

export function BlogCard({ blog, variant = 'default' }: BlogCardProps) {
  const [liked, setLiked] = useState(blog.userReactions?.liked || false);
  const [clapped, setClapped] = useState(blog.userReactions?.clapped || false);
  const [hearted, setHearted] = useState(blog.userReactions?.hearted || false);

  const [likesCount, setLikesCount] = useState(blog.likes);
  const [clapsCount, setClapsCount] = useState(blog.claps || 0);
  const [heartsCount, setHeartsCount] = useState(blog.hearts || 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleReaction = async (type: 'like' | 'clap' | 'heart') => {
    // Toggle reaction state
    let newState = false;
    if (type === 'like') {
      newState = !liked;
      setLiked(newState);
      setLikesCount(likesCount + (newState ? 1 : -1));
    } else if (type === 'clap') {
      newState = !clapped;
      setClapped(newState);
      setClapsCount(clapsCount + (newState ? 1 : -1));
    } else if (type === 'heart') {
      newState = !hearted;
      setHearted(newState);
      setHeartsCount(heartsCount + (newState ? 1 : -1));
    }

    // Call backend API to update reaction using centralized API
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.BLOG_REACTIONS(blog.id));
      if (newState) {
        await api.post(url, { reactionType: type });
      } else {
        await api.delete(url);
      }
    } catch (error) {
      // Revert state on error
      if (type === 'like') {
        setLiked(!newState);
        setLikesCount(likesCount + (newState ? -1 : 1));
      } else if (type === 'clap') {
        setClapped(!newState);
        setClapsCount(clapsCount + (newState ? -1 : 1));
      } else if (type === 'heart') {
        setHearted(!newState);
        setHeartsCount(heartsCount + (newState ? -1 : 1));
      }
      console.error('Failed to update reaction:', error);
    }
  };

  return (
    <Card className={`h-full hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm hover:shadow-xl group ${
      variant === 'trending' ? 'bg-gradient-to-br from-teal-50 to-indigo-50 border-l-4 border-l-teal-500' : 'bg-white'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold leading-tight group-hover:text-indigo-600 transition-colors ${
            variant === 'trending' ? 'text-lg' : 'text-base'
          }`}>
            {blog.title}
          </h3>
          {variant === 'trending' && (
            <Badge variant="secondary" className="ml-2 bg-teal-100 text-teal-700 border-teal-200">
              Trending
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {blog.tags.map(tag => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs px-2 py-1 bg-gray-50 text-gray-600 border-gray-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 mb-4 leading-relaxed">
          {blog.snippet}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(blog.date)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleReaction('like')}
              aria-label="Like"
              className={`flex items-center text-red-500 focus:outline-none ${
                liked ? 'text-red-600' : 'text-red-400'
              }`}
            >
              <Heart className="h-4 w-4 mr-1" />
              <span className="font-medium">{likesCount}</span>
            </button>
            <button
              onClick={() => handleReaction('clap')}
              aria-label="Clap"
              className={`flex items-center text-yellow-500 focus:outline-none ${
                clapped ? 'text-yellow-600' : 'text-yellow-400'
              }`}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="font-medium">{clapsCount}</span>
            </button>
            <button
              onClick={() => handleReaction('heart')}
              aria-label="Heart"
              className={`flex items-center text-pink-500 focus:outline-none ${
                hearted ? 'text-pink-600' : 'text-pink-400'
              }`}
            >
              <Zap className="h-4 w-4 mr-1" />
              <span className="font-medium">{heartsCount}</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
