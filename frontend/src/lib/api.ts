import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  telegram: (data: any) => api.post('/auth/telegram', data),
  guest: () => api.post('/auth/guest'),
};

export const playerAPI = {
  getProfile: () => api.get('/player/profile'),
  collectOffline: () => api.patch('/player/collect-offline'),
};

export const trainingAPI = {
  start: (trainingId: string) => api.post('/training/start', { trainingId }),
  getAll: () => api.get('/training'),
};

export const fightAPI = {
  generateOpponent: () => api.get('/fight/generate-opponent'),
  start: () => api.post('/fight/start'),
  getHistory: () => api.get('/fight/history'),
};

export const cardsAPI = {
  getAll: () => api.get('/cards'),
  buy: (cardId: string) => api.post('/cards/buy', { cardId }),
};

export const shopAPI = {
  getUpgrades: () => api.get('/shop/upgrades'),
  buyUpgrade: (upgradeId: string) => api.post('/shop/buy', { upgradeId }),
};

export const leaderboardAPI = {
  get: () => api.get('/leaderboard'),
};

export const pvpAPI = {
  joinMatchmaking: () => api.post('/pvp/matchmaking/join'),
  leaveMatchmaking: () => api.post('/pvp/matchmaking/leave'),
  getHistory: () => api.get('/pvp/history'),
};

export const tournamentAPI = {
  getActive: () => api.get('/tournament/active'),
  getTournament: (id: string) => api.get(`/tournament/${id}`),
  register: (id: string) => api.post(`/tournament/${id}/register`),
  getMyTournaments: () => api.get('/tournament/my/tournaments'),
};

export const iapAPI = {
  getProducts: () => api.get('/iap/products'),
  createPayment: (productId: string) => api.post('/iap/create-payment', { productId }),
  getHistory: () => api.get('/iap/history'),
};

export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
  check: () => api.post('/achievements/check'),
  getStats: () => api.get('/achievements/stats'),
};

export default api;
