import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../infrastructure/auth/ws-jwt.guard';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinUserRoom')
  handleJoinUserRoom(@ConnectedSocket() client: any) {
    const userId = client.user.id;
    client.join(`user-${userId}`);
    return { event: 'joined', room: `user-${userId}` };
  }

  sendNotificationToUser(userId: number, notification: any) {
    this.server.to(`user-${userId}`).emit('notificationReceived', notification);
  }

  sendToRole(role: string, notification: any) {
    this.server.to(`${role}-dashboard`).emit('notificationReceived', notification);
  }
}
