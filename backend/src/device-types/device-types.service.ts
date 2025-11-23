// System
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Other modules
import { QueryParamsDto } from '@common/dtos';
// This module
import { CreateDeviceTypeDto, UpdateDeviceTypeDto } from './dtos';
import { DeviceType } from './entities';


@Injectable()
export class DeviceTypesService {
  
  // Logger
  private readonly logger = new Logger(DeviceTypesService.name);
  
  // Constructor
  constructor (
    @InjectRepository(DeviceType)
    private readonly repository: Repository<DeviceType>,
  ) {}
  
  // CRUD Methods
  // Create: save
  async createOne(createDeviceTypeDto: CreateDeviceTypeDto) {
    this.logger.log(`Creating device type: ${JSON.stringify(createDeviceTypeDto)}`);
    // Create
    const item = this.repository.create(createDeviceTypeDto);
    // Query
    await this.repository.save(item);
    this.logger.log(`Device type created successfully with ID: ${item.id}`);
    // Return
    return item;
  }
  
  // Read: findAll
  async findAll(queryParamsDto: QueryParamsDto) {
    // Log
    this.logger.log(`findAll(params: ${JSON.stringify(queryParamsDto)})`);
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
    this.logger.log(`filAll() found ${result.length} device types`);
    return result;
  }

  // Read: findeOne
  async findOne(id: string, queryParamsDto: QueryParamsDto) {
    // Log
    this.logger.log(`findOne(${id}, params: ${JSON.stringify(queryParamsDto)})`);
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
    console.log(`findOne(${id}) result: ${JSON.stringify(result)}`);
    return result;
  }

  // Update: update
  async updateOne(id: string, updateDeviceTypeDto: UpdateDeviceTypeDto) {
    // Log
    this.logger.log(`updateOne(${id})`);
    // Query
    const result = await this.repository.update(
      {id},
      {...updateDeviceTypeDto}
    );
    // Error result
    if (result.affected === 0) {
      this.logger.warn(`updateOne(${id}) id was not found for update`);
      throw new NotFoundException(`Device type with ID ${id} was not found`);
    }
    this.logger.log(`updateOne(${id}) done!`);
    // Return
    return result;
  }
  
  // Delete: remove
  async deleteOne(id: string) {
    // Log
    this.logger.log(`deleteOne(${id})`);
    // Return
    const result = await this.repository.delete({id});
    // Log
    if (result.affected === 0) this.logger.warn(`deleteOne(${id}) id was not found for deletion`);
    else this.logger.log(`deleteOne(${id}) done!`);
    // Return
    return result;
  }
  
}

