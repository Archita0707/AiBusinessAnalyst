import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

// Data Sources
export const getDataSources = () => api.get('/datasources');

// Glossary
export const getGlossary = (dataSourceId) =>
  api.get('/glossary', { params: { dataSourceId } });

// AI
export const generateSQL = (question, dataSourceId) =>
  api.post('/ai/generate-sql', { question, dataSourceId });

// Query
export const validateQuery = (sql) =>
  api.post('/query/validate', { sql });

export const executeQuery = (sql, dataSourceId) =>
  api.post('/query/execute', { sql, dataSourceId });

// History
export const getHistory = () => api.get('/history');

export default api;
