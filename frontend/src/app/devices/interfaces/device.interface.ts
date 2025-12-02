// Other modules
import { DeviceArea } from "@device-areas/interfaces";
import { DeviceType } from "@device-types/interfaces";

export interface Device {
  id: string;
  name: string;
  number : number;
  hwId : string;
  description : string;
  isActive : boolean;
  deviceTypeId : string;
  deviceType? : DeviceType;
  deviceAreaId : string;
  deviceArea? : DeviceArea;
}