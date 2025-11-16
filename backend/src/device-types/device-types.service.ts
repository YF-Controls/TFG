// System
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Other modules
import { QueryParamsDto } from '@common/dtos';
// This module
import { CreateDeviceTypeDto, UpdateDeviceTypeDto } from './dtos';
import { DeviceType } from './entities';
import { IsNotEmpty } from 'class-validator';


@Injectable()
export class DeviceTypesService {
  
  // Constructor
  constructor (
    @InjectRepository(DeviceType)
    private readonly repository: Repository<DeviceType>,
  ) {}
  
  // Methods
  async create(createDeviceTypeDto: CreateDeviceTypeDto) {
    // Create
    const item = this.repository.create(createDeviceTypeDto);
    // Query
    await this.repository.save(item);
    // Return
    return item;
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
    return await this.repository.find({
      take : limit,
      skip : offset,
      order : { [orderBy] : orderDirection },
      ...(!withInactives && { where : { isActive : true } })
    });
  }

  async findOne(id: string, queryParamsDto: QueryParamsDto) {
    // Check query parametes
    const { withInactives = false } = queryParamsDto;
    // Query and return
    return await this.repository.findOne({
      where : {
        id,
        ...(!withInactives && { isActive : true })
      }
    });
  }

  async update(id: string, updateDeviceTypeDto: UpdateDeviceTypeDto) {
    // Query
    const result = await this.repository.update(
      {id},
      {...updateDeviceTypeDto}
    );
    // Result
    if (result.affected === 0) 
      throw new NotFoundException(`Device type with ID ${id} was not found`);
  }
  
  async remove(id: string) {
    // Return
    return await this.repository.delete({id});
  }
  
}

