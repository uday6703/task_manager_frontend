import axios from 'axios';

// Normalize API base so it always ends with '/api'. This avoids 404s when
// a deployment environment variable omits the '/api' suffix.
const raw = process.env.REACT_APP_API_URL || 'https://task-manager-backend-2-bofk.onrender.com/api';
const trimmed = raw.replace(/\/+$/g, '');
const API_URL = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Temporary debug logging to help diagnose routing/auth issues in deployed builds
    try {
      const method = (config.method || 'GET').toUpperCase();
      const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
      // Avoid leaking token in logs in public places; this is for debugging during deploy only
      console.log(`[api][request] ${method} ${fullUrl}`, {
        authorization: config.headers.Authorization ? 'present' : 'none',
      });
    } catch (err) {
      // swallow logging errors
    }
    return config;
  },
  (error) => {
    // Log response errors for debugging (status + url)
    try {
      const resp = error.response;
      if (resp) {
        console.error('[api][response error]', resp.status, resp.config?.url, resp.data);
      } else {
        console.error('[api][response error] no response object', error.message);
      }
    } catch (err) {
      // swallow
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
