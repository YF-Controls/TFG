// This module
import { DeviceCommand } from "@devices/interfaces";


export interface DeviceControlDto {
  id: string;
  hwId: string;
  command: DeviceCommand
}
