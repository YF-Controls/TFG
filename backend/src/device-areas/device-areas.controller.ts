// System
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// Oteher modules
import { QueryParamsDto } from '@common/dtos';
import { MyAuth } from '@auth/decorators';
import { MyValidRoles } from '@auth/interfaces';
// This module
import { CreateDeviceAreaDto, UpdateDeviceAreaDto } from '@device-areas/dtos';
import { DeviceAreasService } from '@device-areas/device-areas.service';


@ApiTags('Device Areas')
@Controller('device-areas')
export class DeviceAreasController {

  // Constructor
  constructor(private readonly deviceAreasService: DeviceAreasService) {}

  // CRUD Methods
  // Create: POST
  @Post()
  @MyAuth(MyValidRoles.admin)
  createOne(@Body() createDeviceAreaDto: CreateDeviceAreaDto) {
    return this.deviceAreasService.createOne(createDeviceAreaDto);
  }

  // Read: GET
  @Get(':id')
  @MyAuth(MyValidRoles.admin)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() queryParamsDto: QueryParamsDto ) {
    return this.deviceAreasService.findOne(id, queryParamsDto);
  }

  // Read: GET
  @Get()
  @MyAuth(MyValidRoles.admin, MyValidRoles.user)
  findAll( @Query() queryParamsDto: QueryParamsDto ) {
    return this.deviceAreasService.findAll(queryParamsDto);
  }
  
  // Update: PATCH
  @Patch(':id')
  @MyAuth(MyValidRoles.admin)
  updateOne(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDeviceAreaDto: UpdateDeviceAreaDto) {
    return this.deviceAreasService.updateOne(id, updateDeviceAreaDto);
  }

  // Delete: DELETE
  @Delete(':id')
  @MyAuth(MyValidRoles.admin)
  deleteOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceAreasService.deleteOne(id);
  }
}
