<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-display font-bold text-gray-900">Paket Wisata</h1>
        <p class="text-gray-500 mt-1">Kelola semua paket travel Anda</p>
      </div>
      <RouterLink to="/admin/packages/create" class="btn-primary">+ Tambah Paket</RouterLink>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex gap-4">
        <input v-model="filters.destination" placeholder="Cari destinasi..." class="input-field max-w-xs" @input="fetchPackages" />
        <select v-model="filters.type" class="input-field max-w-xs" @change="fetchPackages">
          <option value="">Semua Tipe</option>
          <option value="tour">Tour</option>
          <option value="hotel">Hotel</option>
          <option value="flight">Penerbangan</option>
          <option value="combined">Kombinasi</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="text-left p-4 font-semibold text-gray-600">Nama Paket</th>
              <th class="text-left p-4 font-semibold text-gray-600">Destinasi</th>
              <th class="text-left p-4 font-semibold text-gray-600">Tipe</th>
              <th class="text-left p-4 font-semibold text-gray-600">Harga</th>
              <th class="text-left p-4 font-semibold text-gray-600">Durasi</th>
              <th class="text-left p-4 font-semibold text-gray-600">Status</th>
              <th class="text-left p-4 font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="7" class="p-8 text-center text-gray-400">Memuat...</td></tr>
            <tr v-else-if="!packages.length"><td colspan="7" class="p-8 text-center text-gray-400">Belum ada paket</td></tr>
            <tr v-for="pkg in packages" :key="pkg.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="p-4">
                <div class="font-semibold text-gray-900">{{ pkg.name }}</div>
                <div v-if="pkg.isFeatured" class="text-xs text-travel-sand font-medium mt-0.5">⭐ Unggulan</div>
              </td>
              <td class="p-4 text-gray-600">{{ pkg.destination }}</td>
              <td class="p-4"><span class="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg capitalize">{{ pkg.type }}</span></td>
              <td class="p-4">
                <div class="font-semibold">{{ formatIDR(pkg.discountPrice || pkg.basePrice) }}</div>
                <div v-if="pkg.discountPrice" class="text-xs text-gray-400 line-through">{{ formatIDR(pkg.basePrice) }}</div>
              </td>
              <td class="p-4 text-gray-600">{{ pkg.durationDays }}H{{ pkg.durationDays - 1 }}M</td>
              <td class="p-4">
                <span :class="pkg.isActive ? 'badge-paid' : 'badge-cancelled'">
                  {{ pkg.isActive ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex gap-2">
                  <RouterLink :to="`/admin/packages/${pkg.id}/edit`" class="text-xs btn-secondary py-1.5 px-3">Edit</RouterLink>
                  <button @click="deletePackage(pkg.id)" class="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition">Hapus</button>
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
import { usePackagesStore } from '@/stores/packages';
import { useFormatCurrency } from '@/composables/useFormatCurrency';

const store = usePackagesStore();
const { formatIDR } = useFormatCurrency();
const filters = ref({ destination: '', type: '' });
const packages = computed(() => store.packages);
const loading = computed(() => store.loading);

async function fetchPackages() {
  await store.fetchAll(filters.value);
}

async function deletePackage(id: string) {
  if (!confirm('Hapus paket ini?')) return;
  await store.remove(id);
  toast.success('Paket dihapus');
}

onMounted(fetchPackages);
</script>
