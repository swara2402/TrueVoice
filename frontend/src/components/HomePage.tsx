import React, { useState } from 'react';
import { Input } from './ui/input';
import { BlogCard } from './BlogCard';
import { Search, TrendingUp } from 'lucide-react';

// Mock blog data
const mockBlogs = [
  {
    id: 1,
    title: "Getting Started with React Hooks",
    snippet: "Learn how to use React Hooks to manage state and side effects in your functional components. This comprehensive guide covers useState, useEffect, and custom hooks.",
    author: "Sarah Chen",
    date: "2024-01-15",
    likes: 142,
    published: true,
    tags: ["React", "JavaScript", "Frontend"]
  },
  {
    id: 2,
    title: "Building Scalable APIs with Node.js",
    snippet: "Discover best practices for creating robust and scalable REST APIs using Node.js and Express. Learn about middleware, error handling, and database integration.",
    author: "Alex Johnson",
    date: "2024-01-12",
    likes: 89,
    published: true,
    tags: ["Node.js", "Backend", "API"]
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox: When to Use Which",
    snippet: "A detailed comparison of CSS Grid and Flexbox layouts. Understand the strengths of each approach and learn when to apply them in your projects.",
    author: "Maria Garcia",
    date: "2024-01-10",
    likes: 203,
    published: true,
    tags: ["CSS", "Frontend", "Layout"]
  },
  {
    id: 4,
    title: "Introduction to TypeScript",
    snippet: "TypeScript brings static typing to JavaScript. Learn the basics of TypeScript syntax, interfaces, and how it can improve your development workflow.",
    author: "David Kim",
    date: "2024-01-08",
    likes: 156,
    published: true,
    tags: ["TypeScript", "JavaScript"]
  },
  {
    id: 5,
    title: "Deploying React Apps to Vercel",
    snippet: "Step-by-step guide to deploying your React applications to Vercel. Learn about environment variables, custom domains, and continuous deployment.",
    author: "Emily Rodriguez",
    date: "2024-01-05",
    likes: 78,
    published: true,
    tags: ["React", "Deployment", "Vercel"]
  },
  {
    id: 6,
    title: "MongoDB Performance Optimization",
    snippet: "Tips and techniques for optimizing MongoDB performance. Learn about indexing strategies, query optimization, and database design patterns.",
    author: "James Wilson",
    date: "2024-01-03",
    likes: 234,
    published: true,
    tags: ["MongoDB", "Database", "Performance"]
  }
];

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = mockBlogs.filter(blog =>
    blog.published && (
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const trendingBlogs = [...mockBlogs]
    .filter(blog => blog.published)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Latest Developer Blogs
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover insights, tutorials, and best practices from the developer community
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search blogs, topics, or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Trending Section */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-teal-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-6 pb-4">
            {trendingBlogs.map(blog => (
              <div key={`trending-${blog.id}`} className="flex-shrink-0 w-80">
                <BlogCard blog={blog} variant="trending" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Blogs</h2>
        
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}