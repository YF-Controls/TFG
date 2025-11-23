export interface CreateDeviceDto {
  name: string;
  number: number;
  description : string;
  isActive: boolean;
  
  deviceTypeId: string;
  deviceAreaId: string;

}
