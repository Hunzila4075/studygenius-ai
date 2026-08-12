import axios from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor to attach Bearer Token if stored in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('studygenius_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear token if session expired
      if (window.location.pathname.startsWith('/app')) {
        localStorage.removeItem('studygenius_token');
        localStorage.removeItem('studygenius_user');
      }
    }
    return Promise.reject(error);
  }
);
