import api from './api';

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Photo APIs
export const photoAPI = {
  getAll: () => api.get('/photos'),
  getOne: (id) => api.get(`/photos/${id}`),
  create: (data) => api.post('/photos', data),
  delete: (id) => api.delete(`/photos/${id}`),
  search: (query) => api.get('/photos/search', { params: { q: query } }),
};

// Video APIs
export const videoAPI = {
  getAll: () => api.get('/videos'),
  getOne: (id) => api.get(`/videos/${id}`),
  create: (data) => api.post('/videos', data),
  delete: (id) => api.delete(`/videos/${id}`),
  search: (query) => api.get('/videos/search', { params: { q: query } }),
};

// Journal APIs
export const journalAPI = {
  getAll: () => api.get('/journals'),
  getOne: (id) => api.get(`/journals/${id}`),
  create: (data) => api.post('/journals', data),
  update: (id, data) => api.put(`/journals/${id}`, data),
  delete: (id) => api.delete(`/journals/${id}`),
  search: (query) => api.get('/journals/search', { params: { q: query } }),
};

// Milestone APIs
export const milestoneAPI = {
  getAll: () => api.get('/milestones'),
  getOne: (id) => api.get(`/milestones/${id}`),
  create: (data) => api.post('/milestones', data),
  update: (id, data) => api.put(`/milestones/${id}`, data),
  delete: (id) => api.delete(`/milestones/${id}`),
};

// Timeline APIs
export const timelineAPI = {
  getAll: () => api.get('/timeline'),
  getByYear: (year) => api.get(`/timeline/${year}`),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// AI APIs
export const aiAPI = {
  search: (query) => api.get('/ai/search', { params: { q: query } }),
  chat: (message) => api.post('/ai/chat', { message }),
  getChatHistory: () => api.get('/ai/chat/history'),
  onThisDay: () => api.get('/ai/on-this-day'),
  insights: () => api.get('/ai/insights'),
  getAllMemories: () => api.get('/ai/memories'),
  generateNarrative: (data) => api.post('/ai/narrative', data),
};

// Collection / Capsule APIs
export const collectionAPI = {
  getAll: () => api.get('/collections'),
  getOne: (id) => api.get(`/collections/${id}`),
  create: (data) => api.post('/collections', data),
  update: (id, data) => api.put(`/collections/${id}`, data),
  delete: (id) => api.delete(`/collections/${id}`),
};

// TimeCapsule APIs
export const capsuleAPI = {
  getAll: () => api.get('/capsules'),
  getOne: (id) => api.get(`/capsules/${id}`),
  create: (data) => api.post('/capsules', data),
  update: (id, data) => api.put(`/capsules/${id}`, data),
  delete: (id) => api.delete(`/capsules/${id}`),
  open: (id) => api.post(`/capsules/${id}/open`),
};
