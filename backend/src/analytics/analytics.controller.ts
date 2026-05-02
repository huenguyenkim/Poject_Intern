import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/auth/jwt-auth.guard';
import { Roles } from '../infrastructure/auth/roles.decorator';
import { UserRole } from '../common/constants/user-role.enum';

@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Public endpoint - called by frontend App.jsx on app load
  @Post('visit')
  recordVisit(@Body() body: { sessionId: string }) {
    return this.analyticsService.recordVisit(body.sessionId || 'anonymous');
  }

  @Get('kpis')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getKpis(@Query('days') days?: string) {
    return this.analyticsService.getKpis(days ? parseInt(days, 10) : 180);
  }

  @Get('revenue-chart')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getRevenueChart(@Query('days') days?: string) {
    return this.analyticsService.getRevenueChart(days ? parseInt(days, 10) : 180);
  }

  @Get('forecast')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getForecast() {
    return this.analyticsService.getForecast();
  }

  @Get('bundled-products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getBundledProducts() {
    return this.analyticsService.getBundledProducts();
  }

  @Get('top-products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getTopProducts() {
    return this.analyticsService.getTopProducts();
  }
}
