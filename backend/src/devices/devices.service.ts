// System
import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, SaveOptions } from 'typeorm';
// Other modules
import { QueryParamsDto } from '@common/dtos';
import { OrderDirection } from '@common/interfaces';
import { DeviceType } from '@device-types/entities';
import { DeviceArea } from '@device-areas/entities';
// This module
import { CreateDeviceDto, UpdateDeviceDto } from '@devices/dtos';
import { Device } from '@devices/entities';
import { buildWhereClauseFn } from '@common/buildWhereClauseFn';


@Injectable()
export class DevicesService {
   
  // Properties
  private readonly logger = new Logger(DevicesService.name);

  // Constructor
  constructor (
    @InjectRepository(Device) private readonly deviceRepository: Repository<Device>,
    @InjectRepository(DeviceType) private readonly deviceTypeRepository: Repository<DeviceType>,
    @InjectRepository(DeviceArea) private readonly deviceAreaRepository: Repository<DeviceArea>,
  ) {}

  // CRUD Methods
  // Create: save()
  async createOne(createDeviceDto: CreateDeviceDto) {
    // Check device type
    const deviceType = await this.deviceTypeRepository.findOne({where : {id: createDeviceDto.deviceTypeId}});
    if (!deviceType) throw new NotFoundException(`Device type with ID ${createDeviceDto.deviceTypeId} was not found`);
    if (!deviceType.isActive) throw new UnauthorizedException(`Device type with ID ${createDeviceDto.deviceTypeId} is not active`);
    // Check device area
    const deviceArea = await this.deviceAreaRepository.findOne({where : {id : createDeviceDto.deviceAreaId}});
    if (!deviceArea) throw new NotFoundException(`Device area with ID ${createDeviceDto.deviceAreaId} was not found`);
    if (!deviceArea.isActive) throw new UnauthorizedException(`Device area with ID ${createDeviceDto.deviceAreaId} is not active`);
    // Create device
    const device = this.deviceRepository.create(createDeviceDto);
    // Build hwId
    device.hwId = this.buildHwId(deviceArea.hwId, deviceType.hwId, device.number);
    // Save    
    return await this.deviceRepository.save(device);
  }


  // Read: find()
  async findAll(queryParamsDto: QueryParamsDto) {
    // Check query parametes for limit, offset and order
    const {
      limit = null,
      offset = 0,
      orderBy = 'id',
      orderDirection = OrderDirection.ASC } = queryParamsDto;

    // Query and return
    return await this.deviceRepository.find({
      ...(limit && Number.isInteger(limit) && limit > 0 && { take: limit }),
      skip : offset,
      order : { [orderBy] : orderDirection },
      where: buildWhereClauseFn(queryParamsDto),
    });
  }
  

  // Read: findOne()
  async findOne(id: string, queryParamsDto: QueryParamsDto) {
    // Query and return
    return await this.deviceRepository.findOne({
      where : buildWhereClauseFn(queryParamsDto, id),
    });
  }
  
  // Read: findOneByHwId()
  async findOneByHwId(hwId: string, queryParamsDto: QueryParamsDto) {
    // Query and return
    return await this.deviceRepository.findOne({
      where : {
        ...buildWhereClauseFn(queryParamsDto, null, hwId)}
    });
  }
  
  // Update: update()
  async updateOne(id: string, updateDeviceDto: UpdateDeviceDto) {
    // Get
    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: ['deviceType', 'deviceArea']
    });
    // Exception
    if (!device) throw new NotFoundException(`Device with ID ${id} was not found`);
    
    let deviceType = device.deviceType;
    let deviceArea = device.deviceArea;
    let deviceNumber = device.number;
    let deviceTypeHwId = device.deviceType.hwId;
    let deviceAreaHwId = device.deviceArea.hwId;
    
    // Check device type
    if (updateDeviceDto.deviceTypeId) {
      const foundDeviceType = await this.deviceTypeRepository.findOne({where : {id: updateDeviceDto.deviceTypeId}});
      if (!foundDeviceType) throw new NotFoundException(`Device type with ID ${updateDeviceDto.deviceTypeId} was not found`);
      if (!foundDeviceType.isActive) throw new UnauthorizedException(`Device type with ID ${updateDeviceDto.deviceTypeId} is not active`);
      deviceType = foundDeviceType;
    }
    // Check device area
    if (updateDeviceDto.deviceAreaId) {
      const foundDeviceArea = await this.deviceAreaRepository.findOne({where : {id : updateDeviceDto.deviceAreaId}});
      if (!foundDeviceArea) throw new NotFoundException(`Device area with ID ${updateDeviceDto.deviceAreaId} was not found`);
      if (!foundDeviceArea.isActive) throw new UnauthorizedException(`Device area with ID ${updateDeviceDto.deviceAreaId} is not active`);
      deviceArea = foundDeviceArea;
    }
    
    // Update fields
    Object.assign(device, updateDeviceDto);
    
    // Update relations explicitly
    device.deviceType = deviceType;
    device.deviceArea = deviceArea;
    
    // Rebuild hwId
    if (device.number !== deviceNumber) deviceNumber = device.number;
    if (deviceType.hwId !== deviceTypeHwId ) deviceTypeHwId = deviceType.hwId;
    if (deviceArea.hwId !== deviceAreaHwId ) deviceAreaHwId = deviceArea.hwId;
    device.hwId = this.buildHwId(deviceAreaHwId, deviceTypeHwId, deviceNumber);
    
    // Update and return a Device
    return await this.deviceRepository.save(device);
  }

  // Delete: delete()
  async deleteOne(id: string) {
    const device = await this.deviceRepository.findOne({where: {id}});
    if (!device) throw new NotFoundException(`Device with ID ${id} was not found`);
    await this.deviceRepository.remove(device);
    return {status : 200, message : 'Removed'};
  }

  // Private methods
  private buildHwId(deviceAreaHwId: string, deviceTypeHwId: string, number: number): string {
    return `${deviceAreaHwId.toLowerCase().trim()}-${deviceTypeHwId.toLowerCase().trim()}-${number.toString().padStart(4, '0') }`;
  }
  
 
}
