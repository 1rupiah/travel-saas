<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-3xl mx-auto px-4 py-10">
      <RouterLink to="/my/bookings" class="text-sm text-primary-600 hover:underline mb-6 inline-block">← Kembali</RouterLink>

      <div v-if="booking" class="space-y-6">
        <!-- Header -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="font-mono font-bold text-primary-600 text-lg">{{ booking.bookingCode }}</div>
              <div class="text-gray-500 text-sm mt-1">Dibuat {{ formatDate(booking.createdAt) }}</div>
            </div>
            <span :class="getStatus(booking.status).class + ' text-base px-4 py-1.5'">{{ getStatus(booking.status).label }}</span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div><span class="text-gray-500">Paket</span><div class="font-semibold mt-1">{{ booking.package?.name }}</div></div>
            <div><span class="text-gray-500">Destinasi</span><div class="font-semibold mt-1">{{ booking.package?.destination }}</div></div>
            <div><span class="text-gray-500">Tgl. Berangkat</span><div class="font-semibold mt-1">{{ formatDate(booking.travelDate) }}</div></div>
            <div><span class="text-gray-500">Jumlah Pax</span><div class="font-semibold mt-1">{{ booking.pax }} orang</div></div>
            <div><span class="text-gray-500">Total Harga</span><div class="font-bold text-primary-600 text-lg mt-1">{{ formatIDR(booking.totalPrice) }}</div></div>
            <div v-if="booking.specialRequest"><span class="text-gray-500">Permintaan Khusus</span><div class="font-semibold mt-1">{{ booking.specialRequest }}</div></div>
          </div>
        </div>

        <!-- Passengers -->
        <div v-if="booking.passengerDetails?.length" class="card">
          <h2 class="font-display font-bold text-gray-900 mb-4">Data Penumpang</h2>
          <div class="space-y-3">
            <div v-for="(p, i) in booking.passengerDetails" :key="i" class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div class="font-semibold text-sm">{{ p.name }}</div>
                <div class="text-xs text-gray-500">No. ID: {{ p.idNumber }}</div>
              </div>
              <span class="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-lg capitalize">{{ p.type === 'adult' ? 'Dewasa' : 'Anak-anak' }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Action -->
        <div v-if="booking.status === 'pending'" class="card">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-gray-900">Selesaikan Pembayaran</div>
              <div class="text-sm text-gray-500 mt-1">{{ formatIDR(booking.totalPrice) }}</div>
            </div>
            <RouterLink :to="`/book/${booking.packageId}/payment/${booking.id}`" class="btn-primary">
              Bayar Sekarang
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import Navbar from '@/components/layout/Navbar.vue';
import { useBookingsStore } from '@/stores/bookings';
import { useFormatCurrency } from '@/composables/useFormatCurrency';
import { useBookingStatus } from '@/composables/useBookingStatus';

const route = useRoute();
const store = useBookingsStore();
const { formatIDR } = useFormatCurrency();
const { getStatus } = useBookingStatus();
const booking = computed(() => store.current);

const formatDate = (d: string) => dayjs(d).format('DD MMMM YYYY');
onMounted(() => store.fetchOne(route.params.id as string));
</script>
