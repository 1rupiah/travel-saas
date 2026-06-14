import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private service: PaymentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create/:bookingId')
  createPayment(@Param('bookingId') bookingId: string) {
    return this.service.createPayment(bookingId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('booking/:bookingId')
  findByBooking(@Param('bookingId') bookingId: string) {
    return this.service.findByBooking(bookingId);
  }

  // Midtrans webhook - no auth
  @Post('webhook/midtrans')
  handleWebhook(@Body() notification: any) {
    return this.service.handleWebhook(notification);
  }
}
