import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboardData() {
    return this.adminService.getDashboardData();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Get('properties')
  getProperties() {
    return this.adminService.getProperties();
  }

  @Get('analytics')
  getAnalyticsData() {
    return this.adminService.getAnalyticsData();
  }

  @Patch('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.adminService.updateUser(id, data);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
