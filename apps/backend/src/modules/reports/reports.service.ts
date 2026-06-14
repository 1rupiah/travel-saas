import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../bookings/booking.entity';
import { Payment, PaymentStatus } from '../payments/payment.entity';
import { TravelPackage } from '../packages/package.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(TravelPackage) private packageRepo: Repository<TravelPackage>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getDashboardStats(tenantId: string) {
    const [
      totalBookings,
      confirmedBookings,
      totalRevenue,
      totalPackages,
      totalCustomers,
    ] = await Promise.all([
      this.bookingRepo.count({ where: { tenantId } }),
      this.bookingRepo.count({ where: { tenantId, status: BookingStatus.PAID } }),
      this.bookingRepo
        .createQueryBuilder('b')
        .select('SUM(b.totalPrice)', 'total')
        .where('b.tenantId = :tenantId AND b.status IN (:...statuses)', {
          tenantId,
          statuses: [BookingStatus.PAID, BookingStatus.COMPLETED],
        })
        .getRawOne(),
      this.packageRepo.count({ where: { tenantId, isActive: true } }),
      this.userRepo.count({ where: { tenantId } }),
    ]);

    return {
      totalBookings,
      confirmedBookings,
      totalRevenue: totalRevenue?.total || 0,
      totalPackages,
      totalCustomers,
    };
  }

  async getMonthlyRevenue(tenantId: string, year: number) {
    const result = await this.bookingRepo
      .createQueryBuilder('b')
      .select("DATE_TRUNC('month', b.createdAt)", 'month')
      .addSelect('SUM(b.totalPrice)', 'revenue')
      .addSelect('COUNT(*)', 'bookings')
      .where('b.tenantId = :tenantId AND EXTRACT(YEAR FROM b.createdAt) = :year AND b.status IN (:...statuses)', {
        tenantId,
        year,
        statuses: [BookingStatus.PAID, BookingStatus.COMPLETED],
      })
      .groupBy("DATE_TRUNC('month', b.createdAt)")
      .orderBy('month', 'ASC')
      .getRawMany();

    return result;
  }

  async getTopPackages(tenantId: string, limit = 5) {
    return this.bookingRepo
      .createQueryBuilder('b')
      .select('b.packageId', 'packageId')
      .addSelect('p.name', 'packageName')
      .addSelect('COUNT(*)', 'bookingCount')
      .addSelect('SUM(b.totalPrice)', 'revenue')
      .leftJoin('b.package', 'p')
      .where('b.tenantId = :tenantId', { tenantId })
      .groupBy('b.packageId')
      .addGroupBy('p.name')
      .orderBy('"bookingCount"', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getBookingsByStatus(tenantId: string) {
    return this.bookingRepo
      .createQueryBuilder('b')
      .select('b.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('b.tenantId = :tenantId', { tenantId })
      .groupBy('b.status')
      .getRawMany();
  }
}
