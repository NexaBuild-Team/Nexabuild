import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ConstructionService, CreateConstructionProjectDto } from './construction.service';

@Controller('construction')
export class ConstructionController {
  constructor(private readonly constructionService: ConstructionService) {}

  @Get('dashboard')
  getDashboardData() {
    return this.constructionService.getDashboardData();
  }

  @Post('projects')
  createProject(@Body() dto: CreateConstructionProjectDto) {
    return this.constructionService.createProject(dto);
  }

  @Patch('projects/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.constructionService.updateStatus(id, status);
  }

  @Delete('projects/:id')
  deleteProject(@Param('id') id: string) {
    return this.constructionService.deleteProject(id);
  }
}
