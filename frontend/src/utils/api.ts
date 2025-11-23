const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8201/api';

// Helper function to get auth token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to make authenticated API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid, redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  }

  return response;
};

// API methods for Tools
export const toolsAPI = {
  getAll: () => apiCall('/tools'),
  create: (data: any) => apiCall('/tools', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/tools/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/tools/${id}`, { method: 'DELETE' }),
};

// API methods for Collections
export const collectionsAPI = {
  getAll: () => apiCall('/collections'),
  create: (data: any) => apiCall('/collections', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/collections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/collections/${id}`, { method: 'DELETE' }),
  addTools: (id: number, toolIds: number[]) =>
    apiCall(`/collections/${id}/tools`, { method: 'POST', body: JSON.stringify({ tool_ids: toolIds }) }),
  removeTool: (collectionId: number, toolId: number) =>
    apiCall(`/collections/${collectionId}/tools/${toolId}`, { method: 'DELETE' }),
};

// API methods for Settings
export const settingsAPI = {
  get: () => apiCall('/settings'),
  update: (data: any) => apiCall('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// API methods for User Profile
export const userAPI = {
  updateProfile: (data: any) => apiCall('/user/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updatePassword: (data: any) => apiCall('/user/password', { method: 'PUT', body: JSON.stringify(data) }),
};

// API methods for Explore Tools
export const exploreAPI = {
  getPersonalized: () => apiCall('/explore/personalized'),
  getAll: () => apiCall('/explore/all'),
};
