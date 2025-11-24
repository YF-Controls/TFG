// This module
import { DeviceCommand, DeviceStatus } from "@devices/interfaces";


export interface DeviceStatusDto {
  id: string;
  hwId: string;
  status: DeviceStatus;
}

export interface DeviceControlDto {
  id: string;
  hwId: string;
  command: DeviceCommand
}
