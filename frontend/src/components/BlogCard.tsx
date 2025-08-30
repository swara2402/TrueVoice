import React from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, User, Calendar } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  snippet: string;
  author: string;
  date: string;
  likes: number;
  published: boolean;
  tags: string[];
}

interface BlogCardProps {
  blog: Blog;
  variant?: 'default' | 'trending';
}

export function BlogCard({ blog, variant = 'default' }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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
          
          <div className="flex items-center text-red-500">
            <Heart className="h-4 w-4 mr-1" />
            <span className="font-medium">{blog.likes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}