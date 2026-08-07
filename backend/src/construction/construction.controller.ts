import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ConstructionService } from './construction.service';
import { CreateConstructionCompanyDto } from './dto/create-construction-company.dto';
import { UpdateConstructionCompanyDto } from './dto/update-construction-company.dto';
import { QueryConstructionCompanyDto } from './dto/query-construction-company.dto';

@Controller('construction')
export class ConstructionController {
  constructor(private readonly svc: ConstructionService) {}

  @Get('companies')
  findAll(@Query() query: QueryConstructionCompanyDto) {
    return this.svc.findCompanies(query);
  }

  @Get('companies/top-rated')
  topRated(@Query('limit') limit?: string) {
    const l = limit ? parseInt(limit, 10) : 5;
    return this.svc.findTopRated(l);
  }

  @Get('companies/:id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post('companies')
  createCompany(@Body() dto: CreateConstructionCompanyDto) {
    return this.svc.createCompany(dto);
  }

  @Patch('companies/:id')
  updateCompany(@Param('id') id: string, @Body() dto: UpdateConstructionCompanyDto) {
    return this.svc.updateCompany(id, dto);
  }

  @Delete('companies/:id')
  deleteCompany(@Param('id') id: string) {
    return this.svc.deleteCompany(id);
  }

  // Projects
  @Get('companies/:companyId/projects')
  getProjects(@Param('companyId') companyId: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.findProjects(companyId, { page: page ? parseInt(page, 10) : 1, limit: limit ? parseInt(limit, 10) : 10 });
  }

  @Post('companies/:companyId/projects')
  createProject(@Param('companyId') companyId: string, @Body() body: any) {
    return this.svc.createProject(companyId, body);
  }

  @Get('projects/:id')
  getProject(@Param('id') id: string) {
    return this.svc.getProject(id);
  }

  @Patch('projects/:id')
  updateProject(@Param('id') id: string, @Body() body: any) {
    return this.svc.updateProject(id, body);
  }

  @Delete('projects/:id')
  deleteProject(@Param('id') id: string) {
    return this.svc.deleteProject(id);
  }

  // Reviews
  @Get('companies/:companyId/reviews')
  getReviews(@Param('companyId') companyId: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.findReviews(companyId, { page: page ? parseInt(page, 10) : 1, limit: limit ? parseInt(limit, 10) : 20 });
  }

  @Post('companies/:companyId/reviews')
  createReview(@Param('companyId') companyId: string, @Body() body: any) {
    return this.svc.createReview(companyId, body);
  }

  @Patch('reviews/:id')
  updateReview(@Param('id') id: string, @Body() body: any) {
    return this.svc.updateReview(id, body);
  }

  @Delete('reviews/:id')
  deleteReview(@Param('id') id: string) {
    return this.svc.deleteReview(id);
  }
}
