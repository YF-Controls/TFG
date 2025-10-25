import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateDeviceDto, UpdateDeviceDto } from './dtos';
import { Device } from './entities';

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

  findAll() {
    return `This action returns all devices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }

  private handleDBErrors( error: any ): never {
    //if ( error.code === '23505' ) 
    //  throw new BadRequestException( error.detail );
    
    this.logger.error( error.detail );
    throw new InternalServerErrorException('Please check server logs');
  }
}
