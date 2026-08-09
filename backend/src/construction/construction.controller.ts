import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConstructionService, CreateConstructionProjectDto } from './construction.service';
import { QueryConstructionCompanyDto } from './dto/query-construction-company.dto';
import { CreateConstructionCompanyDto } from './dto/create-construction-company.dto';
import { UpdateConstructionCompanyDto } from './dto/update-construction-company.dto';

@Controller('construction')
export class ConstructionController {
  constructor(private readonly svc: ConstructionService) {}

  // ──────────────────────────────────────────────────────────
  // CONTRACTOR DASHBOARD ENDPOINTS
  // ──────────────────────────────────────────────────────────

  @Get('dashboard')
  getDashboardData() {
    return this.svc.getDashboardData();
  }

  @Post('projects')
  createProject(@Body() dto: CreateConstructionProjectDto) {
    return this.svc.createProject(dto);
  }

  @Patch('projects/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.svc.updateStatus(id, status);
  }

  @Delete('projects/:id')
  deleteProject(@Param('id') id: string) {
    return this.svc.deleteProject(id);
  }

  // ──────────────────────────────────────────────────────────
  // COMPANIES
  // ──────────────────────────────────────────────────────────

  /**
   * GET /construction/companies
   * List all construction companies with optional filtering & pagination.
   */
  @Get('companies')
  findAll(@Query() query: QueryConstructionCompanyDto) {
    return this.svc.findAll(query);
  }

  /**
   * GET /construction/companies/:idOrSlug
   * Get a company by UUID or slug (full profile with all relations).
   */
  @Get('companies/:idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.svc.findOne(idOrSlug);
  }

  /**
   * POST /construction/companies
   * Create a new construction company.
   */
  @Post('companies')
  create(@Body() body: CreateConstructionCompanyDto) {
    return this.svc.create(body);
  }

  /**
   * PATCH /construction/companies/:id
   * Update a construction company.
   */
  @Patch('companies/:id')
  update(@Param('id') id: string, @Body() body: UpdateConstructionCompanyDto) {
    return this.svc.update(id, body);
  }

  /**
   * DELETE /construction/companies/:id
   * Soft-deactivate a construction company (sets status to suspended).
   */
  @Delete('companies/:id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }

  // ──────────────────────────────────────────────────────────
  // COMPANY RELATED DATA ENDPOINTS
  // ──────────────────────────────────────────────────────────

  /**
   * GET /construction/companies/:id/story
   */
  @Get('companies/:id/story')
  getStory(@Param('id') id: string) {
    return this.svc.getStory(id);
  }

  /**
   * GET /construction/companies/:id/services
   */
  @Get('companies/:id/services')
  getServices(@Param('id') id: string) {
    return this.svc.getServices(id);
  }

  /**
   * GET /construction/companies/:id/projects
   */
  @Get('companies/:id/projects')
  getProjects(@Param('id') id: string) {
    return this.svc.getProjects(id);
  }

  /**
   * GET /construction/companies/:id/reviews
   */
  @Get('companies/:id/reviews')
  getReviews(@Param('id') id: string) {
    return this.svc.getReviews(id);
  }

  /**
   * GET /construction/companies/:id/contact
   */
  @Get('companies/:id/contact')
  getContact(@Param('id') id: string) {
    return this.svc.getContact(id);
  }

  /**
   * GET /construction/companies/:id/certifications
   */
  @Get('companies/:id/certifications')
  getCertifications(@Param('id') id: string) {
    return this.svc.getCertifications(id);
  }

  /**
   * GET /construction/companies/:id/specializations
   */
  @Get('companies/:id/specializations')
  getSpecializations(@Param('id') id: string) {
    return this.svc.getSpecializations(id);
  }

  /**
   * GET /construction/companies/:id/brochures
   */
  @Get('companies/:id/brochures')
  getBrochures(@Param('id') id: string) {
    return this.svc.getBrochures(id);
  }

  // ──────────────────────────────────────────────────────────
  // DISTRICTS
  // ──────────────────────────────────────────────────────────

  /**
   * GET /construction/districts
   * List all districts.
   */
  @Get('districts')
  getDistricts() {
    return this.svc.getDistricts();
  }

  /**
   * GET /construction/districts/:id/market-insights
   */
  @Get('districts/:id/market-insights')
  getMarketInsightsByDistrict(@Param('id') id: string) {
    return this.svc.getMarketInsightsByDistrict(id);
  }

  // ──────────────────────────────────────────────────────────
  // MARKET INSIGHTS
  // ──────────────────────────────────────────────────────────

  /**
   * GET /construction/market-insights
   * Get all market insights (optionally filtered by districtId).
   */
  @Get('market-insights')
  getMarketInsights(@Query('districtId') districtId?: string) {
    return this.svc.getMarketInsights(districtId);
  }

  // ──────────────────────────────────────────────────────────
  // SPECIALIZATIONS & CERTIFICATIONS (reference data)
  // ──────────────────────────────────────────────────────────

  /**
   * GET /construction/specializations
   */
  @Get('specializations')
  getAllSpecializations() {
    return this.svc.getAllSpecializations();
  }

  /**
   * GET /construction/certifications
   */
  @Get('certifications')
  getAllCertifications() {
    return this.svc.getAllCertifications();
  }
}

