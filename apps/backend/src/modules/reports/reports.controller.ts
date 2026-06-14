import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
@Controller('reports')
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Get('dashboard')
  getDashboardStats(@CurrentTenant() tenantId: string) {
    return this.service.getDashboardStats(tenantId);
  }

  @Get('monthly-revenue')
  getMonthlyRevenue(@CurrentTenant() tenantId: string, @Query('year') year: string) {
    return this.service.getMonthlyRevenue(tenantId, parseInt(year) || new Date().getFullYear());
  }

  @Get('top-packages')
  getTopPackages(@CurrentTenant() tenantId: string) {
    return this.service.getTopPackages(tenantId);
  }

  @Get('bookings-by-status')
  getBookingsByStatus(@CurrentTenant() tenantId: string) {
    return this.service.getBookingsByStatus(tenantId);
  }
}
