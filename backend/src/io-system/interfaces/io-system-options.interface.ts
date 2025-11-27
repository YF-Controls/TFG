export interface IOSystemModuleOptions {
  host: string;
  port: number;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}
