import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

export enum PackageType {
  TOUR = 'tour',
  HOTEL = 'hotel',
  FLIGHT = 'flight',
  COMBINED = 'combined',
}

@Entity('travel_packages')
export class TravelPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: PackageType, default: PackageType.TOUR })
  type: PackageType;

  @Column()
  destination: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  basePrice: number;

  @Column({ nullable: true, type: 'decimal', precision: 12, scale: 2 })
  discountPrice: number;

  @Column({ default: 1 })
  durationDays: number;

  @Column({ default: 1 })
  minPax: number;

  @Column({ nullable: true })
  maxPax: number;

  @Column({ type: 'jsonb', nullable: true })
  itinerary: any[];

  @Column({ type: 'jsonb', nullable: true })
  includes: string[];

  @Column({ type: 'jsonb', nullable: true })
  excludes: string[];

  @Column({ type: 'jsonb', nullable: true })
  images: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
