import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { DashboardStats } from '@/types';

export const useReportsStore = defineStore('reports', () => {
  const stats = ref<DashboardStats | null>(null);
  const monthlyRevenue = ref<any[]>([]);
  const topPackages = ref<any[]>([]);
  const bookingsByStatus = ref<any[]>([]);

  async function fetchDashboard() {
    const res = await api.get('/reports/dashboard');
    stats.value = res.data;
  }

  async function fetchMonthlyRevenue(year?: number) {
    const res = await api.get('/reports/monthly-revenue', { params: { year } });
    monthlyRevenue.value = res.data;
  }

  async function fetchTopPackages() {
    const res = await api.get('/reports/top-packages');
    topPackages.value = res.data;
  }

  async function fetchBookingsByStatus() {
    const res = await api.get('/reports/bookings-by-status');
    bookingsByStatus.value = res.data;
  }

  return { stats, monthlyRevenue, topPackages, bookingsByStatus, fetchDashboard, fetchMonthlyRevenue, fetchTopPackages, fetchBookingsByStatus };
});
