import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  // Public routes
  { path: '/', component: () => import('@/pages/HomePage.vue') },
  { path: '/packages', component: () => import('@/pages/package/PackageListPage.vue') },
  { path: '/packages/:id', component: () => import('@/pages/package/PackageDetailPage.vue') },
  
  // Auth
  { path: '/auth/login', component: () => import('@/pages/auth/LoginPage.vue'), meta: { guest: true } },
  { path: '/auth/register', component: () => import('@/pages/auth/RegisterPage.vue'), meta: { guest: true } },
  { path: '/auth/register-tenant', component: () => import('@/pages/auth/RegisterTenantPage.vue'), meta: { guest: true } },

  // Customer area
  {
    path: '/my',
    meta: { requiresAuth: true },
    children: [
      { path: 'bookings', component: () => import('@/pages/booking/MyBookingsPage.vue') },
      { path: 'bookings/:id', component: () => import('@/pages/booking/BookingDetailPage.vue') },
      { path: 'profile', component: () => import('@/pages/dashboard/ProfilePage.vue') },
    ],
  },

  // Booking flow
  { path: '/book/:packageId', component: () => import('@/pages/booking/BookingFormPage.vue'), meta: { requiresAuth: true } },
  { path: '/book/:packageId/payment/:bookingId', component: () => import('@/pages/booking/PaymentPage.vue'), meta: { requiresAuth: true } },

  // Admin/Tenant Dashboard
  {
    path: '/admin',
    meta: { requiresAuth: true, requiresAdmin: true },
    component: () => import('@/pages/admin/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: () => import('@/pages/dashboard/DashboardPage.vue') },
      { path: 'packages', component: () => import('@/pages/admin/PackagesAdminPage.vue') },
      { path: 'packages/create', component: () => import('@/pages/admin/PackageFormPage.vue') },
      { path: 'packages/:id/edit', component: () => import('@/pages/admin/PackageFormPage.vue') },
      { path: 'bookings', component: () => import('@/pages/admin/BookingsAdminPage.vue') },
      { path: 'bookings/:id', component: () => import('@/pages/booking/BookingDetailPage.vue') },
      { path: 'users', component: () => import('@/pages/admin/UsersAdminPage.vue') },
      { path: 'reports', component: () => import('@/pages/reports/ReportsPage.vue') },
      { path: 'settings', component: () => import('@/pages/admin/SettingsPage.vue') },
    ],
  },

  { path: '/:pathMatch(.*)*', component: () => import('@/pages/NotFoundPage.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next('/auth/login');
  }
  if (to.meta.guest && auth.isLoggedIn) {
    return next(auth.isAdmin ? '/admin/dashboard' : '/my/bookings');
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next('/my/bookings');
  }
  next();
});

export default router;
