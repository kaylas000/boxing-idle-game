import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API методы
export const authAPI = {
  telegramAuth: (data: any) => api.post('/auth/telegram', data),
  guestAuth: () => api.post('/auth/guest'),
};

export const playerAPI = {
  getProfile: () => api.get('/player/profile'),
  getStats: () => api.get('/player/stats'),
  collectOffline: () => api.patch('/player/collect-offline'),
};

export const trainingAPI = {
  getAvailable: () => api.get('/training/available'),
  start: (trainingId: string) => api.post('/training/start', { trainingId }),
};

export const fightAPI = {
  generateOpponent: () => api.get('/fight/generate-opponent'),
  start: () => api.post('/fight/start'),
  getHistory: (page: number = 1) => api.get(`/fight/history?page=${page}`),
};
