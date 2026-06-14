<template>
  <div class="p-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-display font-bold text-gray-900">Laporan & Analitik</h1>
        <p class="text-gray-500 mt-1">Pantau performa bisnis travel Anda</p>
      </div>
      <select v-model="selectedYear" @change="fetchReports" class="input-field max-w-36">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <div class="card text-center">
        <div class="text-3xl font-display font-bold text-primary-600">{{ stats?.totalBookings || 0 }}</div>
        <div class="text-sm text-gray-500 mt-1">Total Booking</div>
      </div>
      <div class="card text-center">
        <div class="text-3xl font-display font-bold text-travel-forest">{{ stats?.confirmedBookings || 0 }}</div>
        <div class="text-sm text-gray-500 mt-1">Booking Lunas</div>
      </div>
      <div class="card text-center">
        <div class="text-3xl font-display font-bold text-travel-sand">{{ formatIDR(stats?.totalRevenue || 0) }}</div>
        <div class="text-sm text-gray-500 mt-1">Total Revenue</div>
      </div>
      <div class="card text-center">
        <div class="text-3xl font-display font-bold text-gray-900">{{ stats?.totalCustomers || 0 }}</div>
        <div class="text-sm text-gray-500 mt-1">Total Customer</div>
      </div>
    </div>

    <!-- Revenue Chart -->
    <div class="card mb-6">
      <h2 class="font-display font-bold text-gray-900 mb-4">Tren Pendapatan {{ selectedYear }}</h2>
      <Bar v-if="barChartData.labels.length" :data="barChartData" :options="barOptions" class="max-h-72" />
      <div v-else class="h-64 flex items-center justify-center text-gray-400">Belum ada data pendapatan</div>
    </div>

    <!-- Bottom Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Packages Table -->
      <div class="card">
        <h2 class="font-display font-bold text-gray-900 mb-4">Paket Terlaris</h2>
        <table class="w-full text-sm">
          <thead><tr class="border-b border-gray-100">
            <th class="text-left pb-3 font-semibold text-gray-500">Paket</th>
            <th class="text-right pb-3 font-semibold text-gray-500">Booking</th>
            <th class="text-right pb-3 font-semibold text-gray-500">Revenue</th>
          </tr></thead>
          <tbody>
            <tr v-for="pkg in topPackages" :key="pkg.packageId" class="border-b border-gray-50">
              <td class="py-3 font-medium text-gray-900 truncate max-w-[150px]">{{ pkg.packageName }}</td>
              <td class="py-3 text-right text-gray-600">{{ pkg.bookingCount }}</td>
              <td class="py-3 text-right text-primary-600 font-semibold">{{ formatIDR(pkg.revenue) }}</td>
            </tr>
            <tr v-if="!topPackages.length"><td colspan="3" class="py-8 text-center text-gray-400">Belum ada data</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Booking Status Pie -->
      <div class="card">
        <h2 class="font-display font-bold text-gray-900 mb-4">Distribusi Status Booking</h2>
        <Doughnut v-if="donutData.labels.length" :data="donutData" :options="{ responsive: true, plugins: { legend: { position: 'bottom' } } }" class="max-h-72" />
        <div v-else class="h-64 flex items-center justify-center text-gray-400">Belum ada data</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Bar, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useReportsStore } from '@/stores/reports';
import { useFormatCurrency } from '@/composables/useFormatCurrency';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const reports = useReportsStore();
const { formatIDR } = useFormatCurrency();
const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const stats = computed(() => reports.stats);
const topPackages = computed(() => reports.topPackages);

const barChartData = computed(() => {
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const data = new Array(12).fill(0);
  reports.monthlyRevenue.forEach(item => {
    const month = new Date(item.month).getMonth();
    data[month] = Number(item.revenue);
  });
  return {
    labels: months,
    datasets: [{ label: 'Revenue (IDR)', data, backgroundColor: 'rgba(37,99,235,0.7)', borderRadius: 8, borderSkipped: false }],
  };
});

const donutData = computed(() => {
  const colorMap: Record<string, string> = { pending: '#f59e0b', confirmed: '#3b82f6', paid: '#10b981', cancelled: '#ef4444', completed: '#8b5cf6', ongoing: '#06b6d4' };
  const labelMap: Record<string, string> = { pending: 'Pending', confirmed: 'Dikonfirmasi', paid: 'Lunas', cancelled: 'Dibatalkan', completed: 'Selesai', ongoing: 'Berlangsung' };
  return {
    labels: reports.bookingsByStatus.map(s => labelMap[s.status] || s.status),
    datasets: [{ data: reports.bookingsByStatus.map(s => Number(s.count)), backgroundColor: reports.bookingsByStatus.map(s => colorMap[s.status] || '#6b7280') }],
  };
});

const barOptions = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: (v: any) => `${(v/1000000).toFixed(1)}Jt` } } } };

async function fetchReports() {
  await Promise.all([
    reports.fetchDashboard(),
    reports.fetchMonthlyRevenue(selectedYear.value),
    reports.fetchTopPackages(),
    reports.fetchBookingsByStatus(),
  ]);
}

onMounted(fetchReports);
</script>
