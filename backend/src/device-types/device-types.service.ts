// System
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Other modules
import { QueryParamsDto } from '@common/dtos';
// This module
import { CreateDeviceTypeDto, UpdateDeviceTypeDto } from '@device-types/dtos';
import { DeviceType } from '@device-types/entities';


@Injectable()
export class DeviceTypesService {
  
  // Constructor
  constructor (
    @InjectRepository(DeviceType)
    private readonly repository: Repository<DeviceType>,
  ) {}
  
  // CRUD Methods
  // Create: save()
  async createOne(createDeviceTypeDto: CreateDeviceTypeDto) {
    // Create
    const item = this.repository.create(createDeviceTypeDto);
    // Query
    await this.repository.save(item);
    // Return
    return item;
  }

    // Read: find()
  async findAll(queryParamsDto: QueryParamsDto) {
    // Check query parametes
    const {
      limit = 10,
      offset = 0,
      withInactives = false,
      orderBy = 'id',
      orderDirection = 'ASC' } = queryParamsDto;
    // Query and return
    const result = await this.repository.find({
      take : limit,
      skip : offset,
      order : { [orderBy] : orderDirection },
      ...(!withInactives && { where : { isActive : true } })
    });
    // Result
    return result;
  }

  // Read: findeOne()
  async findOne(id: string, queryParamsDto: QueryParamsDto) {
    // Check query parametes
    const { withInactives = false } = queryParamsDto;
    // Query and return
    const result = await this.repository.findOne({
      where : {
        id,
        ...(!withInactives && { isActive : true })
      }
    });
    // Return
    return result;
  }

  // Update: update()
  async updateOne(id: string, updateDeviceTypeDto: UpdateDeviceTypeDto) {
    // Query
    const result = await this.repository.update(
      {id},
      {...updateDeviceTypeDto}
    );
    // Error result
    if (result.affected === 0)
      throw new NotFoundException(`Device type with ID ${id} was not found`);
    // Return
    return result;
  }
  
  // Delete: delete()
  async deleteOne(id: string) {
    // Return
    const result = await this.repository.delete({id});
    // Log
    if (result.affected === 0) 
      throw new NotFoundException(`Device type with ID ${id} was not found`);
    // Return
    return result;
  }
  
}

