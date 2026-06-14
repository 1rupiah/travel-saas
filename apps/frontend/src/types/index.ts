export interface Tenant {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  settings?: Record<string, any>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'tenant_admin' | 'staff' | 'customer';
  phone?: string;
  avatar?: string;
  tenantId?: string;
}

export interface TravelPackage {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  type: 'tour' | 'hotel' | 'flight' | 'combined';
  destination: string;
  basePrice: number;
  discountPrice?: number;
  durationDays: number;
  minPax: number;
  maxPax?: number;
  itinerary?: ItineraryDay[];
  includes?: string[];
  excludes?: string[];
  images?: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface Booking {
  id: string;
  bookingCode: string;
  tenantId: string;
  customerId: string;
  packageId: string;
  package?: TravelPackage;
  customer?: User;
  travelDate: string;
  pax: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'paid' | 'ongoing' | 'completed' | 'cancelled';
  passengerDetails?: PassengerDetail[];
  specialRequest?: string;
  payment?: Payment;
  createdAt: string;
}

export interface PassengerDetail {
  name: string;
  idNumber: string;
  type: 'adult' | 'child';
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  method?: string;
  snapToken?: string;
  snapUrl?: string;
  paidAt?: string;
}

export interface DashboardStats {
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  totalPackages: number;
  totalCustomers: number;
}
