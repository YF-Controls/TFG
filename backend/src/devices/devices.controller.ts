// System
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
// Other modules
import { PaginationDto } from '@common/dtos';
import { MyAuth } from '@auth/decorators';
import { MyValidRoles } from '@auth/interfaces';
// This module
import { CreateDeviceDto, UpdateDeviceDto } from './dtos';
// This path
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {
  
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user)
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }
  
  @Get()
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.devicesService.findAll(paginationDto);
  }
  
  @Get(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  findOne( @Param('id', ParseUUIDPipe ) id: string ) {
    return this.devicesService.findOne(id);
  }

  @Patch(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user)
  update(
    @Param( 'id', ParseUUIDPipe ) id: string,
    @Body() UpdateDeviceDto: UpdateDeviceDto
  ) {
    return this.devicesService.update(id, UpdateDeviceDto);
  }
  
  @Delete(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user)
  remove(@Param( 'id', ParseUUIDPipe ) id: string,) {
    return this.devicesService.remove(id);
  }
}
