// System
import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
// Other modules
import { environment } from '@env/environment.development';
// This module
import { DeviceStatusDto, DeviceControlDto } from '@devices/dtos';
import { DeviceStatus } from '@devices/interfaces';


@Injectable({
  providedIn: 'root'
})
export class DeviceWebSocketService {
  
  // Injections
  
  // Properties
  private socket: Socket | null = null;
  wsMessage = signal<string | null>(null);
  wsIsConnected = signal<boolean>(false);
  ioSystemMessage = signal<string | null>(null);
  ioSystemIsConnected = signal<boolean>(false);
  deviceStatus = signal<DeviceStatusDto>({hwId: '', status: DeviceStatus.unknown});
  
  // Connect to WebSocket
  connect(): void {
    
    if (this.socket?.connected) return;

    // Create socket connection with cookie authentication
    // The JWT cookie will be sent automatically with withCredentials: true
    // Note: WebSocket namespaces are at root level, not under /api
    this.socket = io(environment.websocketUrl, {
      withCredentials: true, // Send cookies automatically
      transports: ['websocket', 'polling'],
    });
    
    // ####################################
    // Socket system event handlers
    // ####################################
    this.socket.on('connect', () => {
      this.wsMessage.set('Connected to wsServer');
      this.wsIsConnected.set(this.socket?.connected || false);
      // Solo por jugar
      /*
      const engine = this.socket?.io.engine;

      if(!engine) return;

      engine.once('upgrade', () => {
        console.log('?DELETE DeviceWebSocketService.connect()->this.socket.on(connect)->engine.once(upgrade): Transport upgraded to WebSocket');
      });

      engine.on('packet', (packet) => {
        console.log('?DELETE DeviceWebSocketService.connect()->this.socket.on(connect)->engine.on(packet): Packet received:', packet);
      });

      engine.on('packetCreate', (packet) => {
        console.log('!?DELETE DeviceWebSocketService.connect()->this.socket.on(connect)->engine.on(packetCreate): Packet sent:', packet);
      });

      engine.on('drain', () => {
        console.log('?DELETE DeviceWebSocketService.connect()->this.socket.on(connect)->engine.on(drain): Write buffer drained');
      });

      engine.on('close', (reason) => {
        console.warn('?DELETE DeviceWebSocketService.connect()->this.socket.on(connect)->engine.on(close): Engine closed:', reason);
      });
      */
    });
    
    this.socket.on('disconnect', () => {
      this.wsMessage.set('Disconnected from wsServer');
      this.wsIsConnected.set(false);
      this.ioSystemIsConnected.set(false);
    });

    this.socket.on('connect_error', (error) => {
      this.wsMessage.set(error.message);
      this.wsIsConnected.set(false);
      this.ioSystemIsConnected.set(false);
    });

    // ####################################
    // Socket user event handlers
    // Received data from server
    // ####################################
    this.socket.on('connection-success', (data) => {
      this.wsMessage.set(data.message);
      this.wsIsConnected.set(true);
    });

    this.socket.on('connection-error', (data) => {
      this.wsMessage.set(data.message);
      this.wsIsConnected.set(false);
    });
    
    this.socket.on('io-system-status-channel', (data: {status: string, isConnected: boolean}) => {
      this.ioSystemMessage.set(data.status);
      this.ioSystemIsConnected.set(data.isConnected);
    });
    
    // Listen for device data updates
    this.socket.on('device-status-channel', (data: DeviceStatusDto) => {
      this.deviceStatus.set(data);
      this.ioSystemIsConnected.set(true);
      this.ioSystemMessage.set('Receiving device status updates');
    });
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.wsIsConnected.set(false);
      this.wsMessage.set('Disconnecting from wsServer');
    }
  }
  
  // Send command
  sendCommand(data: DeviceControlDto): void {
    if (!this.socket?.connected) return;
    this.socket.emit('device-command-channel', data);
  }
  
  /*
  // Subscribe to specific device updates
  subscribeToDevice(hwId: string): void {
    if (!this.socket?.connected) {
      console.error('?DELETE WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe-device', hwId);
    
    // Listen for subscription confirmation
    this.socket.once('subscribed', (data) => {
      console.log('?DELETE Subscribed to device:', data.hwId);
    });
  }

  // Unsubscribe from device updates
  unsubscribeFromDevice(hwId: string): void {
    if (!this.socket?.connected) {
      console.error('?DELETE WebSocket not connected');
      return;
    }

    this.socket.emit('unsubscribe-device', hwId);
    
    // Listen for unsubscription confirmation
    this.socket.once('unsubscribed', (data) => {
      console.log('?DELETE Unsubscribed from device:', data.hwId);
    });
  }
  */
  /*
  // Listen for specific device updates
  onDeviceUpdate(): Observable<any> {
    return new Observable(observer => {
      if (!this.socket) {
        observer.error('WebSocket not connected');
        return;
      }

      this.socket.on('device-update', (data) => {
        observer.next(data);
      });

      // Cleanup on unsubscribe
      return () => {
        this.socket?.off('device-update');
      };
    });
  }
  */
}
