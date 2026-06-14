<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-8">
        <RouterLink :to="`/packages/${route.params.packageId}`" class="text-sm text-primary-600 hover:underline">← Kembali ke detail</RouterLink>
        <h1 class="text-2xl font-display font-bold text-gray-900 mt-3">Form Pemesanan</h1>
      </div>

      <div v-if="pkg" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <!-- Trip Info -->
          <div class="card space-y-4">
            <h2 class="font-display font-bold text-gray-900">Informasi Perjalanan</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Tanggal Berangkat *</label>
                <input v-model="form.travelDate" type="date" required :min="minDate" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Jumlah Pax *</label>
                <input v-model.number="form.pax" type="number" :min="pkg.minPax" :max="pkg.maxPax || 99" class="input-field" @change="updatePassengers" />
                <p class="text-xs text-gray-400 mt-1">Min. {{ pkg.minPax }}{{ pkg.maxPax ? `, Max. ${pkg.maxPax}` : '' }} orang</p>
              </div>
            </div>
          </div>

          <!-- Passenger Details -->
          <div class="card space-y-4">
            <h2 class="font-display font-bold text-gray-900">Data Penumpang</h2>
            <div v-for="(p, i) in form.passengerDetails" :key="i" class="p-4 bg-gray-50 rounded-xl space-y-3">
              <div class="font-semibold text-gray-700 text-sm">Penumpang {{ i + 1 }}</div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1">Nama Lengkap *</label>
                  <input v-model="p.name" required class="input-field text-sm py-2" placeholder="Sesuai KTP/Paspor" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1">No. KTP/Paspor *</label>
                  <input v-model="p.idNumber" required class="input-field text-sm py-2" placeholder="3271..." />
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Tipe</label>
                <select v-model="p.type" class="input-field text-sm py-2">
                  <option value="adult">Dewasa</option>
                  <option value="child">Anak-anak</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Special Request -->
          <div class="card">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Permintaan Khusus (Opsional)</label>
            <textarea v-model="form.specialRequest" rows="3" class="input-field resize-none"
              placeholder="Alergi makanan, kamar honeymoon, dll..."></textarea>
          </div>
        </div>

        <!-- Order Summary -->
        <div>
          <div class="card sticky top-24 space-y-4">
            <h2 class="font-display font-bold text-gray-900">Ringkasan Pesanan</h2>
            <div class="p-3 bg-primary-50 rounded-xl">
              <div class="font-semibold text-gray-900 text-sm">{{ pkg.name }}</div>
              <div class="text-xs text-gray-500 mt-1">📍 {{ pkg.destination }} · {{ pkg.durationDays }}H</div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Harga/pax</span>
                <span>{{ formatIDR(pkg.discountPrice || pkg.basePrice) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Jumlah pax</span>
                <span>× {{ form.pax }}</span>
              </div>
              <div class="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span class="text-primary-600">{{ formatIDR(totalPrice) }}</span>
              </div>
            </div>
            <button @click="handleSubmit" :disabled="loading" class="btn-primary w-full justify-center py-4">
              {{ loading ? 'Memproses...' : 'Lanjut ke Pembayaran' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import dayjs from 'dayjs';
import Navbar from '@/components/layout/Navbar.vue';
import { usePackagesStore } from '@/stores/packages';
import { useBookingsStore } from '@/stores/bookings';
import { useFormatCurrency } from '@/composables/useFormatCurrency';

const route = useRoute();
const router = useRouter();
const pkgStore = usePackagesStore();
const bookingStore = useBookingsStore();
const { formatIDR } = useFormatCurrency();
const loading = ref(false);
const pkg = computed(() => pkgStore.current);
const minDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

const form = ref({
  travelDate: '',
  pax: 1,
  passengerDetails: [{ name: '', idNumber: '', type: 'adult' }] as any[],
  specialRequest: '',
});

const totalPrice = computed(() => {
  if (!pkg.value) return 0;
  const price = pkg.value.discountPrice || pkg.value.basePrice;
  return price * form.value.pax;
});

function updatePassengers() {
  const pax = form.value.pax;
  while (form.value.passengerDetails.length < pax) {
    form.value.passengerDetails.push({ name: '', idNumber: '', type: 'adult' });
  }
  while (form.value.passengerDetails.length > pax) {
    form.value.passengerDetails.pop();
  }
}

async function handleSubmit() {
  if (!form.value.travelDate) { toast.error('Pilih tanggal berangkat'); return; }
  loading.value = true;
  try {
    const booking = await bookingStore.create({
      packageId: route.params.packageId as string,
      tenantId: pkg.value?.tenantId,
      ...form.value,
    });
    toast.success('Booking berhasil!');
    router.push(`/book/${route.params.packageId}/payment/${booking.id}`);
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Gagal membuat booking');
  } finally { loading.value = false; }
}

onMounted(async () => {
  await pkgStore.fetchOne(route.params.packageId as string);
  if (pkg.value) form.value.pax = pkg.value.minPax;
  updatePassengers();
});
</script>
