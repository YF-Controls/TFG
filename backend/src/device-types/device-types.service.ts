import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateDeviceTypeDto, UpdateDeviceTypeDto } from './dtos';
import { DeviceType } from './entities';
import { PaginationDto } from '../common/dtos';

@Injectable()
export class DeviceTypesService {

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
    @InjectRepository(DeviceType)
    private readonly repository: Repository<DeviceType>,
  ) {}
  
  /* ************************************
    Public methods
    ************************************ */
  async create(createDeviceTypeDto: CreateDeviceTypeDto) {
  try {
    const device = this.repository.create(createDeviceTypeDto);
    await this.repository.save(device);
    return device;
    
  } catch (error) {this.handleDBErrors( error );}
}

  async findAll(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    const devices = await this.repository.find({
      take : limit,
      skip : offset
    });

    return devices;
  }

  findOne(id: string) {
    return `This action returns a #${id} deviceType`;
  }

  async update(id: string, updateDeviceTypeDto: UpdateDeviceTypeDto) {
    return await this.repository.save({id, ...updateDeviceTypeDto});
  }

  async remove(id: string) {
    const device = await this.repository.delete({id});
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

