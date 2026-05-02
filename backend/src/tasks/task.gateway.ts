import { UseGuards } from '@nestjs/common'; // <-- [SỬA] Đưa UseGuards về đúng nhà của nó
import { WebSocketGateway, SubscribeMessage, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../infrastructure/auth/ws-jwt.guard';

@WebSocketGateway({ cors: true })
export class TaskGateway {
    @WebSocketServer()
    server: Server;

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('joinAdminDashboard')
    handleJoinAdmin(@ConnectedSocket() client: Socket) {
        client.join('admin-dashboard');
        return { event: 'joined', room: 'admin-dashboard' };
    }

    emitTaskEvent(event: 'taskCreated' | 'taskUpdated' | 'taskDeleted' | 'taskActivity' | 'taskAlert', payload: any) {
        this.server?.to('admin-dashboard').emit(event, payload);
        if (payload?.assigneeId) {
            this.server?.to(`user-${payload.assigneeId}`).emit(event, payload);
        }
    }
}
