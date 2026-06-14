<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-2xl mx-auto px-4 py-16">
      <div class="card text-center space-y-6">
        <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto">
          <span class="text-3xl">💳</span>
        </div>
        <div>
          <h1 class="text-2xl font-display font-bold text-gray-900">Pembayaran</h1>
          <p class="text-gray-500 mt-1">Kode Booking: <span class="font-mono font-bold text-primary-600">{{ booking?.bookingCode }}</span></p>
        </div>

        <div v-if="payment" class="p-5 bg-gray-50 rounded-2xl text-left space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Total Pembayaran</span>
            <span class="font-bold text-xl text-primary-600">{{ formatIDR(payment.amount) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Status</span>
            <span :class="payment.status === 'paid' ? 'badge-paid' : 'badge-pending'">
              {{ payment.status === 'paid' ? 'Lunas ✓' : 'Menunggu Pembayaran' }}
            </span>
          </div>
        </div>

        <div v-if="payment?.status !== 'paid'">
          <button @click="openSnap" :disabled="!payment?.snapToken || snapLoading"
            class="btn-primary w-full justify-center py-4 text-base">
            {{ snapLoading ? 'Membuka...' : 'Bayar Sekarang' }}
          </button>
          <p class="text-xs text-gray-400 mt-3">
            Aman dan terenkripsi. Didukung oleh Midtrans.
          </p>
          <div class="flex items-center justify-center gap-3 mt-3">
            <span class="text-xs text-gray-400">Transfer Bank · Kartu Kredit · GoPay · OVO · Dana</span>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="p-4 bg-green-50 rounded-xl border border-green-100">
            <p class="text-green-700 font-semibold text-sm">✅ Pembayaran berhasil! Tim agen akan menghubungi Anda.</p>
          </div>
          <RouterLink to="/my/bookings" class="btn-primary w-full justify-center py-3">
            Lihat Booking Saya
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/layout/Navbar.vue';
import { useBookingsStore } from '@/stores/bookings';
import { useFormatCurrency } from '@/composables/useFormatCurrency';
import api from '@/utils/api';

const route = useRoute();
const bookingStore = useBookingsStore();
const { formatIDR } = useFormatCurrency();
const booking = ref<any>(null);
const payment = ref<any>(null);
const snapLoading = ref(false);

async function loadPayment() {
  await bookingStore.fetchOne(route.params.bookingId as string);
  booking.value = bookingStore.current;
  // Create/get payment
  const res = await api.post(`/payments/create/${route.params.bookingId}`);
  payment.value = res.data;
}

function openSnap() {
  if (!payment.value?.snapToken) return;
  snapLoading.value = true;
  // Load Midtrans Snap
  const script = document.createElement('script');
  script.src = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';
  script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
  script.onload = () => {
    snapLoading.value = false;
    (window as any).snap.pay(payment.value.snapToken, {
      onSuccess: () => { payment.value.status = 'paid'; },
      onPending: () => {},
      onError: () => {},
      onClose: () => {},
    });
  };
  document.head.appendChild(script);
}

onMounted(loadPayment);
</script>
