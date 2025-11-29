// This module
import { DeviceCommand } from "@devices/interfaces";


export interface DeviceControlDto {
  hwId: string;
  command: DeviceCommand
}
