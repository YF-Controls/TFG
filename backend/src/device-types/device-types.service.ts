// System
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Other modules
import { PaginationDto } from '@common/dtos';
// This module
import { CreateDeviceTypeDto, UpdateDeviceTypeDto } from './dtos';
import { DeviceType } from './entities';


@Injectable()
export class DeviceTypesService {

  /* ************************************
    Public methods
    ************************************ */

  /* ************************************
    Private attributes
    ************************************ */
  private readonly logger = new Logger('DeviceTypesService');
  
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
    const device = this.repository.create(createDeviceTypeDto);
    await this.repository.save(device);
    return device;
  }

  async findAll(paginationDto: PaginationDto, filterByIsActive: boolean = true) {
    const { limit = 10, offset = 0 } = paginationDto;
    const devices = await this.repository.find({
      take : limit,
      skip : offset,
      ...(filterByIsActive && { where : { isActive : true } })
    });

    return devices;
  }

  async findOne(id: string, filterByIsActive: boolean = true) {
    return await this.repository.findOne({
      where : {
        id,
        ...(filterByIsActive && { isActive : true })
      }
    });
  }

  async update(id: string, updateDeviceTypeDto: UpdateDeviceTypeDto, filterByIsActive: boolean = true) {
    const result = await this.repository.update(
      {id, ...(filterByIsActive && { isActive : true })},
      {...updateDeviceTypeDto}
    );
    if (result.affected === 0) 
      throw new NotFoundException(`Device type with ID ${id} was not found`);
  }

  async desactive(id: string) {
    const result = await this.repository.update(
      {id, isActive : true},
      {isActive : false}
    );

    if (result.affected === 0) 
      throw new NotFoundException(`Device type with ID ${id} was not found or is inactive`);
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

