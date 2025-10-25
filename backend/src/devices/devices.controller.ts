import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { DevicesService } from './devices.service';

import { PaginationDto } from '../common/dtos';
import { CreateDeviceDto, UpdateDeviceDto } from './dtos';

import { MyAuth } from '../auth/decorators/auth.decorator';
import { MyValidRoles } from '../auth/interfaces';


@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @MyAuth(MyValidRoles.admin, MyValidRoles.user)
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @Patch(':id')
  @MyAuth(MyValidRoles.admin, MyValidRoles.user)
  update(
    @Param( 'id', ParseUUIDPipe ) id: string,
    @Body() UpdateDeviceDto: UpdateDeviceDto
  ) {
    return this.devicesService.update(id, UpdateDeviceDto);
  }
  
  @Get()
  @MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.devicesService.findAll(paginationDto);
  }

}
