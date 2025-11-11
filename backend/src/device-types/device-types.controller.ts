// System
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
// Other modules
import { PaginationDto } from '@common/dtos';
// This module
import { CreateDeviceTypeDto, UpdateDeviceTypeDto } from './dtos';
// This path
import { DeviceTypesService } from './';

@Controller('device-types')
export class DeviceTypesController {

  constructor(private readonly deviceTypesService: DeviceTypesService) {}

  @Post()
  create(@Body() createDeviceTypeDto: CreateDeviceTypeDto) {
    return this.deviceTypesService.create(createDeviceTypeDto);
  }

  @Get()
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.deviceTypesService.findAll(paginationDto);
  }

  @Get(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceTypesService.findOne(id);
  }

  @Patch(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDeviceTypeDto: UpdateDeviceTypeDto) {
    return this.deviceTypesService.update(id, updateDeviceTypeDto);
  }

  @Delete(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceTypesService.remove(id);
  }

}
