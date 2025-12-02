// System
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Other modules
import { QueryParamsDto } from '@common/dtos';
// This module
import { CreateDeviceTypeDto, UpdateDeviceTypeDto } from '@device-types/dtos';
import { DeviceType } from '@device-types/entities';
import { buildWhereClauseFn } from '@common/buildWhereClauseFn';
import { OrderDirection } from '@common/interfaces';


@Injectable()
export class DeviceTypesService {
  
  // Properties
  private readonly logger = new Logger(DeviceTypesService.name);
  
  // Constructor
  constructor (
    @InjectRepository(DeviceType)
    private readonly repository: Repository<DeviceType>,
  ) {}
  
  // CRUD Methods
  // Create: save()
  async createOne(createDeviceTypeDto: CreateDeviceTypeDto) {
    const item = this.repository.create(createDeviceTypeDto);
    return this.repository.save(item);
  }

    // Read: find()
  async findAll(queryParamsDto: QueryParamsDto) {
    console.log('!DELETE deviceTypes.findAll - Query Params:', queryParamsDto);
    // Check query parametes
    const {
      limit = null,
      offset = 0,
      orderBy = 'id',
      orderDirection = 'ASC' } = queryParamsDto;

    // Query and return
    const result = await this.repository.find({
      ...(limit && Number.isInteger(limit) && limit > 0 && { take: limit }),
      skip : offset,
      order : { [orderBy] : orderDirection },
      where: buildWhereClauseFn(queryParamsDto),
    });
    // Result
    return result;
  }

  // Read: findeOne()
  async findOne(id: string, queryParamsDto: QueryParamsDto) {
    console.log('!DELETE deviceTypes.findOne - ID:', id);
    // Query and return
    const result = await this.repository.findOne({
      where : buildWhereClauseFn(queryParamsDto, id),
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

