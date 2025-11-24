// System
import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
// Other modules
import { environment } from '@env/environment.development';
// This module
import { DeviceStatusDto, DeviceControlDto } from '@devices/dtos';


@Injectable({
  providedIn: 'root'
})
export class DeviceWebSocketService {
  
  // Injections
  
  // Properties
  private socket: Socket | null = null;
  
  isConnected = signal<boolean>(false);
  connectionError = signal<string | null>(null);
  deviceStatus = signal<DeviceStatusDto>({id: '', hwId: '', status: ''});
  socketId = signal<string | null>(null);

  // Connect to WebSocket
  connect(): void {

    console.log('!DELETE DeviceWebSocketService.connect() called');

    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    // Create socket connection with cookie authentication
    // The JWT cookie will be sent automatically with withCredentials: true
    // Note: WebSocket namespaces are at root level, not under /api
    this.socket = io(environment.websocketUrl, {
      withCredentials: true, // Send cookies automatically
      transports: ['websocket', 'polling'],
    });

    console.log('!DELETE DeviceWebSocketService.connect() socket value', this.socket);

    // ####################################
    // Socket system event handlers
    // ####################################
    this.socket.on('connect', () => {
      console.log('!DELETE DeviceWebSocketService.connect()->this.socket.on(connect): Connected:', this.socket);
      this.isConnected.set(this.socket?.connected || false);
      this.socketId.set(this.socket?.id || null);
      this.connectionError.set(null);
      // Solo por jugar
      /*
      const engine = this.socket?.io.engine;

      if(!engine) return;

      engine.once('upgrade', () => {
        console.log('!DELETE DeviceWebSocketService.connect()->this.socket.on(connect)->engine.once(upgrade): Transport upgraded to WebSocket');
      });

      engine.on('packet', (packet) => {
        console.log('!DELETE DeviceWebSocketService.connect()->this.socket.on(connect)->engine.on(packet): Packet received:', packet);
      });

      engine.on('packetCreate', (packet) => {
        console.log('!DELETE DeviceWebSocketService.connect()->this.socket.on(connect)->engine.on(packetCreate): Packet sent:', packet);
      });

      engine.on('drain', () => {
        console.log('!DELETE DeviceWebSocketService.connect()->this.socket.on(connect)->engine.on(drain): Write buffer drained');
      });

      engine.on('close', (reason) => {
        console.warn('!DELETE DeviceWebSocketService.connect()->this.socket.on(connect)->engine.on(close): Engine closed:', reason);
      });
      */
    });
    
    this.socket.on('disconnect', () => {
      console.warn('!DELETE DeviceWebSocketService.connect()->this.socket.on(disconnect): WebSocket disconnected');
      this.socketId.set(null);
      this.isConnected.set(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('!DELETE DeviceWebSocketService.connect()->this.socket.on(connect_error):', error.message);
      this.connectionError.set(error.message);
      this.isConnected.set(false);
    });

    // ####################################
    // Socket user event handlers
    // ####################################
    this.socket.on('connection-success', (data) => {
      console.log('!DELETE DeviceWebSocketService.connect()->this.socket.on(connection-success):', data);
    });

    this.socket.on('connection-error', (data) => {
      console.error('!DELETE DeviceWebSocketService.connect()->this.socket.on(connection-error):', data);
      this.connectionError.set(data.message);
    });
    
    // Listen for device data updates
    this.socket.on('device-status-channel', (data) => {
      console.log('!DELETE DeviceWebSocketService.connect()->this.socket.on(device-data-from-backend):', data);
      this.deviceStatus.set(data);
    });

    this.socket.on('device-ack-channel', (message) => {
      console.log('!DELETE DeviceWebSocketService.connect()->this.socket.on(error-message):', message);
    });


    /*
    // Listen for errors
    this.socket.on('device-error-from-backend', (error) => {
      console.error('!DELETE DeviceWebSocketService.connect()->this.socket.on(device-error-from-backend):', error)
    });

    // Listen for acknowledgments
    this.socket.on('device-ack-from-backend', (ack) => {
      console.info('!DELETE DeviceWebSocketService.connect()->this.socket.on(device-ack-from-backend):', ack);
    });
    */
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected.set(false);
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
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe-device', hwId);
    
    // Listen for subscription confirmation
    this.socket.once('subscribed', (data) => {
      console.log('Subscribed to device:', data.hwId);
    });
  }

  // Unsubscribe from device updates
  unsubscribeFromDevice(hwId: string): void {
    if (!this.socket?.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit('unsubscribe-device', hwId);
    
    // Listen for unsubscription confirmation
    this.socket.once('unsubscribed', (data) => {
      console.log('Unsubscribed from device:', data.hwId);
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
