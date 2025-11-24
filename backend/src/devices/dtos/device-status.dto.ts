// This module
import { DeviceStatus } from "@devices/interfaces";


export interface DeviceStatusDto {
  id: string;
  hwId: string;
  status: DeviceStatus;
}

