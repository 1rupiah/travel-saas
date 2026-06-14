<template>
  <div class="p-8 max-w-2xl">
    <h1 class="text-2xl font-display font-bold text-gray-900 mb-8">Pengaturan Agen</h1>

    <div class="space-y-6">
      <div class="card space-y-4">
        <h2 class="font-display font-bold text-gray-900">Profil Agen</h2>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Nama Perusahaan</label>
          <input v-model="form.name" class="input-field" placeholder="Nama agen travel Anda" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Alamat</label>
          <input v-model="form.address" class="input-field" placeholder="Alamat kantor" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">No. Telepon</label>
          <input v-model="form.phone" class="input-field" placeholder="08xxx" />
        </div>
        <button @click="saveProfile" :disabled="loading" class="btn-primary">
          {{ loading ? 'Menyimpan...' : 'Simpan Profil' }}
        </button>
      </div>

      <div class="card space-y-4">
        <h2 class="font-display font-bold text-gray-900">Konfigurasi Pembayaran</h2>
        <p class="text-sm text-gray-500">Konfigurasi Midtrans untuk menerima pembayaran dari pelanggan.</p>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Midtrans Server Key</label>
          <input v-model="paymentConfig.serverKey" type="password" class="input-field font-mono" placeholder="SB-Mid-server-..." />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Midtrans Client Key</label>
          <input v-model="paymentConfig.clientKey" class="input-field font-mono" placeholder="SB-Mid-client-..." />
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="paymentConfig.isProduction" type="checkbox" class="rounded text-primary-600" />
          <span class="text-sm font-medium text-gray-700">Mode Production (aktifkan setelah siap)</span>
        </label>
        <button @click="savePayment" :disabled="loading" class="btn-primary">Simpan Konfigurasi</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth';
import api from '@/utils/api';

const auth = useAuthStore();
const loading = ref(false);
const form = ref({ name: '', address: '', phone: '' });
const paymentConfig = ref({ serverKey: '', clientKey: '', isProduction: false });

async function saveProfile() {
  loading.value = true;
  try {
    await api.put(`/tenants/${auth.user?.tenantId}`, form.value);
    toast.success('Profil berhasil disimpan');
  } catch { toast.error('Gagal menyimpan'); } finally { loading.value = false; }
}

async function savePayment() {
  loading.value = true;
  try {
    await api.put(`/tenants/${auth.user?.tenantId}/settings`, { paymentConfig: paymentConfig.value });
    toast.success('Konfigurasi pembayaran disimpan');
  } catch { toast.error('Gagal menyimpan'); } finally { loading.value = false; }
}

onMounted(async () => {
  if (!auth.user?.tenantId) return;
  const res = await api.get(`/tenants/${auth.user.tenantId}`);
  form.value = { name: res.data.name, address: res.data.address, phone: res.data.phone };
  if (res.data.paymentConfig) paymentConfig.value = res.data.paymentConfig;
});
</script>
