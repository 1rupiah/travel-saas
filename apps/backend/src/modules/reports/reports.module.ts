import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Booking } from '../bookings/booking.entity';
import { Payment } from '../payments/payment.entity';
import { TravelPackage } from '../packages/package.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Payment, TravelPackage, User])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
