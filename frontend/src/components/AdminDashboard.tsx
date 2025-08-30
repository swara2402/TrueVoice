import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash2, 
  Clock, 
  FileText,
  Users,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock data for pending blogs
const mockPendingBlogs = [
  {
    id: 7,
    title: "Advanced React Patterns: Render Props and HOCs",
    author: "Michael Turner",
    date: "2024-01-16",
    snippet: "Explore advanced React patterns including render props, higher-order components, and compound components. Learn when and how to use each pattern effectively.",
    tags: ["React", "Advanced", "Patterns"]
  },
  {
    id: 8,
    title: "GraphQL with Apollo Client",
    author: "Lisa Wang",
    date: "2024-01-15",
    snippet: "A comprehensive guide to using GraphQL with Apollo Client in React applications. Learn about queries, mutations, caching, and error handling.",
    tags: ["GraphQL", "Apollo", "React"]
  },
  {
    id: 9,
    title: "Docker for Frontend Developers",
    author: "Chris Martinez",
    date: "2024-01-14",
    snippet: "Learn how Docker can improve your frontend development workflow. From containerizing React apps to setting up development environments.",
    tags: ["Docker", "DevOps", "Frontend"]
  }
];

// Mock data for published blogs
const mockPublishedBlogs = [
  {
    id: 1,
    title: "Getting Started with React Hooks",
    author: "Sarah Chen",
    date: "2024-01-15",
    likes: 142,
    views: 1250
  },
  {
    id: 2,
    title: "Building Scalable APIs with Node.js",
    author: "Alex Johnson",
    date: "2024-01-12",
    likes: 89,
    views: 890
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox: When to Use Which",
    author: "Maria Garcia",
    date: "2024-01-10",
    likes: 203,
    views: 2100
  }
];

export function AdminDashboard() {
  const [pendingBlogs, setPendingBlogs] = useState(mockPendingBlogs);
  const [publishedBlogs, setPublishedBlogs] = useState(mockPublishedBlogs);

  const handleApprove = (blogId: number) => {
    const blog = pendingBlogs.find(b => b.id === blogId);
    if (blog) {
      setPendingBlogs(pendingBlogs.filter(b => b.id !== blogId));
      setPublishedBlogs([...publishedBlogs, { 
        ...blog, 
        likes: 0, 
        views: 0 
      }]);
      toast.success(`"${blog.title}" has been approved and published!`);
    }
  };

  const handleReject = (blogId: number) => {
    const blog = pendingBlogs.find(b => b.id === blogId);
    if (blog) {
      setPendingBlogs(pendingBlogs.filter(b => b.id !== blogId));
      toast.error(`"${blog.title}" has been rejected.`);
    }
  };

  const handleUnpublish = (blogId: number) => {
    const blog = publishedBlogs.find(b => b.id === blogId);
    if (blog) {
      setPublishedBlogs(publishedBlogs.filter(b => b.id !== blogId));
      toast.success(`"${blog.title}" has been unpublished.`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage blog posts, review submissions, and monitor site activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-blue-600 font-medium">Pending Review</p>
                <p className="text-2xl font-bold text-blue-900">{pendingBlogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-green-600 font-medium">Published</p>
                <p className="text-2xl font-bold text-green-900">{publishedBlogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-purple-600 font-medium">Active Authors</p>
                <p className="text-2xl font-bold text-purple-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-orange-600 font-medium">Total Views</p>
                <p className="text-2xl font-bold text-orange-900">8.2k</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Pending Approval ({pendingBlogs.length})
          </TabsTrigger>
          <TabsTrigger value="published" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Published Blogs ({publishedBlogs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Blogs Pending Review</h2>
              <p className="text-gray-600">Review and approve or reject blog submissions.</p>
            </CardHeader>
            <CardContent>
              {pendingBlogs.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No blogs pending review</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingBlogs.map(blog => (
                      <TableRow key={blog.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{blog.title}</p>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {blog.snippet}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{blog.author}</TableCell>
                        <TableCell>{formatDate(blog.date)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {blog.tags.map(tag => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(blog.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReject(blog.id)}
                              variant="destructive"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Published Blogs</h2>
              <p className="text-gray-600">Manage your published blog posts.</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publishedBlogs.map(blog => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">{blog.title}</TableCell>
                      <TableCell>{blog.author}</TableCell>
                      <TableCell>{formatDate(blog.date)}</TableCell>
                      <TableCell>{blog.likes}</TableCell>
                      <TableCell>{blog.views}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUnpublish(blog.id)}
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}