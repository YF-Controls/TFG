// System
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Socket } from 'net';
// Other modules
import { DeviceControlDto, DeviceStatusDto } from '@devices/dtos';
import { DeviceCommand, DeviceStatus } from '@devices/interfaces';



@Injectable()
export class IOSystemService implements OnModuleInit, OnModuleDestroy {
  
  // Properties
  private readonly logger = new Logger(IOSystemService.name);
  private client: Socket | null = null;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 5000; // 5 seconds
  private isConnecting = false;
  // Configuration
  private readonly host = process.env.IO_SYSTEM_HOST || 'localhost';
  private readonly port = parseInt(process.env.IO_SYSTEM_PORT || '2000', 10);
  // Callbacks for received data
  private onDeviceStatusReceived: ((status: DeviceStatusDto) => void) | null = null;

  // ####################################
  // Methods from OnModuleInit, OnModuleDestroy
  // ####################################
  
  // Lifecycle: Init
  onModuleInit() {
    this.logger.log('IO-System service initializing...');
    this.connect();
  }

  // Lifecycle: Destroy
  onModuleDestroy() {
    this.logger.log('IO-System service destroying...');
    this.disconnect();
  }

  // ####################################
  // Methods
  // ####################################

  // Connect to IO-System TCP server
  connect(): void {
    if (this.isConnecting || this.client?.connecting) {
      this.logger.warn('Connection already in progress');
      return;
    }

    if (this.client?.destroyed === false) {
      this.logger.warn('Already connected to IO-System');
      return;
    }

    this.isConnecting = true;
    this.logger.log(`Connecting to IO-System at ${this.host}:${this.port}...`); 

    this.client = new Socket();

    // ####################################
    // Socket event handlers
    // ####################################
    // Connection successful
    this.client.on('connect', () => {
      this.logger.log('Connected to IO-System');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      
      // Clear reconnect interval if exists
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    });

    // Receive data from IO-System
    this.client.on('data', (buffer: Buffer) => {
      // Parse JSON (assuming IO-System sends JSON)
      const data = buffer.toString('utf-8');
      const status: DeviceStatusDto = this.binaryToDeviceStatus(data);
      this.logger.debug(`!DELETE received: ${data} parsed: ${JSON.stringify(status)}`);
      // Call callback if registered
      if (this.onDeviceStatusReceived) this.onDeviceStatusReceived(status);
    });

    // Connection closed
    this.client.on('close', () => {
      this.logger.warn('Connection to IO-System closed');
      this.isConnecting = false;
      this.handleReconnect();
    });

    // Connection error
    this.client.on('error', (error) => {
      this.logger.error(`IO-System connection error: ${error.message}`);
      this.isConnecting = false;
    });
    // ####################################

    // Attempt connection
    this.client.connect(this.port, this.host);
  }

  // Disconnect from IO-System
  disconnect(): void {
    this.logger.log('Disconnecting from IO-System...');
    
    // Clear reconnect interval
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }

    // Close socket
    if (this.client) {
      this.client.destroy();
      this.client = null;
    }
  }

  // Send device control command to IO-System
  sendDeviceControl(control: DeviceControlDto): boolean {
    // Check connection
    if (!this.client || this.client.destroyed) {
      this.logger.error('Cannot send command: Not connected to IO-System');
      return false;
    }
    // Try sending command
    try {
      const message = this.deviceCommandToBinary(control);
      this.client.write(message);
      return true;
    // Sending error
    } catch (error) {
      this.logger.error(`Error sending command to IO-System: ${error.message}`);
      return false;
    }
  }

  // Register callback for status updates
  onDeviceStatus(callback: (status: DeviceStatusDto) => void): void {
    this.onDeviceStatusReceived = callback;
  }

  // Check if connected
  isConnected(): boolean {
    return this.client !== null && !this.client.destroyed;
  }

  // ####################################
  // Private methods
  // ####################################
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.logger.error(`Max reconnect attempts (${this.maxReconnectAttempts}) reached. Stopping reconnection.`);
      return;
    }

    if (this.reconnectInterval) {
      return; // Already trying to reconnect
    }

    this.reconnectAttempts++;
    this.logger.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay}ms...`);

    this.reconnectInterval = setInterval(() => {
      if (!this.isConnected() && !this.isConnecting) {
        this.connect();
      }
    }, this.reconnectDelay);
  }

  private binaryToDeviceStatus(buffer: string): DeviceStatusDto {
   // Split buffer and parse
    const parts = buffer.replace('(', '').replace(')', '').split(',');
    // Expecting format: (hwId,status)
    if (parts.length !== 2) return {id: '', hwId: '', status: DeviceStatus.unknown};
    // Convert status code to DeviceStatus enum
    const status = parts[1] === '0' ? DeviceStatus.isStopped :
                   parts[1] === '1' ? DeviceStatus.isOff :
                   parts[1] === '2' ? DeviceStatus.isOn :
                   parts[1] === '3' ? DeviceStatus.isGoingDown :
                   parts[1] === '4' ? DeviceStatus.isGoingUp : DeviceStatus.unknown;
    // Return DTO
    return {id: '', hwId: parts[0], status: status};
  }

  private deviceCommandToBinary(data: DeviceControlDto): string {
    // Map command to code
    const command = data.command === DeviceCommand.stop ? '0' :
                    data.command === DeviceCommand.off ? '1' :
                    data.command === DeviceCommand.on ? '2' :
                    data.command === DeviceCommand.down ? '3' :
                    data.command === DeviceCommand.up ? '4' :
                    data.command === DeviceCommand.getStatus ? 'g' : '!';
    // Return formatted string
    return `(${data.hwId},${command})`;    

  }
}
