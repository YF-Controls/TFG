// System
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Ohter modules
import { QueryParamsDto } from '@common/dtos';
import { DeviceType } from '@device-types/entities';
import { DeviceArea } from '@device-areas/entities';
// This module
import { CreateDeviceDto, UpdateDeviceDto } from './dtos';
import { Device } from './entities';


@Injectable()
export class DevicesService {
  
  // Constructor
  constructor (
    @InjectRepository(Device) private readonly deviceRepository: Repository<Device>,
    @InjectRepository(DeviceType) private readonly deviceTypeRepository: Repository<DeviceType>,
    @InjectRepository(DeviceArea) private readonly deviceAreaRepository: Repository<DeviceArea>,
  ) {}

  // Methods
  async create(createDeviceDto: CreateDeviceDto) {
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
    await this.deviceRepository.save(device);
    return device;
  }

  async findAll(queryParamsDto: QueryParamsDto) {
    // Check query parametes
    const {
      limit = 10,
      offset = 0,
      withInactives = false,
      orderBy = 'id',
      orderDirection = 'ASC' } = queryParamsDto;
    // Query and return
    return await this.deviceRepository.find({
      take : limit,
      skip : offset,
      order : { [orderBy] : orderDirection },
      ...(!withInactives && { where : { isActive : true } })
    });
  }

  async findOne(id: string, queryParamsDto: QueryParamsDto) {
    // Check query parameters
    const { withInactives = false } = queryParamsDto;
    // Query and return
    return await this.deviceRepository.findOne({
      where : {
        id,
        ...(!withInactives && { isActive : true })
      }
    });
  }
  
  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    // Get
    const device = await this.deviceRepository.findOne({where : {id}});
    // Exception
    if (!device) throw new NotFoundException(`Device with ID ${id} was not found`);
    // Check device type
    if (updateDeviceDto.deviceTypeId) {
      const deviceType = await this.deviceTypeRepository.findOne({where : {id: updateDeviceDto.deviceTypeId}});
      if (!deviceType) throw new NotFoundException(`Device type with ID ${updateDeviceDto.deviceTypeId} was not found`);
      if (!deviceType.isActive) throw new UnauthorizedException(`Device type with ID ${updateDeviceDto.deviceTypeId} is not active`);
      device.deviceType = deviceType;
    }
    // Check device area
    if (updateDeviceDto.deviceAreaId) {
      const deviceArea = await this.deviceAreaRepository.findOne({where : {id : updateDeviceDto.deviceAreaId}});
      if (!deviceArea) throw new NotFoundException(`Device area with ID ${updateDeviceDto.deviceAreaId} was not found`);
      if (!deviceArea.isActive) throw new UnauthorizedException(`Device area with ID ${updateDeviceDto.deviceAreaId} is not active`);
      device.deviceArea = deviceArea;
    }
    // Update fields
    Object.assign(device, updateDeviceDto);
    // Update
    return await this.deviceRepository.save({id, ...updateDeviceDto});
  }

  async remove(id: string) {
    const device = await this.deviceRepository.findOne({where: {id}});
    if (!device) throw new NotFoundException(`Device with ID ${id} was not found`);
    await this.deviceRepository.remove(device);
    return {status : 200, message : 'Removed'};
  }
  
}
