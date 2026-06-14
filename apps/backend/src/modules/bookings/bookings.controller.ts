import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant, CurrentUser } from '../../common/decorators/tenant.decorator';
import { UserRole } from '../users/user.entity';
import { BookingStatus } from './booking.entity';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private service: BookingsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: any) {
    return this.service.create(user.id, user.tenantId || dto.tenantId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query('status') status?: string) {
    if (user.role === UserRole.CUSTOMER) {
      return this.service.findAll(undefined, user.id, status);
    }
    return this.service.findAll(user.tenantId, undefined, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @UseGuards(RolesGuard)
  @Roles(UserRole.TENANT_ADMIN, UserRole.STAFF, UserRole.SUPER_ADMIN)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: BookingStatus) {
    return this.service.updateStatus(id, status);
  }

  @Put(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.cancel(id, user.id);
  }
}
