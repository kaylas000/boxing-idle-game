import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { playerAPI, pvpAPI } from '@/lib/api';
import { initSocket, pvpSocket, disconnectSocket } from '@/lib/socket';

export const usePvP = () => {
  const [searching, setSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [opponent, setOpponent] = useState<any>(null);
  const [matchId, setMatchId] = useState<string | null>(null);

  const { data: player } = useQuery({
    queryKey: ['player'],
    queryFn: () => playerAPI.getProfile().then(res => res.data),
  });

  useEffect(() => {
    // Инициализация socket при монтировании компонента
    const token = localStorage.getItem('token');
    if (token && player) {
      try {
        initSocket(token);

        // Подписка на события
        pvpSocket.onMatchFound((data) => {
          console.log('Match found!', data);
          setSearching(false);
          setMatchFound(true);
          setMatchId(data.matchId);
          setOpponent(data.opponent);
        });

        pvpSocket.onMatchmakingStatus((data) => {
          console.log('Matchmaking status:', data);
        });
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    }

    return () => {
      // Cleanup при размонтировании
      if (searching) {
        pvpSocket.leaveMatchmaking();
      }
      pvpSocket.offAllListeners();
    };
  }, [player]);

  const startSearch = async () => {
    if (!player) return;

    setSearching(true);
    setMatchFound(false);
    setOpponent(null);

    try {
      // Отправка запроса на сервер
      await pvpAPI.joinMatchmaking();
      
      // Отправка через socket для реального времени
      pvpSocket.joinMatchmaking(player.id, player.rating);
    } catch (error) {
      console.error('Error joining matchmaking:', error);
      setSearching(false);
    }
  };

  const cancelSearch = () => {
    setSearching(false);
    pvpSocket.leaveMatchmaking();
  };

  const resetMatch = () => {
    setMatchFound(false);
    setOpponent(null);
    setMatchId(null);
  };

  return {
    player,
    searching,
    matchFound,
    opponent,
    matchId,
    startSearch,
    cancelSearch,
    resetMatch,
  };
};
