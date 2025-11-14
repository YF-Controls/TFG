// System
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
// Oteher modules
import { PaginationDto } from '@common/dtos';
// This module
import { CreateDeviceAreaDto, UpdateDeviceAreaDto } from './dtos';
// This path
import { DeviceAreasService } from './device-areas.service';


@Controller('device-areas')
export class DeviceAreasController {

  constructor(private readonly deviceAreasService: DeviceAreasService) {}

  @Post()
  create(@Body() createDeviceAreaDto: CreateDeviceAreaDto) {
    return this.deviceAreasService.create(createDeviceAreaDto);
  }

  @Get()
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.deviceAreasService.findAll(paginationDto);
  }
  
  @Get('/:id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  findOne(
    @Param('id', ParseUUIDPipe) id: string) {
    return this.deviceAreasService.findOne(id);
  }

  @Patch(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDeviceAreaDto: UpdateDeviceAreaDto) {
    return this.deviceAreasService.update(id, updateDeviceAreaDto);
  }

  @Delete(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceAreasService.remove(id);
  }
}
