<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-display font-bold text-gray-900">Daftar Booking</h1>
        <p class="text-gray-500 mt-1">Kelola semua pemesanan</p>
      </div>
      <select v-model="statusFilter" class="input-field max-w-48" @change="fetchBookings">
        <option value="">Semua Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Dikonfirmasi</option>
        <option value="paid">Lunas</option>
        <option value="completed">Selesai</option>
        <option value="cancelled">Dibatalkan</option>
      </select>
    </div>

    <div class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="text-left p-4 font-semibold text-gray-600">Kode</th>
              <th class="text-left p-4 font-semibold text-gray-600">Customer</th>
              <th class="text-left p-4 font-semibold text-gray-600">Paket</th>
              <th class="text-left p-4 font-semibold text-gray-600">Tgl. Berangkat</th>
              <th class="text-left p-4 font-semibold text-gray-600">Pax</th>
              <th class="text-left p-4 font-semibold text-gray-600">Total</th>
              <th class="text-left p-4 font-semibold text-gray-600">Status</th>
              <th class="text-left p-4 font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="8" class="p-8 text-center text-gray-400">Memuat...</td></tr>
            <tr v-else-if="!bookings.length"><td colspan="8" class="p-8 text-center text-gray-400">Belum ada booking</td></tr>
            <tr v-for="booking in bookings" :key="booking.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="p-4 font-mono font-semibold text-primary-600">{{ booking.bookingCode }}</td>
              <td class="p-4">{{ booking.customer?.name || '-' }}</td>
              <td class="p-4">{{ booking.package?.name || '-' }}</td>
              <td class="p-4 text-gray-600">{{ formatDate(booking.travelDate) }}</td>
              <td class="p-4 text-center">{{ booking.pax }}</td>
              <td class="p-4 font-semibold">{{ formatIDR(booking.totalPrice) }}</td>
              <td class="p-4"><span :class="getStatus(booking.status).class">{{ getStatus(booking.status).label }}</span></td>
              <td class="p-4">
                <div class="flex gap-2">
                  <RouterLink :to="`/admin/bookings/${booking.id}`" class="text-xs btn-secondary py-1.5 px-3">Detail</RouterLink>
                  <select v-if="['pending','confirmed'].includes(booking.status)"
                    class="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600"
                    @change="(e) => updateStatus(booking.id, (e.target as HTMLSelectElement).value)">
                    <option value="">Ubah Status</option>
                    <option value="confirmed">Konfirmasi</option>
                    <option value="cancelled">Batalkan</option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import dayjs from 'dayjs';
import { useBookingsStore } from '@/stores/bookings';
import { useFormatCurrency } from '@/composables/useFormatCurrency';
import { useBookingStatus } from '@/composables/useBookingStatus';

const store = useBookingsStore();
const { formatIDR } = useFormatCurrency();
const { getStatus } = useBookingStatus();
const statusFilter = ref('');
const bookings = computed(() => store.bookings);
const loading = computed(() => store.loading);

const formatDate = (d: string) => dayjs(d).format('DD MMM YYYY');

async function fetchBookings() {
  await store.fetchAll({ status: statusFilter.value });
}

async function updateStatus(id: string, status: string) {
  if (!status) return;
  await store.updateStatus(id, status as any);
  toast.success('Status diperbarui');
}

onMounted(fetchBookings);
</script>
