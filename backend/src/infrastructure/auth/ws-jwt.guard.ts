import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const authToken = client.handshake.auth?.token;
    const headerToken = client.handshake.headers.authorization?.split(' ')[1];
    const token = authToken || headerToken;

    if (!token) throw new WsException('Missing authentication token');

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.user = { id: payload.sub, role: payload.role };
      return true;
    } catch {
      throw new WsException('Invalid or expired token');
    }
  }
}
