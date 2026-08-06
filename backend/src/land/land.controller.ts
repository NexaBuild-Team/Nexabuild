import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { LandService } from './land.service';

@Controller('land')
export class LandController {
    constructor(private readonly service: LandService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Post()
    create(@Body() data: any) {
        return this.service.create(data);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.service.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}