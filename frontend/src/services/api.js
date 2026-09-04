import axios from 'axios';

const rawBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : '';

const cleanBase = rawBase ? rawBase.replace(/\/+$/, '') : '';

const api = axios.create({
  baseURL: cleanBase ? `${cleanBase}/api` : '/api',
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized - token may have expired');
    }
    return Promise.reject(error);
  }
);

export const getProducts = () => api.get('/products');
export const getProductBySlug = (slug) => api.get(`/products/${slug}`);
export const createOrder = (order) => api.post('/orders', order);

export default api;
