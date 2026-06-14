import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

// Manually find and parse .env file
function loadEnv() {
  const locations = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '../../.env'),
    path.join(process.cwd(), '../../../.env'),
  ];
  for (const loc of locations) {
    if (fs.existsSync(loc)) {
      const content = fs.readFileSync(loc, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
      console.log(`Loaded .env from: ${loc}`);
      break;
    }
  }
}

loadEnv();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'travel_saas',
  entities: [
    path.join(process.cwd(), 'src/**/*.entity.ts'),
    path.join(process.cwd(), 'src/**/*.entity.js'),
  ],
  synchronize: true,
  logging: false,
});

async function setup() {
  console.log(`Connecting to DB: ${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME} as ${process.env.DATABASE_USER}`);

  await AppDataSource.initialize();
  console.log('Connected. Tables synced.');

  const tenantRepo = AppDataSource.getRepository('Tenant');
  const userRepo = AppDataSource.getRepository('User');
  const packageRepo = AppDataSource.getRepository('TravelPackage');

  const existingTenant = await tenantRepo.findOne({ where: { slug: 'demo-travel' } });
  if (existingTenant) {
    console.log('Already seeded. Skipping.');
    await AppDataSource.destroy();
    return;
  }

  console.log('Seeding data...');

  const tenant = tenantRepo.create({
    slug: 'demo-travel',
    name: 'Demo Travel Agency',
    email: 'admin@demo-travel.com',
    phone: '08123456789',
    address: 'Jakarta, Indonesia',
  });
  const savedTenant = await tenantRepo.save(tenant);

  await userRepo.save(userRepo.create({
    name: 'Super Admin',
    email: 'superadmin@travelsaas.com',
    password: await bcrypt.hash('superadmin123', 12),
    role: 'super_admin',
  }));

  await userRepo.save(userRepo.create({
    name: 'Tenant Admin',
    email: 'admin@demo-travel.com',
    password: await bcrypt.hash('admin123', 12),
    role: 'tenant_admin',
    tenantId: savedTenant.id,
  }));

  await packageRepo.save(packageRepo.create({
    tenantId: savedTenant.id,
    name: 'Bali Paradise 4D3N',
    description: 'Jelajahi keindahan Bali dengan itinerary lengkap termasuk Tanah Lot, Ubud, dan Seminyak.',
    type: 'tour',
    destination: 'Bali',
    basePrice: 3500000,
    discountPrice: 2999000,
    durationDays: 4,
    minPax: 2,
    maxPax: 15,
    includes: ['Hotel bintang 3', 'Transport AC', 'Guide lokal', 'Makan 3x', 'Tiket masuk objek wisata'],
    excludes: ['Tiket pesawat', 'Pengeluaran pribadi', 'Tips guide'],
    itinerary: [
      { day: 1, title: 'Arrival & Tanah Lot', activities: ['Jemput bandara', 'Check-in hotel', 'Sunset Tanah Lot'] },
      { day: 2, title: 'Ubud Day Tour', activities: ['Monkey Forest', 'Tegalalang Rice Terrace', 'Pasar Ubud'] },
      { day: 3, title: 'Kuta & Seminyak', activities: ['Pantai Kuta', 'Shopping Seminyak', 'Sunset dinner'] },
      { day: 4, title: 'Departure', activities: ['Check-out hotel', 'Antar bandara'] },
    ],
    isFeatured: true,
    isActive: true,
  }));

  await packageRepo.save(packageRepo.create({
    tenantId: savedTenant.id,
    name: 'Lombok & Gili Islands 5D4N',
    description: 'Eksplorasi keindahan Lombok dan Gili Islands yang menawan.',
    type: 'tour',
    destination: 'Lombok',
    basePrice: 4200000,
    durationDays: 5,
    minPax: 2,
    maxPax: 12,
    includes: ['Hotel bintang 3', 'Fast boat Gili', 'Snorkeling', 'Guide lokal', 'Makan 3x'],
    excludes: ['Tiket pesawat', 'Pengeluaran pribadi'],
    isFeatured: true,
    isActive: true,
  }));

  await packageRepo.save(packageRepo.create({
    tenantId: savedTenant.id,
    name: 'Raja Ampat Adventure 7D6N',
    description: 'Petualangan menyelam di surga bawah laut Raja Ampat, Papua Barat.',
    type: 'tour',
    destination: 'Raja Ampat',
    basePrice: 12000000,
    durationDays: 7,
    minPax: 4,
    maxPax: 8,
    includes: ['Penginapan eco-lodge', 'Speedboat', 'Diving 3x', 'Snorkeling', 'Makan 3x'],
    excludes: ['Tiket pesawat', 'Equipment diving pribadi'],
    isFeatured: true,
    isActive: true,
  }));

  console.log('');
  console.log('Setup complete!');
  console.log('Super Admin : superadmin@travelsaas.com / superadmin123');
  console.log('Tenant Admin: admin@demo-travel.com / admin123');

  await AppDataSource.destroy();
}

setup().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
