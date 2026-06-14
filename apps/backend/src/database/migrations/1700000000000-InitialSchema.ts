import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "slug" varchar NOT NULL UNIQUE,
        "name" varchar NOT NULL,
        "logo" varchar,
        "address" varchar,
        "phone" varchar,
        "email" varchar NOT NULL UNIQUE,
        "isActive" boolean NOT NULL DEFAULT true,
        "settings" jsonb,
        "paymentConfig" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tenants" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "users_role_enum" AS ENUM ('super_admin','tenant_admin','staff','customer');
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "email" varchar NOT NULL UNIQUE,
        "password" varchar NOT NULL,
        "role" "users_role_enum" NOT NULL DEFAULT 'customer',
        "phone" varchar,
        "avatar" varchar,
        "isActive" boolean NOT NULL DEFAULT true,
        "tenant_id" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "FK_users_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "packages_type_enum" AS ENUM ('tour','hotel','flight','combined');
      CREATE TABLE "travel_packages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "name" varchar NOT NULL,
        "description" text NOT NULL,
        "type" "packages_type_enum" NOT NULL DEFAULT 'tour',
        "destination" varchar NOT NULL,
        "basePrice" decimal(12,2) NOT NULL,
        "discountPrice" decimal(12,2),
        "durationDays" int NOT NULL DEFAULT 1,
        "minPax" int NOT NULL DEFAULT 1,
        "maxPax" int,
        "itinerary" jsonb,
        "includes" jsonb,
        "excludes" jsonb,
        "images" jsonb,
        "isActive" boolean NOT NULL DEFAULT true,
        "isFeatured" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_packages" PRIMARY KEY ("id"),
        CONSTRAINT "FK_packages_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "bookings_status_enum" AS ENUM ('pending','confirmed','paid','ongoing','completed','cancelled');
      CREATE TABLE "bookings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingCode" varchar NOT NULL UNIQUE,
        "tenant_id" uuid NOT NULL,
        "customer_id" uuid NOT NULL,
        "package_id" uuid NOT NULL,
        "travelDate" date NOT NULL,
        "pax" int NOT NULL DEFAULT 1,
        "totalPrice" decimal(12,2) NOT NULL,
        "status" "bookings_status_enum" NOT NULL DEFAULT 'pending',
        "passengerDetails" jsonb,
        "specialRequest" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bookings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_bookings_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id"),
        CONSTRAINT "FK_bookings_customer" FOREIGN KEY ("customer_id") REFERENCES "users"("id"),
        CONSTRAINT "FK_bookings_package" FOREIGN KEY ("package_id") REFERENCES "travel_packages"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "payments_status_enum" AS ENUM ('pending','paid','failed','refunded');
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "booking_id" uuid NOT NULL UNIQUE,
        "amount" decimal(12,2) NOT NULL,
        "status" "payments_status_enum" NOT NULL DEFAULT 'pending',
        "method" varchar,
        "transactionId" varchar,
        "snapToken" varchar,
        "snapUrl" varchar,
        "midtransResponse" jsonb,
        "paidAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_payments_booking" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id")
      )
    `);

    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bookings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "travel_packages"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tenants"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payments_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "bookings_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "packages_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum"`);
  }
}
