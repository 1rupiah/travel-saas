### Portfolio Project by Rahmat Hidayat

Available for freelance, consulting, contract, and full-time opportunities.

- **📧 Email**: rahmat6hidayat@gmail.com
- **💼 LinkedIn**: https://www.linkedin.com/in/rahmat6hidayat
- **📍 Location**: Jakarta, Indonesia

This repository showcases a production-grade multi-tenant Travel SaaS platform developed as part of my professional portfolio. It demonstrates software architecture design, backend and frontend engineering, payment gateway integration, tenant isolation, and scalable SaaS application development practices.

# 🌴 Travel SaaS - Multi-Tenant Travel Platform

A SaaS-based travel platform built with a multi-tenant architecture. Each travel agency receives its own dedicated subdomain and isolated dashboard environment.

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
- **Payment Gateway**: Midtrans Snap
- **Authentication**: JWT + Passport

## 🚀 Getting Started

### Option 1: Docker Compose (Recommended)

```bash
cp .env.example .env

# Edit .env and provide MIDTRANS_SERVER_KEY and MIDTRANS_CLIENT_KEY

docker-compose up -d
```

Application URLs:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **API Documentation (Swagger)**: http://localhost:3000/api/docs

### Option 2: Manual Setup

**Prerequisites**: Node.js 20+, PostgreSQL 15+

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env

# Update .env with your local database configuration

# 3. Create PostgreSQL database
createdb travel_saas

# 4. Run database migrations
npm run db:migrate

# 5. Seed initial data
npm run db:seed

# 6. Start the application
npm run dev
```

## 👤 Default Accounts (After Database Seeding)

| Role         | Email                     | Password      |
| ------------ | ------------------------- | ------------- |
| Super Admin  | superadmin@travelsaas.com | superadmin123 |
| Tenant Admin | admin@demo-travel.com     | admin123      |
| Customer     | budi.santoso@gmail.com    | customer123   |

## 📁 Project Structure

```text
travel-saas/
├── apps/
│   ├── backend/
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/
│   │       │   ├── tenants/
│   │       │   ├── packages/
│   │       │   ├── bookings/
│   │       │   ├── payments/
│   │       │   ├── reports/
│   │       │   └── users/
│   │       ├── common/
│   │       └── database/
│   │
│   └── frontend/
│       └── src/
│           ├── pages/
│           ├── components/
│           ├── stores/
│           ├── composables/
│           ├── router/
│           └── types/
│
└── docker-compose.yml
```

## 🔑 API Endpoints

| Method | Endpoint                        | Auth  | Description                    |
| ------ | ------------------------------- | ----- | ------------------------------ |
| POST   | /api/auth/register              | -     | Register Customer              |
| POST   | /api/auth/register-tenant       | -     | Register Travel Agency         |
| POST   | /api/auth/login                 | -     | User Login                     |
| GET    | /api/auth/me                    | JWT   | Get Current User Information   |
| GET    | /api/packages                   | -     | Public Package Listing         |
| POST   | /api/packages                   | Admin | Create Travel Package          |
| GET    | /api/bookings                   | JWT   | List User Bookings             |
| POST   | /api/bookings                   | JWT   | Create Booking                 |
| POST   | /api/payments/create/:bookingId | JWT   | Create Midtrans Payment        |
| POST   | /api/payments/webhook/midtrans  | -     | Midtrans Webhook Endpoint      |
| GET    | /api/reports/dashboard          | Admin | Dashboard Statistics & Reports |

## ⚙️ Midtrans Configuration

1. Create an account at https://midtrans.com
2. Obtain your Server Key and Client Key from the Midtrans dashboard
3. Configure the keys in the `.env` file or through each tenant's Settings page
4. Configure the webhook URL:

```text
https://your-domain.com/api/payments/webhook/midtrans
```

## 🌐 Multi-Tenant Architecture

Each tenant has:

- A unique slug used as its identifier
- A dedicated administrative dashboard
- Independent Midtrans payment configuration
- Isolated travel packages, bookings, and customer data
- Separate business operations and reporting environment

## 📄 Disclaimer

This repository is presented for portfolio and demonstration purposes only. All rights belong to their respective owners. If you would like to discuss similar projects, consulting opportunities, freelance work, or full-time positions, feel free to contact me through the information provided above.
