import React, { useState, useEffect } from 'react';
import { BlogCard } from './BlogCard';
import { CommentSection } from './CommentSection';
import { api, API_CONFIG } from '../config/api';

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

interface Comment {
  _id: string;
  body: string;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

export function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const data = await api.get(API_CONFIG.ENDPOINTS.BLOGS);
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  useEffect(() => {
    async function fetchComments() {
      if (!selectedBlog) return;
      try {
        const endpoint = API_CONFIG.ENDPOINTS.BLOG_COMMENTS(selectedBlog.id);
        const data = await api.get(endpoint);
        setComments(data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    }
    fetchComments();
  }, [selectedBlog]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      {loading ? (
        <p>Loading blogs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map(blog => (
            <div key={blog.id} onClick={() => setSelectedBlog(blog)} className="cursor-pointer">
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      )}
      {selectedBlog && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Comments for: {selectedBlog.title}</h2>
          <CommentSection blogId={selectedBlog.id.toString()} comments={comments} />
        </div>
      )}
    </div>
  );
}
