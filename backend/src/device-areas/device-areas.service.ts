// System
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Other modules
import { QueryParamsDto } from '@common/dtos';
// This module
import { CreateDeviceAreaDto, UpdateDeviceAreaDto } from '@device-areas/dtos';
import { DeviceArea } from '@device-areas/entities';
import { buildWhereClauseFn } from '@common/buildWhereClauseFn';


@Injectable()
export class DeviceAreasService {

  // Properties
  private readonly logger = new Logger(DeviceAreasService.name);
  
  // Constructor
  constructor (
    @InjectRepository(DeviceArea)
    private readonly repository: Repository<DeviceArea>,
  ) {}
  
  // CRUD Methods
  // Create: save()
  async createOne(createDeviceAreaDto: CreateDeviceAreaDto) {
    // Create
    const item = this.repository.create(createDeviceAreaDto);
    // Query
    await this.repository.save(item);
    // Return
    return item;
  }

  // Read: find()
  async findAll(queryParamsDto: QueryParamsDto) {
    // Check query parametes
    const {
      limit = null,
      offset = 0,
      orderBy = 'id',
      orderDirection = 'ASC' } = queryParamsDto;
    // Query and return
    return await this.repository.find({
      ...(limit && Number.isInteger(limit) && limit > 0 && { take: limit }),
      skip : offset,
      order : { [orderBy] : orderDirection },
      where: buildWhereClauseFn(queryParamsDto),
    });
  }

  // Read: findOne()
  async findOne(id: string, queryParamsDto: QueryParamsDto) {
    // Query and return
    return await this.repository.findOne({
      where : buildWhereClauseFn(queryParamsDto, id),
    });
  }
    
  // Update: update()
  async updateOne(id: string, updateDeviceAreaDto: UpdateDeviceAreaDto) {
    // Query
    const result = await this.repository.update(
      {id},
      {...updateDeviceAreaDto}
    );
    // Result
    if (result.affected === 0) 
      throw new NotFoundException(`Device Area with ID ${id} was not found`);
  }
  
  // Delete: delete()
  async deleteOne(id: string) {
    // Return
    return await this.repository.delete({id});
  }
  
}


