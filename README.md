# 🌴 Travel SaaS - Multi-tenant Travel Platform

Platform travel berbasis SaaS dengan arsitektur multi-tenant. Setiap agen travel mendapat subdomain dan dashboard terpisah.

## 📸 Screenshots

### Homepage

![Homepage - Main](./images/Homepage%20-%20Main.png)
![Homepage - Secondary](./images/Homepage%20-%20Secondary.png)
![Homepage - Tertiary](./images/Homepage%20-%20Tertiary.png)

### Tenant Admin Dashboard

![Tenant Admin Dashboard](./images/Tenant%20Admin%20Dashboard.png)

### Customer Dashboard

![Customer Dashboard](./images/Customer%20Dashboard.png)

## 🏗️ Tech Stack

- **Backend**: NestJS + TypeORM + PostgreSQL
- **Frontend**: Vue 3 + Pinia + Tailwind CSS
- **Payment**: Midtrans Snap
- **Auth**: JWT + Passport

## 🚀 Cara Menjalankan

### Opsi 1: Docker Compose (Recommended)

```bash
cp .env.example .env
# Edit .env, isi MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY

docker-compose up -d
```

App berjalan di:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **API Docs (Swagger)**: http://localhost:3000/api/docs

### Opsi 2: Manual

**Prerequisites**: Node.js 20+, PostgreSQL 15+

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env sesuai konfigurasi database lokal Anda

# 3. Buat database PostgreSQL
createdb travel_saas

# 4. Jalankan migrasi
npm run db:migrate

# 5. Seed data awal
npm run db:seed

# 6. Jalankan semua sekaligus
npm run dev
```

## 👤 Default Accounts (setelah seed)

| Role         | Email                     | Password      |
| ------------ | ------------------------- | ------------- |
| Super Admin  | superadmin@travelsaas.com | superadmin123 |
| Tenant Admin | admin@demo-travel.com     | admin123      |

## 📁 Struktur Project

```
travel-saas/
├── apps/
│   ├── backend/                 # NestJS API
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/        # JWT Auth
│   │       │   ├── tenants/     # Multi-tenant management
│   │       │   ├── packages/    # Travel packages CRUD
│   │       │   ├── bookings/    # Booking management
│   │       │   ├── payments/    # Midtrans integration
│   │       │   ├── reports/     # Analytics & reports
│   │       │   └── users/       # User management
│   │       ├── common/          # Guards, decorators
│   │       └── database/        # Migrations, seeds
│   │
│   └── frontend/                # Vue 3 SPA
│       └── src/
│           ├── pages/           # Route pages
│           ├── components/      # Reusable components
│           ├── stores/          # Pinia stores
│           ├── composables/     # Vue composables
│           ├── router/          # Vue Router
│           └── types/           # TypeScript types
│
└── docker-compose.yml
```

## 🔑 API Endpoints

| Method | Endpoint                        | Auth  | Deskripsi                |
| ------ | ------------------------------- | ----- | ------------------------ |
| POST   | /api/auth/register              | -     | Daftar customer          |
| POST   | /api/auth/register-tenant       | -     | Daftar agen travel       |
| POST   | /api/auth/login                 | -     | Login                    |
| GET    | /api/auth/me                    | JWT   | Info user login          |
| GET    | /api/packages                   | -     | List paket (public)      |
| POST   | /api/packages                   | Admin | Buat paket baru          |
| GET    | /api/bookings                   | JWT   | List booking             |
| POST   | /api/bookings                   | JWT   | Buat booking             |
| POST   | /api/payments/create/:bookingId | JWT   | Buat pembayaran Midtrans |
| POST   | /api/payments/webhook/midtrans  | -     | Midtrans webhook         |
| GET    | /api/reports/dashboard          | Admin | Statistik dashboard      |

## ⚙️ Konfigurasi Midtrans

1. Daftar akun di https://midtrans.com
2. Ambil Server Key & Client Key dari dashboard Midtrans
3. Isi di `.env` atau di halaman Settings per-tenant
4. Set webhook URL: `https://your-domain.com/api/payments/webhook/midtrans`

## 🌐 Multi-tenant

Setiap tenant memiliki:

- Slug unik (digunakan sebagai identifikasi)
- Dashboard admin terpisah
- Konfigurasi Midtrans sendiri
- Data paket, booking, dan customer terpisah
