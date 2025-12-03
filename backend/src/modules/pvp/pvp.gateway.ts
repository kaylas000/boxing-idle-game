import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'pvp',
})
export class PvpGateway {
  @WebSocketServer()
  server: Server;

  private connectedPlayers = new Map<string, Socket>();

  handleConnection(client: Socket) {
    console.log(`PvP Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`PvP Client disconnected: ${client.id}`);
    // Удалить из очереди
    this.connectedPlayers.delete(client.id);
  }

  @SubscribeMessage('join-matchmaking')
  handleJoinMatchmaking(
    @MessageBody() data: { playerId: string; rating: number },
    @ConnectedSocket() client: Socket,
  ) {
    this.connectedPlayers.set(data.playerId, client);
    
    // Поиск противника
    const opponent = this.findOpponent(data.playerId, data.rating);
    
    if (opponent) {
      // Найдена пара!
      const matchId = `match_${Date.now()}`;
      
      client.emit('match-found', { matchId, opponent });
      
      const opponentSocket = this.connectedPlayers.get(opponent.playerId);
      if (opponentSocket) {
        opponentSocket.emit('match-found', { 
          matchId, 
          opponent: { playerId: data.playerId } 
        });
      }
    } else {
      client.emit('matchmaking-status', { 
        status: 'searching',
        queueSize: this.connectedPlayers.size 
      });
    }
  }

  @SubscribeMessage('match-action')
  handleMatchAction(
    @MessageBody() data: { matchId: string; action: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Трансляция действия противнику
    this.server.to(data.matchId).emit('opponent-action', data.action);
  }

  private findOpponent(playerId: string, rating: number) {
    // Простой matchmaking: найти любого в диапазоне ±200 рейтинга
    for (const [id, socket] of this.connectedPlayers.entries()) {
      if (id !== playerId) {
        // Нашли противника
        return { playerId: id };
      }
    }
    return null;
  }

  notifyMatchResult(matchId: string, result: any) {
    this.server.to(matchId).emit('match-result', result);
  }
}
