// System
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
// Other modules
import { QueryParamsDto } from '@common/dtos';
import { MyAuth } from '@auth/decorators';
import { MyValidRoles } from '@auth/interfaces';
// This module
import { CreateDeviceTypeDto, UpdateDeviceTypeDto } from '@device-types/dtos';
import { DeviceTypesService } from '@device-types/device-types.service';


@Controller('device-types')
export class DeviceTypesController {

  // Constructor
  constructor(private readonly deviceTypesService: DeviceTypesService) {}
  
  // CRUD Methods
  // Create: POST
  @Post()
  @MyAuth(MyValidRoles.admin)
  createOne(@Body() createDeviceTypeDto: CreateDeviceTypeDto) {
    return this.deviceTypesService.createOne(createDeviceTypeDto);
  }

  // Read: GET
  @Get()
  @MyAuth(MyValidRoles.admin, MyValidRoles.user)
  findAll( @Query() queryParamsDto:QueryParamsDto ) {
    return this.deviceTypesService.findAll(queryParamsDto);
  }
  
  // Read: GET
  @Get(':id')
  @MyAuth(MyValidRoles.admin)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() queryParamsDto: QueryParamsDto) {
    return this.deviceTypesService.findOne(id, queryParamsDto);
  }
  
  // Update: PATCH
  @Patch(':id')
  @MyAuth(MyValidRoles.admin)
  updateOne(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDeviceTypeDto: UpdateDeviceTypeDto) {
    return this.deviceTypesService.updateOne(id, updateDeviceTypeDto);
  }

  // Delete: DELETE
  @Delete(':id')
  @MyAuth(MyValidRoles.admin)
  deleteOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceTypesService.deleteOne(id);
  }

}
