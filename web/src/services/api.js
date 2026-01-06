import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // Enable cookies
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token from Supabase session
api.interceptors.request.use(
  async (config) => {
    try {
      // Try to get token from Supabase session
      const { supabase } = await import('../config/supabase');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!error && session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
        console.log('[API] Request with Supabase token:', config.method?.toUpperCase(), config.url);
      } else {
        // Fallback to localStorage token (for backward compatibility)
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('[API] Request with localStorage token:', config.method?.toUpperCase(), config.url);
        } else {
          console.log('[API] Request without auth token:', config.method?.toUpperCase(), config.url);
        }
      }
    } catch (err) {
      console.error('[API] Error getting session for request:', err);
      // If session fetch fails, try localStorage fallback
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('[API] Response received:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message === 'Request timeout' || error.message?.includes('timeout')) {
      console.error('[API] Request timeout:', error.config?.method?.toUpperCase(), error.config?.url);
      return Promise.reject(new Error('Request timeout. Please check your connection and try again.'));
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('[API] Network error:', error.config?.method?.toUpperCase(), error.config?.url, error.message);
      // Check if it's a CORS error
      if (error.message?.includes('CORS') || error.message?.includes('Network Error')) {
        return Promise.reject(new Error('Cannot connect to server. Please ensure the backend is running and CORS is configured correctly.'));
      }
      return Promise.reject(new Error('Cannot connect to server. Please ensure the backend is running.'));
    }
    
    console.error('[API] Error response:', error.config?.method?.toUpperCase(), error.config?.url, error.response.status, error.response.data);
    
    // Only redirect to login if we're not already on the login/register page
    // This prevents redirect loops
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/admin/login') {
        console.log('[API] 401 error, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
