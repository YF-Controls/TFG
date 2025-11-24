// System
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
// Other modules
import { QueryParamsDto } from '@common/dtos';
import { MyAuth } from '@auth/decorators';
import { MyValidRoles } from '@auth/interfaces';
// This module
import { CreateDeviceDto, UpdateDeviceDto } from '@devices/dtos';
import { DevicesService } from '@devices/devices.service';


@Controller('devices')
export class DevicesController {
  
  // Constructor
  constructor(private readonly devicesService: DevicesService) {}

  // CRUD Methods
  // Create: POST
  @Post()
  @MyAuth(MyValidRoles.admin)
  createOne(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.createOne(createDeviceDto);
  }
  
  // Read: GET
  @Get(':id')
  @MyAuth(MyValidRoles.admin)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() queryParamsDto: QueryParamsDto ) {
    return this.devicesService.findOne(id, queryParamsDto);
  }

  // Read: GET
  @Get()
  @MyAuth(MyValidRoles.admin, MyValidRoles.user)
  findAll( @Query() queryParamsDto:QueryParamsDto ) {
    return this.devicesService.findAll(queryParamsDto);
  }
  
  // Update: PATCH
  @Patch(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user)
  updateOne(
    @Param( 'id', ParseUUIDPipe ) id: string,
    @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.devicesService.updateOne(id, updateDeviceDto);
  }
  
  // Delete: DELETE
  @Delete(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user)
  deleteOne(@Param( 'id', ParseUUIDPipe ) id: string,) {
    return this.devicesService.deleteOne(id);
  }
}
