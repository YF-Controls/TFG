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

  constructor(private readonly deviceTypesService: DeviceTypesService) {}

  // CRUD Methods
  // POST: Create
  @Post()
  @MyAuth(MyValidRoles.admin)
  createOne(@Body() createDeviceTypeDto: CreateDeviceTypeDto) {
    return this.deviceTypesService.createOne(createDeviceTypeDto);
  }

  // GET: Read
  @Get()
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  findAll( @Query() queryParamsDto:QueryParamsDto ) {
    return this.deviceTypesService.findAll(queryParamsDto);
  }

  // GET: Read
  @Get(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() queryParamsDto: QueryParamsDto) {
    return this.deviceTypesService.findOne(id, queryParamsDto);
  }

  // PATCH: Update
  @Patch(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user, MyValidRoles.guest)
  updateOne(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDeviceTypeDto: UpdateDeviceTypeDto) {
    return this.deviceTypesService.updateOne(id, updateDeviceTypeDto);
  }

  // DELETE: Delete
  @Delete(':id')
  //@MyAuth(MyValidRoles.admin, MyValidRoles.user)
  deleteOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceTypesService.deleteOne(id);
  }

}
