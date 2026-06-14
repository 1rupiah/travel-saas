import { Controller, Get, Put, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant, CurrentUser } from '../../common/decorators/tenant.decorator';
import { UserRole } from './user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  findAll(@CurrentTenant() tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Get('me')
  me(@CurrentUser() user: any) { return this.service.findOne(user.id); }

  @Put('me')
  updateMe(@CurrentUser() user: any, @Body() dto: any) {
    return this.service.update(user.id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @Post('staff')
  createStaff(@CurrentTenant() tenantId: string, @Body() dto: any) {
    return this.service.createStaff(tenantId, dto);
  }
}
