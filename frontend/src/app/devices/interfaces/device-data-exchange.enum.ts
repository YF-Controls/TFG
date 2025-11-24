export enum DeviceCommand {
  stop = 'stop',
  on = 'on',
  off = 'off',
  up = 'up',
  down = 'down',
  getStatus = 'getStatus'
}

export enum DeviceStatus {
  isGoingUp = 'isGoingUp',
  isGoingDown = 'isGoingDown',
  isStopped = 'isStopped',
  isOn = 'isOn',
  isOff = 'isOff',
  isStoppered = 'isStopped',
  unknown = 'unknown'
}
