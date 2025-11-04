import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateDeviceDto, UpdateDeviceDto } from './dtos';
import { Device } from './entities';
import { PaginationDto } from '../common/dtos';

@Injectable()
export class DevicesService {

  // Attributes or Properties
  private readonly logger = new Logger('AuthService');

  // Constructor
  constructor (
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  // Methods
  async create(createDeviceDto: CreateDeviceDto) {
    try {
      const device = this.deviceRepository.create(createDeviceDto);
      await this.deviceRepository.save(device);
      return device;
      
    } catch (error) {this.handleDBErrors( error );}
  }

  async findAll(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    const devices = await this.deviceRepository.find({
      take : limit,
      skip : offset
    });

    return devices;
  }

  findOne(id: string) {
    return `This action returns a #${id} device`;
  }


  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    
    const device: Device = await this.deviceRepository.save({id, ...updateDeviceDto});

    return device;

  }

  async remove(id: string) {
    
    
    const device = await this.deviceRepository.delete({id});



  }

  private handleDBErrors( error: any ): never {
    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );
    
    this.logger.error( error.detail );
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
