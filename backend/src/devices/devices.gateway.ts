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
// Other moduules
import { MyJwtPayload } from '@auth/interfaces';
// This module
import { DevicesService } from './devices.service';
import { type DeviceStatusDto, type DeviceControlDto } from './dtos';


@WebSocketGateway({
  namespace: 'ws/devices', // process.env.WS_NAMESPACE_DEVICES,
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class DevicesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  // Properties
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(DevicesGateway.name);

  private intervalId: NodeJS.Timeout | null = null;
  private lampToggle: boolean = false;


  // ####################################
  // Methods
  // ####################################

  // Constructor
  constructor(
    private readonly jwtService: JwtService,
    private readonly devicesService: DevicesService,
  ) {}
  
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

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

  }

  // ####################################
  // Emit data
  // ####################################

  // Emit device data to all connected clients
  emitDeviceData(data: DeviceStatusDto) {
    this.server.emit('device-status-channel', data);
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
    
    try {
      // Get user info
      const user: MyJwtPayload = client.data.user;
      const device = await this.devicesService.findOne(data.id, { withInactives: false });
      // Device not found
      if (!device) {
        client.emit('device-ack-channel', {type: 'error', message: `Device with id ${data.id} not found`});
        return;
      }
      // hwId mismatch
      if (device.hwId !== data.hwId) {
        client.emit('device-ack-channel', {type: 'error', message: `Device hwId mismatch for id ${data.id}`});
        return;
      }
      // Broadcast to all connected clients (or specific room)
      //this.server.emit('device-ack-channel', {message: `Device hwId ${data.hwId} command received`});
      // Success
      client.emit('device-ack-channel', {type: 'success', message: `Device hwId ${data.hwId} command received`  });

      
      
      this.intervalId = setInterval(() => {

        this.lampToggle = !this.lampToggle;
        
        client.emit('device-status-channel', { 
          id: device.id,
          hwId: device.hwId,
          status: this.lampToggle ? 'isOn' : 'isOff'
         });

      }, 3000);
      

    } catch (error) {
      client.emit('device-ack-channel', {type: 'error', message: error.message});
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
