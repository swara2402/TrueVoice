import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { PlusCircle, X, Send } from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Quill editor modules configuration
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'list', 'bullet', 'indent',
  'align',
  'blockquote', 'code-block',
  'link', 'image', 'video'
];

export function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Blog submitted for approval! An admin will review it shortly.');
    
    // Reset form
    setTitle('');
    setContent('');
    setTags([]);
    setCurrentTag('');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Blog Post</h1>
        <p className="text-gray-600">
          Share your knowledge with the developer community. Your post will be reviewed before publication.
        </p>
      </div>

      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Write Your Blog</h2>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-base font-medium">
                Blog Title *
              </Label>
              <Input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 text-lg py-3 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter an engaging title for your blog post..."
                maxLength={100}
              />
              <p className="text-sm text-gray-500 mt-1">
                {title.length}/100 characters
              </p>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags" className="text-base font-medium">
                Tags (Optional)
              </Label>
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-3">
                  <Input
                    id="tags"
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    className="flex-1 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add a tag (press Enter)"
                    maxLength={20}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    size="sm"
                    className="px-3"
                    disabled={!currentTag.trim() || tags.length >= 5}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-indigo-900"
                          title="Remove tag"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-1">
                  Add up to 5 tags to help readers find your content
                </p>
              </div>
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content" className="text-base font-medium">
                Blog Content *
              </Label>
              <div className="mt-2">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your blog content here... Use the toolbar for formatting, images, and more."
                  className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ minHeight: '400px' }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {content.replace(/<[^>]*>/g, '').length} characters • Rich text formatting supported
              </p>
            </div>

            {/* Preview Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-1">Before you submit:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your blog will be sent to admins for review</li>
                <li>• You'll be notified once it's approved and published</li>
                <li>• Make sure your content follows our community guidelines</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send for Approval
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
