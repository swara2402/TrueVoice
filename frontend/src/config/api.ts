// API Configuration
export const API_CONFIG = {
  // Base API URL from environment variable
  BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  // API Endpoints
  ENDPOINTS: {
    BLOGS: '/blogs',
    BLOG_COMMENTS: (blogId: string | number) => `/blogs/${blogId}/comments`,
    BLOG_REACTIONS: (blogId: string | number) => `/blogs/${blogId}/reactions`,
    COMMENT: (blogId: string | number, commentId: string) => `/blogs/${blogId}/comments/${commentId}`,
    AUTH: '/auth',
    ADMIN: '/admin'
  },
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Timeout settings
  TIMEOUT: 10000, // 10 seconds
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remove leading slash
  return `${baseUrl}/${cleanEndpoint}`;
};

// API response handler
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API error handler
export const handleApiError = (error: unknown): never => {
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('An unexpected error occurred');
};

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildApiUrl(endpoint);
  const config: RequestInit = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Specific API methods
export const api = {
  // GET request
  get: (endpoint: string, options?: RequestInit) => 
    apiRequest(endpoint, { method: 'GET', ...options }),
  
  // POST request
  post: (endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest(endpoint, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
  
  // PUT request
  put: (endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest(endpoint, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
  
  // DELETE request
  delete: (endpoint: string, options?: RequestInit) =>
    apiRequest(endpoint, { method: 'DELETE', ...options }),
  
  // PATCH request
  patch: (endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest(endpoint, { 
      method: 'PATCH', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
};
