import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { Booking, BookingStatus } from '../bookings/booking.entity';
import * as Midtrans from 'midtrans-client';

@Injectable()
export class PaymentsService {
  private snap: any;

  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    private config: ConfigService,
  ) {
    this.snap = new Midtrans.Snap({
      isProduction: config.get('MIDTRANS_IS_PRODUCTION') === 'true',
      serverKey: config.get('MIDTRANS_SERVER_KEY'),
      clientKey: config.get('MIDTRANS_CLIENT_KEY'),
    });
  }

  async createPayment(bookingId: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['customer', 'package'],
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const parameter = {
      transaction_details: {
        order_id: booking.bookingCode,
        gross_amount: Math.round(Number(booking.totalPrice)),
      },
      customer_details: {
        first_name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone,
      },
      item_details: [{
        id: booking.packageId,
        price: Math.round(Number(booking.totalPrice) / booking.pax),
        quantity: booking.pax,
        name: booking.package?.name || 'Travel Package',
      }],
    };

    const transaction = await this.snap.createTransaction(parameter);

    let payment = await this.paymentRepo.findOne({ where: { bookingId } });
    if (!payment) {
      payment = this.paymentRepo.create({
        bookingId,
        amount: booking.totalPrice,
        status: PaymentStatus.PENDING,
        snapToken: transaction.token,
        snapUrl: transaction.redirect_url,
      });
    } else {
      payment.snapToken = transaction.token;
      payment.snapUrl = transaction.redirect_url;
    }

    return this.paymentRepo.save(payment);
  }

  async handleWebhook(notification: any) {
    const statusResponse = await this.snap.transaction.notification(notification);
    const { order_id, transaction_status, fraud_status } = statusResponse;

    const booking = await this.bookingRepo.findOne({ where: { bookingCode: order_id } });
    if (!booking) return;

    const payment = await this.paymentRepo.findOne({ where: { bookingId: booking.id } });
    if (!payment) return;

    payment.midtransResponse = statusResponse;
    payment.transactionId = statusResponse.transaction_id;
    payment.method = statusResponse.payment_type;

    if (transaction_status === 'capture' && fraud_status === 'accept') {
      payment.status = PaymentStatus.PAID;
      payment.paidAt = new Date();
      booking.status = BookingStatus.PAID;
    } else if (transaction_status === 'settlement') {
      payment.status = PaymentStatus.PAID;
      payment.paidAt = new Date();
      booking.status = BookingStatus.PAID;
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      payment.status = PaymentStatus.FAILED;
      booking.status = BookingStatus.CANCELLED;
    }

    await this.bookingRepo.save(booking);
    await this.paymentRepo.save(payment);
    return { message: 'OK' };
  }

  findByBooking(bookingId: string) {
    return this.paymentRepo.findOne({ where: { bookingId } });
  }
}
