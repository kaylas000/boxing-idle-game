import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  if (socket) {
    return socket;
  }

  // В production заменить на реальный URL backend
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  socket = io(`${BACKEND_URL}/pvp`, {
    auth: {
      token,
    },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initSocket() first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// PvP specific methods
export const pvpSocket = {
  joinMatchmaking: (playerId: string, rating: number) => {
    const s = getSocket();
    s.emit('join-matchmaking', { playerId, rating });
  },

  leaveMatchmaking: () => {
    const s = getSocket();
    s.emit('leave-matchmaking');
  },

  onMatchFound: (callback: (data: any) => void) => {
    const s = getSocket();
    s.on('match-found', callback);
  },

  onMatchmakingStatus: (callback: (data: any) => void) => {
    const s = getSocket();
    s.on('matchmaking-status', callback);
  },

  sendMatchAction: (matchId: string, action: any) => {
    const s = getSocket();
    s.emit('match-action', { matchId, action });
  },

  onOpponentAction: (callback: (action: any) => void) => {
    const s = getSocket();
    s.on('opponent-action', callback);
  },

  onMatchResult: (callback: (result: any) => void) => {
    const s = getSocket();
    s.on('match-result', callback);
  },

  offAllListeners: () => {
    const s = getSocket();
    s.off('match-found');
    s.off('matchmaking-status');
    s.off('opponent-action');
    s.off('match-result');
  },
};
