// System
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
// Other modules
import { QueryParamsDto } from '@common/dtos';
// This module
import { CreateDeviceTypeDto, UpdateDeviceTypeDto } from './dtos';
// This path
import { DeviceTypesService } from './device-types.service';


@Controller('device-types')
export class DeviceTypesController {

  constructor(private readonly deviceTypesService: DeviceTypesService) {}

  @Post()
  create(@Body() createDeviceTypeDto: CreateDeviceTypeDto) {
    return this.deviceTypesService.create(createDeviceTypeDto);
  }

  @Get()
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  findAll( @Query() queryParamsDto:QueryParamsDto ) {
    return this.deviceTypesService.findAll(queryParamsDto);
  }

  @Get(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() queryParamsDto: QueryParamsDto) {
    return this.deviceTypesService.findOne(id, queryParamsDto);
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
