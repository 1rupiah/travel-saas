<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-8">
        <h1 class="text-2xl font-display font-bold text-gray-900">Booking Saya</h1>
        <p class="text-gray-500 mt-1">Riwayat dan status pemesanan Anda</p>
      </div>

      <!-- Status Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button v-for="tab in tabs" :key="tab.value"
          @click="activeTab = tab.value; fetchBookings()"
          :class="['px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap',
            activeTab === tab.value ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200']">
          {{ tab.label }}
        </button>
      </div>

      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
      </div>

      <div v-else-if="!bookings.length" class="card text-center py-16">
        <div class="text-6xl mb-4">🏖️</div>
        <p class="text-gray-500 font-medium">Belum ada booking</p>
        <RouterLink to="/packages" class="btn-primary mt-4 inline-flex">Cari Paket Wisata</RouterLink>
      </div>

      <div v-else class="space-y-4">
        <div v-for="booking in bookings" :key="booking.id"
          class="card hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="font-mono font-bold text-primary-600 text-sm">{{ booking.bookingCode }}</span>
                <span :class="getStatus(booking.status).class">{{ getStatus(booking.status).label }}</span>
              </div>
              <h3 class="font-display font-bold text-gray-900">{{ booking.package?.name }}</h3>
              <div class="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                <span>📅 {{ formatDate(booking.travelDate) }}</span>
                <span>👥 {{ booking.pax }} pax</span>
                <span class="font-semibold text-gray-900">{{ formatIDR(booking.totalPrice) }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <RouterLink :to="`/my/bookings/${booking.id}`" class="btn-secondary text-sm py-1.5 px-4">Detail</RouterLink>
              <button v-if="booking.status === 'pending'"
                @click="payNow(booking)"
                class="btn-primary text-sm py-1.5 px-4">
                Bayar
              </button>
              <button v-if="['pending','confirmed'].includes(booking.status)"
                @click="cancelBooking(booking.id)"
                class="text-sm px-4 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition">
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import dayjs from 'dayjs';
import Navbar from '@/components/layout/Navbar.vue';
import { useBookingsStore } from '@/stores/bookings';
import { useFormatCurrency } from '@/composables/useFormatCurrency';
import { useBookingStatus } from '@/composables/useBookingStatus';

const store = useBookingsStore();
const router = useRouter();
const { formatIDR } = useFormatCurrency();
const { getStatus } = useBookingStatus();
const activeTab = ref('');
const bookings = computed(() => store.bookings);
const loading = computed(() => store.loading);

const tabs = [
  { label: 'Semua', value: '' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Dikonfirmasi', value: 'confirmed' },
  { label: 'Lunas', value: 'paid' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Dibatalkan', value: 'cancelled' },
];

const formatDate = (d: string) => dayjs(d).format('DD MMMM YYYY');

async function fetchBookings() {
  await store.fetchAll({ status: activeTab.value || undefined });
}

function payNow(booking: any) {
  router.push(`/book/${booking.packageId}/payment/${booking.id}`);
}

async function cancelBooking(id: string) {
  if (!confirm('Batalkan booking ini?')) return;
  try {
    await store.cancel(id);
    toast.success('Booking dibatalkan');
  } catch { toast.error('Gagal membatalkan'); }
}

onMounted(fetchBookings);
</script>
