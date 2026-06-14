import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { TravelPackage } from '../packages/package.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private repo: Repository<Booking>,
    @InjectRepository(TravelPackage) private packageRepo: Repository<TravelPackage>,
  ) {}

  private generateCode(): string {
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `TRV-${year}-${rand}`;
  }

  async create(customerId: string, tenantId: string, dto: any) {
    const pkg = await this.packageRepo.findOne({ where: { id: dto.packageId } });
    if (!pkg) throw new NotFoundException('Package not found');

    const price = pkg.discountPrice || pkg.basePrice;
    const total = Number(price) * dto.pax;

    const booking = this.repo.create({
      bookingCode: this.generateCode(),
      customerId,
      tenantId,
      packageId: dto.packageId,
      travelDate: dto.travelDate,
      pax: dto.pax,
      totalPrice: total,
      passengerDetails: dto.passengerDetails,
      specialRequest: dto.specialRequest,
      status: BookingStatus.PENDING,
    });

    return this.repo.save(booking);
  }

  findAll(tenantId?: string, customerId?: string, status?: string) {
    const query = this.repo.createQueryBuilder('b')
      .leftJoinAndSelect('b.package', 'package')
      .leftJoinAndSelect('b.customer', 'customer');

    if (tenantId) query.andWhere('b.tenantId = :tenantId', { tenantId });
    if (customerId) query.andWhere('b.customerId = :customerId', { customerId });
    if (status) query.andWhere('b.status = :status', { status });

    return query.orderBy('b.createdAt', 'DESC').getMany();
  }

  async findOne(id: string) {
    const b = await this.repo.findOne({
      where: { id },
      relations: ['package', 'customer', 'payment'],
    });
    if (!b) throw new NotFoundException('Booking not found');
    return b;
  }

  async updateStatus(id: string, status: BookingStatus) {
    await this.repo.update(id, { status });
    return this.findOne(id);
  }

  async cancel(id: string, customerId: string) {
    const b = await this.findOne(id);
    if (b.customerId !== customerId) throw new BadRequestException('Not your booking');
    if ([BookingStatus.COMPLETED, BookingStatus.ONGOING].includes(b.status)) {
      throw new BadRequestException('Cannot cancel this booking');
    }
    return this.updateStatus(id, BookingStatus.CANCELLED);
  }
}
