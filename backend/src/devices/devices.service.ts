import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateDeviceDto, UpdateDeviceDto } from './dtos';
import { Device } from './entities';
import { PaginationDto } from '../common/dtos';
import { DeviceType } from 'src/device-types/entities';
import { DeviceArea } from 'src/device-areas/entities';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DevicesService {

  /* ************************************
    Public methods
    ************************************ */

  /* ************************************
    Private attributes
    ************************************ */
  private readonly logger = new Logger('DevicesService');

  /* ************************************
    Constructor
    ************************************ */
  constructor (
    @InjectRepository(Device) private readonly deviceRepository: Repository<Device>,
    @InjectRepository(DeviceType) private readonly deviceTypeRepository: Repository<DeviceType>,
    @InjectRepository(DeviceArea) private readonly deviceAreaRepository: Repository<DeviceArea>,
  ) {}

  /* ************************************
    Public methods
    ************************************ */
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

  async findAll(paginationDto: PaginationDto, filterByIsActive: boolean = true) {
    const {limit = 10, offset = 0} = paginationDto;
    return await this.deviceRepository.find({
      take : limit,
      skip : offset,
      ...(filterByIsActive && { where : { isActive : true } })
    });
  }

  async findOne(id: string, filterByIsActive: boolean = true) {
    return await this.deviceRepository.findOne({
      where : {
        id,
        ...(filterByIsActive && { isActive : true })
      }
    });
  }
  
  async update(id: string, updateDeviceDto: UpdateDeviceDto, filterByIsActive: boolean = true) {

    const device = await this.deviceRepository.findOne({
      where : {
        id,
        ...(filterByIsActive && { isActive : true })
      }});

    if (!device) throw new NotFoundException(`Device with ID ${id} was not found`);

    // Check device type
    if (updateDeviceDto.deviceTypeId) {
      const deviceType = await this.deviceTypeRepository.findOne({
        where : {id: updateDeviceDto.deviceTypeId, ...(filterByIsActive && { isActive : true })}
      });
      if (!deviceType) throw new NotFoundException(`Device type with ID ${updateDeviceDto.deviceTypeId} was not found`);
      if (!deviceType.isActive) throw new UnauthorizedException(`Device type with ID ${updateDeviceDto.deviceTypeId} is not active`);
      device.deviceType = deviceType;
    }
    // Check device area
    if (updateDeviceDto.deviceTypeId) {
      const deviceArea = await this.deviceAreaRepository.findOne({
        where : {id : updateDeviceDto.deviceAreaId, ...(filterByIsActive && { isActive : true })}
      });
      if (!deviceArea) throw new NotFoundException(`Device area with ID ${updateDeviceDto.deviceAreaId} was not found`);
      if (!deviceArea.isActive) throw new UnauthorizedException(`Device area with ID ${updateDeviceDto.deviceAreaId} is not active`);
      device.deviceArea = deviceArea;
    }
    // Update fields
    Object.assign(device, updateDeviceDto);

    // Update
    return await this.deviceRepository.save({id, ...updateDeviceDto});
  }

  async desactive(id: string) {
    const result = await this.deviceRepository.update(
      {id, isActive : true},
      {isActive : false}
    );

    if (result.affected === 0) 
      throw new NotFoundException(`Device with ID ${id} was not found or is inactive`);
  }

  async remove(id: string) {
    const device = await this.deviceRepository.findOne({where: {id}});
    if (!device) throw new NotFoundException(`Device with ID ${id} was not found`);
    await this.deviceRepository.remove(device);
    return {status : 200, message : 'Removed'};
  }
  

  /* ************************************
    Private methods
    ************************************ */
  private handleDBErrors( error: any ): never {
    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );
    
    this.logger.error( error.detail );
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
