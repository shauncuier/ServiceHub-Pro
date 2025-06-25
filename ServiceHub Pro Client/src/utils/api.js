import { auth } from '../Firebase/Firebase.config';
import { getIdToken } from 'firebase/auth';

const API_BASE_URL = 'https://service-hub-pro-server.vercel.app/api';

// Get Firebase ID token
const getAuthToken = async () => {
  try {
    if (auth.currentUser) {
      return await getIdToken(auth.currentUser);
    }
    return null;
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return null;
  }
};

// Create headers with authentication
const getHeaders = async (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const headers = await getHeaders(options.auth);
    const config = {
      headers,
      ...options,
    };

    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      console.warn('Authentication token expired or invalid');
      throw new Error('Authentication required');
    }

    // Handle other HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API
const authAPI = {
  // Firebase login - exchange Firebase token for JWT
  firebaseLogin: async (userData) => {
    return await apiRequest('/auth/firebase-login', {
      method: 'POST',
      body: JSON.stringify(userData),
      auth: false, // Don't use auth header for login
    });
  },

  // Verify current Firebase token
  verify: async () => {
    return await apiRequest('/auth/verify', {
      method: 'GET',
      auth: true,
    });
  },

  // Logout
  logout: async () => {
    return await apiRequest('/auth/logout', {
      method: 'POST',
      auth: true,
    });
  },
};

// Services API
const services = {
  // Get all services (public)
  getAll: async () => {
    return await apiRequest('/services', {
      method: 'GET',
      auth: false,
    });
  },

  // Get single service by ID (public)
  getById: async (id) => {
    return await apiRequest(`/services/${id}`, {
      method: 'GET',
      auth: false,
    });
  },

  // Get services by provider email (protected)
  getByProvider: async (email) => {
    return await apiRequest(`/services/provider/${email}`, {
      method: 'GET',
      auth: true,
    });
  },

  // Create new service (protected)
  create: async (serviceData) => {
    return await apiRequest('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
      auth: true,
    });
  },

  // Update service (protected)
  update: async (id, serviceData) => {
    return await apiRequest(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
      auth: true,
    });
  },

  // Delete service (protected)
  delete: async (id) => {
    return await apiRequest(`/services/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  // Search services (public)
  search: async (query) => {
    return await apiRequest(`/search/${encodeURIComponent(query)}`, {
      method: 'GET',
      auth: false,
    });
  },

  // Get platform statistics (public)
  getStats: async () => {
    try {
      return await apiRequest('/stats', {
        method: 'GET',
        auth: false,
      });
    } catch {
      // Fallback to calculating stats from services if endpoint doesn't exist
      console.warn('Stats endpoint not available, calculating from services');
      return null;
    }
  },
};

// Bookings API
const bookings = {
  // Get all bookings (protected) - for Service To-Do page
  getAll: async () => {
    return await apiRequest('/bookings', {
      method: 'GET',
      auth: true,
    });
  },

  // Get user bookings (protected)
  getUserBookings: async (email) => {
    return await apiRequest(`/bookings/user/${email}`, {
      method: 'GET',
      auth: true,
    });
  },

  // Get provider bookings (protected)
  getProviderBookings: async (email) => {
    return await apiRequest(`/bookings/provider/${email}`, {
      method: 'GET',
      auth: true,
    });
  },

  // Create booking (protected)
  create: async (bookingData) => {
    return await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
      auth: true,
    });
  },

  // Update booking status (protected)
  updateStatus: async (id, statusData) => {
    return await apiRequest(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
      auth: true,
    });
  },

  // Delete booking (protected) - for cancellation
  delete: async (id) => {
    return await apiRequest(`/bookings/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  // Get booking statistics
  getStats: async () => {
    try {
      return await apiRequest('/bookings/stats', {
        method: 'GET',
        auth: false,
      });
    } catch {
      console.warn('Booking stats endpoint not available');
      return null;
    }
  },
};

// Reviews/Testimonials API
const reviews = {
  // Get recent reviews for testimonials (public)
  getRecentReviews: async (limit = 4) => {
    try {
      return await apiRequest(`/reviews/recent?limit=${limit}`, {
        method: 'GET',
        auth: false,
      });
    } catch {
      console.warn('Reviews endpoint not available, using fallback');
      return null;
    }
  },

  // Get review statistics
  getStats: async () => {
    try {
      return await apiRequest('/reviews/stats', {
        method: 'GET',
        auth: false,
      });
    } catch {
      console.warn('Review stats endpoint not available');
      return null;
    }
  },

  // Create a new review (protected)
  create: async (reviewData) => {
    try {
      return await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
        auth: true,
      });
    } catch {
      console.warn('Reviews create endpoint not available, using local storage fallback');
      // Fallback to local storage for development
      const reviews = JSON.parse(localStorage.getItem('servicehub_reviews') || '[]');
      const newReview = {
        _id: Date.now().toString(),
        ...reviewData,
        createdAt: new Date().toISOString()
      };
      reviews.push(newReview);
      localStorage.setItem('servicehub_reviews', JSON.stringify(reviews));
      return newReview;
    }
  },

  // Get reviews for a specific service (public)
  getByService: async (serviceId) => {
    try {
      return await apiRequest(`/reviews/service/${serviceId}`, {
        method: 'GET',
        auth: false,
      });
    } catch {
      console.warn('Reviews by service endpoint not available, using fallback');
      // Fallback to local storage
      const reviews = JSON.parse(localStorage.getItem('servicehub_reviews') || '[]');
      return reviews.filter(review => review.serviceId === serviceId);
    }
  },

  // Get reviews by a specific user (protected)
  getByUser: async (userEmail) => {
    try {
      return await apiRequest(`/reviews/user/${userEmail}`, {
        method: 'GET',
        auth: true,
      });
    } catch {
      console.warn('Reviews by user endpoint not available, using fallback');
      // Fallback to local storage
      const reviews = JSON.parse(localStorage.getItem('servicehub_reviews') || '[]');
      return reviews.filter(review => review.customerEmail === userEmail);
    }
  },
};

// Export API object
export const api = {
  auth: authAPI,
  services,
  bookings,
  reviews,
  // Utility functions
  getAuthToken: () => {
    return localStorage.getItem('servicehub_auth_token');
  },
  setAuthToken: (token) => {
    // Store token in localStorage for persistence
    if (token) {
      localStorage.setItem('servicehub_auth_token', token);
    } else {
      localStorage.removeItem('servicehub_auth_token');
    }
  },
  clearAuth: () => {
    localStorage.removeItem('servicehub_auth_token');
  },
};

// Export for backward compatibility
export default api;
