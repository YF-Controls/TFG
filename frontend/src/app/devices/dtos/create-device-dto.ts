export interface CreateDeviceDto {
  name: string;
  nr: number;
  description : string;

  deviceTypeId: string;
  deviceAreaId: string;

}
