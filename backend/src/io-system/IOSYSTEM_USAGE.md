# Ejemplo de uso en DevicesGateway

```typescript
constructor(
  private readonly jwtService: JwtService,
  private readonly devicesService: DevicesService,
  private readonly ioSystemService: IOSystemService, // Inyectar
) {
  // Registrar callback para recibir status del IOSystem
  this.ioSystemService.onDeviceStatus((status) => {
    this.logger.log('Status received from IOSystem:', status);
    
    // Emitir a los clientes WebSocket conectados
    this.emitToDevice(status.hwId, status);
  });
}

// En algún método, enviar comando al IOSystem
@SubscribeMessage('device-control')
async handleDeviceControl(
  @MessageBody() control: { hwId: string; command: string; value: any },
  @ConnectedSocket() client: Socket
) {
  const success = this.ioSystemService.sendDeviceControl(control);
  
  if (success) {
    client.emit('control-sent', { success: true });
  } else {
    client.emit('control-error', { message: 'IOSystem not connected' });
  }
}
```

# Variables de entorno (.env)

```bash
IOSYSTEM_HOST=192.168.1.100
IOSYSTEM_PORT=5000
```

# Características implementadas

✅ Conexión automática al iniciar el módulo
✅ Reconexión automática si se cae (10 intentos cada 5 segundos)
✅ Envío de comandos: `sendDeviceControl()`
✅ Recepción de status: `onDeviceStatus(callback)`
✅ Logs detallados con Logger de NestJS
✅ Limpieza automática al destruir el módulo
✅ Validación de conexión antes de enviar
✅ Parse de JSON automático (asume que IOSystem envía JSON)
