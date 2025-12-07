// System
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
// Other modules
import { MyJwtPayload } from '@auth/interfaces';
import { IOSystemService } from '@io-system/io-system.service';
// This module
import { type DeviceStatusDto, type DeviceControlDto } from './dtos';


@WebSocketGateway({
  namespace: process.env.BACKEND_WS_NAMESPACE_DEVICES,
  cors: {
    //origin: process.env.FRONTEND_URL,
    origin: true, // Allow all origins - adjust for production!
    credentials: true,
  },
})
export class DevicesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  // Properties
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(DevicesGateway.name);
  
  // ####################################
  // Methods
  // ####################################

  // Constructor
  constructor(
    private readonly jwtService: JwtService,
    private readonly ioSystemService: IOSystemService
  ) {
    // Subscribe to IO-System device status updates
    this.ioSystemService.onDeviceStatus((status: DeviceStatusDto) => {
      this.emitDeviceStatus(status);
    });
    // Subscribe to IO-System connection status updates
    this.ioSystemService.onIOSystemStatus((status: {status: string, isConnected: boolean}) => {
      this.emitIOSystemStatus(status);
    });
  }
  
  // OnGatewayConnection implements this method
  async handleConnection(client: Socket) {
    try {
      // Validate client and get JWT payload
      const payload: MyJwtPayload = await this.validateClientAndGetJWTPayload(client);
      client.data.user = payload;

      // Send welcome message
      this.logger.log(`Connected client ${client.id}, user id ${payload.id} authenticated successfully`);
      client.emit('connection-success', { 
        message: 'Connected',
        token: payload
      });
      
    } catch (error) {
      // Log and disconnect
      this.logger.error(`Connection rejected: ${error.message}`);
      client.emit('connection-error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  // OnGatewayDisconnect implements this method
  handleDisconnect(client: Socket) {
    const user = client.data.user;
    this.logger.log(`Client disconnected: ${client.id}, user id: ${user?.id}`);
  }

  // ####################################
  // Handle Emit data
  // ####################################
  async emitDeviceStatus(data: DeviceStatusDto): Promise<boolean> {
    return this.server.emit('device-status-channel', data);
  }
  
  async emitIOSystemStatus({status, isConnected}: {status: string, isConnected: boolean}): Promise<boolean> {
    return this.server.emit('io-system-status-channel', {status, isConnected});
  }
  
  // Emit to specific device room
  /*
  emitToDevice(hwId: string, status: string) {
    this.server.to(`device:${hwId}`).emit('device-data-update', status);
  }*/

  // ####################################
  // Handle subscriptions
  // ####################################
  // Listen for device data from clients
  @SubscribeMessage('device-command-channel')
  async handleReceivedDeviceCommand(
    @MessageBody() data: DeviceControlDto, @ConnectedSocket() client: Socket) {
    // Try to send command to IO-System
    try {
      const done = await this.ioSystemService.sendDeviceControl(data);
      // Broadcast to all connected clients (or specific room)
      //this.server.emit('device-ack-channel', {message: `Device hwId ${data.hwId} command received`});
      // Error
      if (!done) {
        client.emit('io-system-status-channel', {status: 'IO-System does not respond', isConnected: false});
        return;
      }
      
    // Sending error
    } catch (error) {
      client.emit('io-system-status-channel', {status: `IO-System error: ${error.message}`, isConnected: false});
    }
  }
  
  /*
  // Subscribe to device updates
  @SubscribeMessage('subscribe-device')
  handleSubscribeDevice(
    @MessageBody() hwId: string,
    @ConnectedSocket() client: Socket) {
    
    client.join(`device:${hwId}`);
    this.logger.log(`Client ${client.id} subscribed to device: ${hwId}`);
    client.emit('subscribed', { hwId });
  }

  // Unsubscribe from device updates
  @SubscribeMessage('unsubscribe-device')
  handleUnsubscribeDevice(
    @MessageBody() hwId: string,
    @ConnectedSocket() client: Socket) {
    
    client.leave(`device:${hwId}`);
    this.logger.log(`Client ${client.id} unsubscribed from device: ${hwId}`);
    client.emit('unsubscribed', { hwId });
  }
  */

  // ####################################
  // Private methods
  // ####################################

  // Validate JWT from handshake
  private async validateClientAndGetJWTPayload(client: Socket): Promise<MyJwtPayload> {
    try {
      // Get token
      const token = 
        client.handshake.auth?.token || 
        client.handshake.headers?.authorization?.split(' ')[1] ||
        this.extractTokenFromCookie(client.handshake.headers.cookie!); 
      // Check token
      if (!token) throw new UnauthorizedException('No token provided');
      // Verify JWT
      return await this.jwtService.verifyAsync(token);

    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Extract token from cookie header
  private extractTokenFromCookie(cookieHeader: string): string | null {
    // Check header
    if (!cookieHeader) return null
    // Get cookie
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith('token='));
    // Return
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }

}
