import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateBookingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'BK';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function seed() {
  await AppDataSource.initialize();
  console.log('🌱 Seeding database...');

  const tenantRepo = AppDataSource.getRepository('Tenant');
  const userRepo = AppDataSource.getRepository('User');
  const packageRepo = AppDataSource.getRepository('TravelPackage');
  const bookingRepo = AppDataSource.getRepository('Booking');
  const paymentRepo = AppDataSource.getRepository('Payment');

  // ── CLEAR existing data (order matters for FK) ──
  await paymentRepo.query('DELETE FROM payments');
  await bookingRepo.query('DELETE FROM bookings');
  await packageRepo.query('DELETE FROM travel_packages');
  await userRepo.query('DELETE FROM users');
  await tenantRepo.query('DELETE FROM tenants');
  console.log('🧹 Cleared existing data');

  // ── TENANT ──
  const tenant = tenantRepo.create({
    slug: 'demo-travel',
    name: 'Demo Travel Agency',
    email: 'admin@demo-travel.com',
    phone: '08123456789',
    address: 'Jl. Sudirman No.1, Jakarta Pusat',
    isActive: true,
    settings: { currency: 'IDR', language: 'id' },
  });
  const savedTenant = await tenantRepo.save(tenant);
  console.log('✅ Tenant created');

  // ── USERS ──
  const hashedAdmin123 = await bcrypt.hash('admin123', 12);
  const hashedCustomer = await bcrypt.hash('customer123', 12);
  const hashedSuper = await bcrypt.hash('superadmin123', 12);

  await userRepo.save(userRepo.create({
    name: 'Super Admin',
    email: 'superadmin@travelsaas.com',
    password: hashedSuper,
    role: 'super_admin',
    isActive: true,
  }));

  const tenantAdmin = await userRepo.save(userRepo.create({
    name: 'Tenant Admin',
    email: 'admin@demo-travel.com',
    password: hashedAdmin123,
    role: 'tenant_admin',
    tenantId: savedTenant.id,
    phone: '08111000001',
    isActive: true,
  }));

  const customerNames = [
    { name: 'Budi Santoso',    email: 'budi.santoso@gmail.com',    phone: '08112345001' },
    { name: 'Siti Rahayu',     email: 'siti.rahayu@gmail.com',     phone: '08112345002' },
    { name: 'Ahmad Fauzi',     email: 'ahmad.fauzi@yahoo.com',     phone: '08112345003' },
    { name: 'Dewi Kusuma',     email: 'dewi.kusuma@gmail.com',     phone: '08112345004' },
    { name: 'Rizky Pratama',   email: 'rizky.pratama@gmail.com',   phone: '08112345005' },
    { name: 'Maya Anggraini',  email: 'maya.anggraini@gmail.com',  phone: '08112345006' },
    { name: 'Hendra Wijaya',   email: 'hendra.wijaya@gmail.com',   phone: '08112345007' },
    { name: 'Fitri Handayani', email: 'fitri.handayani@gmail.com', phone: '08112345008' },
    { name: 'Doni Kurniawan',  email: 'doni.kurniawan@gmail.com',  phone: '08112345009' },
    { name: 'Rina Susanti',    email: 'rina.susanti@gmail.com',    phone: '08112345010' },
    { name: 'Fajar Nugroho',   email: 'fajar.nugroho@gmail.com',   phone: '08112345011' },
    { name: 'Linda Permata',   email: 'linda.permata@gmail.com',   phone: '08112345012' },
    { name: 'Agus Setiawan',   email: 'agus.setiawan@gmail.com',   phone: '08112345013' },
    { name: 'Nita Octavia',    email: 'nita.octavia@gmail.com',    phone: '08112345014' },
    { name: 'Bagas Trianto',   email: 'bagas.trianto@gmail.com',   phone: '08112345015' },
  ];

  const customers = [];
  for (const c of customerNames) {
    const u = await userRepo.save(userRepo.create({
      ...c,
      password: hashedCustomer,
      role: 'customer',
      tenantId: savedTenant.id,
      isActive: true,
    }));
    customers.push(u);
  }
  console.log(`✅ ${customers.length} customers created`);

  // ── PACKAGES ──
  const packagesData = [
    {
      name: 'Bali Paradise 4D3N',
      description: 'Jelajahi keindahan Bali dengan itinerary lengkap termasuk Tanah Lot, Ubud, dan Seminyak. Nikmati budaya lokal, kuliner khas, dan pemandangan alam yang memukau.',
      type: 'tour',
      destination: 'Bali',
      basePrice: 3500000,
      discountPrice: 2999000,
      durationDays: 4,
      minPax: 2,
      maxPax: 15,
      includes: ['Hotel bintang 3', 'Transport AC', 'Guide lokal berpengalaman', 'Makan 3x sehari', 'Tiket masuk semua objek wisata', 'Asuransi perjalanan'],
      excludes: ['Tiket pesawat PP', 'Pengeluaran pribadi', 'Tips guide & driver', 'Minuman di restoran'],
      itinerary: [
        { day: 1, title: 'Arrival & Tanah Lot', activities: ['Jemput bandara Ngurah Rai', 'Check-in hotel Kuta', 'Makan siang di resto lokal', 'Sunset di Tanah Lot', 'Makan malam di Seminyak'] },
        { day: 2, title: 'Ubud Day Tour', activities: ['Sarapan hotel', 'Monkey Forest Ubud', 'Tegalalang Rice Terrace', 'Lunch di Ubud', 'Pasar Seni Ubud', 'Kecak Dance di Uluwatu'] },
        { day: 3, title: 'Kuta & Seminyak', activities: ['Sarapan hotel', 'Pantai Kuta', 'Water Bomb Waterpark (optional)', 'Shopping Seminyak', 'Sunset dinner di Jimbaran'] },
        { day: 4, title: 'Departure', activities: ['Sarapan hotel', 'Check-out', 'City tour singkat', 'Antar ke bandara'] },
      ],
      images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Lombok & Gili Islands 5D4N',
      description: 'Eksplorasi keindahan Lombok dan Gili Islands yang menawan. Snorkeling di air kristal, bersantai di pantai putih, dan menikmati sunset terbaik di Indonesia.',
      type: 'tour',
      destination: 'Lombok',
      basePrice: 4200000,
      discountPrice: 3800000,
      durationDays: 5,
      minPax: 2,
      maxPax: 12,
      includes: ['Hotel bintang 3 Lombok', 'Penginapan Gili Trawangan', 'Fast boat Lombok-Gili', 'Snorkeling equipment', 'Guide lokal', 'Makan 3x sehari'],
      excludes: ['Tiket pesawat PP', 'Pengeluaran pribadi', 'Tips'],
      itinerary: [
        { day: 1, title: 'Arrival Lombok', activities: ['Jemput bandara', 'Check-in hotel Mataram', 'City tour Mataram', 'Makan malam'] },
        { day: 2, title: 'Gili Trawangan', activities: ['Fast boat ke Gili Trawangan', 'Check-in penginapan', 'Snorkeling', 'Sunset di pantai'] },
        { day: 3, title: 'Explore Gili', activities: ['Keliling pulau naik sepeda', 'Snorkeling spot terbaik', 'Free time di pantai'] },
        { day: 4, title: 'Kembali ke Lombok', activities: ['Fast boat balik Lombok', 'Gunung Rinjani view point', 'Pantai Senggigi'] },
        { day: 5, title: 'Departure', activities: ['Sarapan', 'Check-out', 'Antar bandara'] },
      ],
      images: ['https://images.unsplash.com/photo-1573790387438-4da905039392?w=800'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Raja Ampat Adventure 7D6N',
      description: 'Petualangan menyelam di surga bawah laut Raja Ampat, Papua Barat. Destinasi diving terbaik di dunia dengan keanekaragaman hayati laut yang luar biasa.',
      type: 'tour',
      destination: 'Raja Ampat',
      basePrice: 12000000,
      durationDays: 7,
      minPax: 4,
      maxPax: 8,
      includes: ['Penginapan eco-lodge 6 malam', 'Speedboat sewa private', 'Diving 3x per hari', 'Snorkeling equipment', 'Makan 3x sehari', 'Airport transfer Sorong'],
      excludes: ['Tiket pesawat ke Sorong', 'Equipment diving pribadi', 'Marine park fee', 'Pengeluaran pribadi'],
      itinerary: [
        { day: 1, title: 'Sorong - Raja Ampat', activities: ['Jemput bandara Sorong', 'Speedboat ke eco-lodge', 'Orientasi diving'] },
        { day: 2, title: 'Dive Day 1', activities: ['Dive spot Wayag', 'Snorkeling terumbu karang', 'Sunset photo'] },
        { day: 3, title: 'Wayag Islands', activities: ['Trekking Wayag viewpoint', 'Diving Cape Kri', 'Manta Ray watching'] },
        { day: 4, title: 'Dive Day 3', activities: ['Diving Misool', 'Eksplorasi pulau kecil', 'Night snorkeling'] },
        { day: 5, title: 'Free Exploration', activities: ['Kayaking', 'Bird watching cenderawasih', 'Relaksasi'] },
        { day: 6, title: 'Last Dive', activities: ['Dive spot terbaik pilihan', 'Persiapan departure', 'Farewell dinner'] },
        { day: 7, title: 'Departure', activities: ['Speedboat ke Sorong', 'Antar ke bandara'] },
      ],
      images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Yogyakarta Heritage 3D2N',
      description: 'Tour budaya ke Yogyakarta, kota pelajar penuh sejarah. Kunjungi Borobudur, Prambanan, Keraton, dan nikmati kuliner khas Jogja yang autentik.',
      type: 'tour',
      destination: 'Yogyakarta',
      basePrice: 1800000,
      discountPrice: 1500000,
      durationDays: 3,
      minPax: 2,
      maxPax: 20,
      includes: ['Hotel bintang 3 Malioboro', 'Transport minivan', 'Guide', 'Makan 2x sehari', 'Tiket masuk Borobudur & Prambanan'],
      excludes: ['Tiket kereta/pesawat', 'Pengeluaran pribadi', 'Makan malam'],
      itinerary: [
        { day: 1, title: 'Arrival & City Tour', activities: ['Jemput stasiun/bandara', 'Keraton Yogyakarta', 'Malioboro shopping', 'Makan malam lesehan'] },
        { day: 2, title: 'Borobudur & Prambanan', activities: ['Sunrise Borobudur', 'Lunch di restoran lokal', 'Prambanan temple', 'Sendratari Ramayana (malam)'] },
        { day: 3, title: 'Departure', activities: ['Sarapan', 'Pantai Parangtritis (optional)', 'Antar ke stasiun/bandara'] },
      ],
      images: ['https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800'],
      isFeatured: false,
      isActive: true,
    },
    {
      name: 'Labuan Bajo & Komodo 4D3N',
      description: 'Jelajahi taman nasional Komodo, bertemu komodo di habitat aslinya, snorkeling di spot terbaik, dan menikmati Pink Beach yang memesona.',
      type: 'tour',
      destination: 'Labuan Bajo',
      basePrice: 6500000,
      discountPrice: 5900000,
      durationDays: 4,
      minPax: 2,
      maxPax: 10,
      includes: ['Hotel/liveaboard', 'Boat private 3 hari', 'Guide ranger komodo', 'Snorkeling equipment', 'Makan 3x sehari', 'Tiket Taman Nasional Komodo'],
      excludes: ['Tiket pesawat', 'Pengeluaran pribadi', 'Tips'],
      itinerary: [
        { day: 1, title: 'Arrival Labuan Bajo', activities: ['Jemput bandara', 'Check-in hotel', 'Sunset di Bukit Cinta'] },
        { day: 2, title: 'Komodo Island', activities: ['Trekking Pulau Komodo', 'Melihat komodo', 'Snorkeling Manta Point', 'Pink Beach'] },
        { day: 3, title: 'Rinca & Padar', activities: ['Trekking Pulau Rinca', 'Foto iconic Padar Island', 'Snorkeling Gili Lawa'] },
        { day: 4, title: 'Departure', activities: ['Sarapan', 'Pasar lokal', 'Antar bandara'] },
      ],
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Danau Toba & Samosir 4D3N',
      description: 'Eksplorasi keindahan Danau Toba, danau vulkanik terbesar di dunia. Nikmati budaya Batak, alam pegunungan, dan ketenangan Pulau Samosir.',
      type: 'tour',
      destination: 'Sumatera Utara',
      basePrice: 2800000,
      durationDays: 4,
      minPax: 2,
      maxPax: 15,
      includes: ['Hotel Parapat & Samosir', 'Ferry Samosir', 'Guide lokal', 'Makan 3x sehari', 'Transport'],
      excludes: ['Tiket pesawat ke Medan', 'Pengeluaran pribadi'],
      itinerary: [
        { day: 1, title: 'Medan - Parapat', activities: ['Jemput bandara Kuala Namu', 'Perjalanan ke Parapat', 'Makan malam ikan bakar Toba'] },
        { day: 2, title: 'Pulau Samosir', activities: ['Ferry ke Samosir', 'Desa Tomok', 'Makam Raja Sidabutar', 'Cultural show'] },
        { day: 3, title: 'Explore Samosir', activities: ['Keliling pulau', 'Air Panas Pangururan', 'Batu Gantung', 'Sunset di tepian danau'] },
        { day: 4, title: 'Departure', activities: ['Sarapan', 'Ferry balik', 'Antar bandara Medan'] },
      ],
      isFeatured: false,
      isActive: true,
    },
  ];

  const savedPackages = [];
  for (const pkg of packagesData) {
    const saved = await packageRepo.save(packageRepo.create({ ...pkg, tenantId: savedTenant.id }));
    savedPackages.push(saved);
  }
  console.log(`✅ ${savedPackages.length} packages created`);

  // ── BOOKINGS & PAYMENTS ──
  // Generate realistic bookings spread across 2025-2026
  const bookingStatusFlow = [
    { status: 'completed', payStatus: 'paid', weight: 35 },
    { status: 'paid',      payStatus: 'paid', weight: 20 },
    { status: 'confirmed', payStatus: 'paid', weight: 15 },
    { status: 'pending',   payStatus: 'pending', weight: 15 },
    { status: 'ongoing',   payStatus: 'paid', weight: 10 },
    { status: 'cancelled', payStatus: 'failed', weight: 5 },
  ];

  const paymentMethods = ['bank_transfer', 'credit_card', 'gopay', 'ovo', 'qris'];
  const specialRequests = [
    'Mohon kamar di lantai atas', 'Vegetarian meal', 'Honeymoon setup requested',
    'Family with toddler, butuh high chair', 'Allergic to seafood',
    null, null, null, // most don't have special request
  ];

  const startDate = new Date('2025-01-01');
  const endDate = new Date('2026-06-10');
  const usedCodes = new Set<string>();

  let bookingCount = 0;

  // Create ~60 bookings spread across the period
  for (let i = 0; i < 60; i++) {
    const customer = customers[randomBetween(0, customers.length - 1)];
    const pkg = savedPackages[randomBetween(0, savedPackages.length - 1)];
    const pax = randomBetween(pkg.minPax || 1, Math.min(pkg.maxPax || 10, 6));
    const price = (pkg.discountPrice || pkg.basePrice) * pax;
    const createdAt = randomDate(startDate, endDate);
    const travelDate = new Date(createdAt.getTime() + randomBetween(7, 60) * 86400000);

    // Pick status weighted
    let statusEntry = bookingStatusFlow[0];
    const rand = Math.random() * 100;
    let cumulative = 0;
    for (const s of bookingStatusFlow) {
      cumulative += s.weight;
      if (rand <= cumulative) { statusEntry = s; break; }
    }

    let code = generateBookingCode();
    while (usedCodes.has(code)) code = generateBookingCode();
    usedCodes.add(code);

    const passengerDetails = [];
    for (let p = 0; p < pax; p++) {
      passengerDetails.push({
        name: p === 0 ? customer.name : `Penumpang ${p + 1}`,
        idNumber: `32${randomBetween(1000000000000, 9999999999999)}`,
        phone: customer.phone,
      });
    }

    const booking = bookingRepo.create({
      bookingCode: code,
      tenantId: savedTenant.id,
      customerId: customer.id,
      packageId: pkg.id,
      travelDate,
      pax,
      totalPrice: price,
      status: statusEntry.status,
      passengerDetails,
      specialRequest: specialRequests[randomBetween(0, specialRequests.length - 1)],
      createdAt,
      updatedAt: createdAt,
    });
    const savedBooking = await bookingRepo.save(booking);

    // Create payment
    const method = paymentMethods[randomBetween(0, paymentMethods.length - 1)];
    const paidAt = statusEntry.payStatus === 'paid'
      ? new Date(createdAt.getTime() + randomBetween(1, 24) * 3600000)
      : null;

    await paymentRepo.save(paymentRepo.create({
      bookingId: savedBooking.id,
      amount: price,
      status: statusEntry.payStatus,
      method,
      transactionId: statusEntry.payStatus === 'paid' ? `TXN${Date.now()}${randomBetween(100, 999)}` : null,
      paidAt,
      createdAt,
      updatedAt: createdAt,
    }));

    bookingCount++;
  }

  console.log(`✅ ${bookingCount} bookings + payments created`);

  console.log('');
  console.log('🎉 Seed selesai!');
  console.log('──────────────────────────────────────────');
  console.log('🔑 Super Admin  : superadmin@travelsaas.com / superadmin123');
  console.log('🔑 Tenant Admin : admin@demo-travel.com / admin123');
  console.log('🔑 Customer     : budi.santoso@gmail.com / customer123');
  console.log('──────────────────────────────────────────');

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
