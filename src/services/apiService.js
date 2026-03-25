import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle responses — pass error message as string so callers can check it
api.interceptors.response.use(
  res => res.data,
  err => {
    const status = err.response?.status;

    // Redirect to login on 401
    if (status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_info');
      window.location.href = '/login';
      return Promise.reject('Session expired. Please log in again.');
    }

    // Build a descriptive error string
    const message =
      err.response?.data?.message ||
      err.response?.data?.error   ||
      (status === 404 ? '404 not found' : null) ||
      err.message ||
      'Something went wrong';

    return Promise.reject(message);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  register: (fullName, email, password) =>
    api.post('/auth/register', { fullName, email, password }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

// ── Resume ────────────────────────────────────────────────────
export const resumeAPI = {
  upload: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/resumes/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    });
  },

  // Poll this — returns status PENDING/PROCESSING/ANALYZED/FAILED
  getAnalysis: (resumeId) =>
    api.get(`/resumes/${resumeId}/analysis`),

  getAll: () =>
    api.get('/resumes'),

  delete: (resumeId) =>
    api.delete(`/resumes/${resumeId}`),

  jobMatch: (resumeId, jobDescription, jobTitle = '', company = '') =>
    api.post(`/resumes/${resumeId}/job-match`, {
      jobDescription,
      jobTitle,
      company,
    }),
};

export default api;