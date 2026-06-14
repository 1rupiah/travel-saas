<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-500 mt-1">Selamat datang, {{ auth.user?.name }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
      <StatCard title="Total Booking" :value="stats?.totalBookings || 0" color="blue" icon="📋" />
      <StatCard title="Booking Lunas" :value="stats?.confirmedBookings || 0" color="green" icon="✅" />
      <StatCard title="Total Pendapatan" :value="formatIDR(stats?.totalRevenue || 0)" color="emerald" icon="💰" :is-currency="true" />
      <StatCard title="Paket Aktif" :value="stats?.totalPackages || 0" color="purple" icon="🗺️" />
      <StatCard title="Total Customer" :value="stats?.totalCustomers || 0" color="orange" icon="👥" />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2 card">
        <h2 class="font-display font-bold text-gray-900 mb-4">Pendapatan Bulanan {{ currentYear }}</h2>
        <Line v-if="chartData.labels.length" :data="chartData" :options="chartOptions" class="max-h-64" />
        <div v-else class="h-64 flex items-center justify-center text-gray-400">Belum ada data</div>
      </div>
      <div class="card">
        <h2 class="font-display font-bold text-gray-900 mb-4">Status Booking</h2>
        <Doughnut v-if="donutData.labels.length" :data="donutData" :options="{ responsive: true }" class="max-h-64" />
        <div v-else class="h-64 flex items-center justify-center text-gray-400">Belum ada data</div>
      </div>
    </div>

    <!-- Top Packages -->
    <div class="card">
      <h2 class="font-display font-bold text-gray-900 mb-4">Paket Terlaris</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left border-b border-gray-100">
            <th class="pb-3 font-semibold text-gray-500">Paket</th>
            <th class="pb-3 font-semibold text-gray-500 text-right">Booking</th>
            <th class="pb-3 font-semibold text-gray-500 text-right">Pendapatan</th>
          </tr></thead>
          <tbody>
            <tr v-for="pkg in topPackages" :key="pkg.packageId" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-3 font-medium">{{ pkg.packageName }}</td>
              <td class="py-3 text-right">{{ pkg.bookingCount }}</td>
              <td class="py-3 text-right text-primary-600 font-semibold">{{ formatIDR(pkg.revenue) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="!topPackages.length" class="py-8 text-center text-gray-400">Belum ada data</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Line, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useAuthStore } from '@/stores/auth';
import { useReportsStore } from '@/stores/reports';
import { useFormatCurrency } from '@/composables/useFormatCurrency';
import StatCard from '@/components/dashboard/StatCard.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const auth = useAuthStore();
const reports = useReportsStore();
const { formatIDR } = useFormatCurrency();
const currentYear = new Date().getFullYear();

const stats = computed(() => reports.stats);
const topPackages = computed(() => reports.topPackages);

const chartData = computed(() => {
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const data = new Array(12).fill(0);
  reports.monthlyRevenue.forEach(item => {
    const month = new Date(item.month).getMonth();
    data[month] = Number(item.revenue);
  });
  return {
    labels: months,
    datasets: [{ label: 'Pendapatan', data, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.1)', tension: 0.4, fill: true }],
  };
});

const donutData = computed(() => {
  const colorMap: Record<string, string> = { pending: '#f59e0b', confirmed: '#3b82f6', paid: '#10b981', cancelled: '#ef4444', completed: '#8b5cf6' };
  return {
    labels: reports.bookingsByStatus.map(s => s.status),
    datasets: [{ data: reports.bookingsByStatus.map(s => s.count), backgroundColor: reports.bookingsByStatus.map(s => colorMap[s.status] || '#gray') }],
  };
});

const chartOptions = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };

onMounted(async () => {
  await Promise.all([
    reports.fetchDashboard(),
    reports.fetchMonthlyRevenue(),
    reports.fetchTopPackages(),
    reports.fetchBookingsByStatus(),
  ]);
});
</script>
