import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  AgentService,
  CreatePropertyDto,
  CreateAgentDto,
  UpdateAgentDto,
} from './agent.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  // ============================================================
  // AGENT CRUD
  // ============================================================

  @Get()
  async getAllAgents() {
    return this.agentService.getAllAgents();
  }

  @Get(':id')
  async getAgentById(@Param('id') id: string) {
    return this.agentService.getAgentById(id);
  }

  @Post()
  async createAgent(@Body() dto: CreateAgentDto) {
    return this.agentService.createAgent(dto);
  }

  @Patch(':id')
  async updateAgent(
    @Param('id') id: string,
    @Body() dto: UpdateAgentDto,
  ) {
    return this.agentService.updateAgent(id, dto);
  }

  @Delete(':id')
  async deleteAgent(@Param('id') id: string) {
    return this.agentService.deleteAgent(id);
  }

  // ============================================================
  // EXISTING AGENT DASHBOARD
  // ============================================================

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboard(@Request() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.agentService.getDashboardData(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('listings/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('type') type: 'PROPERTY' | 'LAND',
    @Body('status') status: string,
  ) {
    return this.agentService.updateStatus(
      id,
      type || 'PROPERTY',
      status,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('listings/:id')
  async deleteListing(
    @Param('id') id: string,
    @Query('type') type: 'PROPERTY' | 'LAND',
  ) {
    return this.agentService.deleteListing(
      id,
      type || 'PROPERTY',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('properties')
  async createProperty(
    @Request() req: any,
    @Body() dto: CreatePropertyDto,
  ) {
    const userId = req.user?.id || req.user?.userId;
    return this.agentService.createProperty(userId, dto);
  }
}
