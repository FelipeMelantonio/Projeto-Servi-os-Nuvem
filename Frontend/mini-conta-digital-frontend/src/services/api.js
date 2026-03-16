import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_BASE_URL = 'http://34.228.198.48:25000/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to the headers
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration or invalid tokens
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is due to an invalid or expired token
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('Token expired or invalid. Logging out...');
      useAuthStore.getState().logout();
      // Optionally redirect to login page
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
