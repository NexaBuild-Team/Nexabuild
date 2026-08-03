import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PropertyService } from './property.service';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.propertyService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.propertyService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}