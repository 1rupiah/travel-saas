<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <div class="bg-gradient-to-r from-primary-900 to-travel-ocean py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-display font-bold text-white mb-4">Semua Paket Wisata</h1>
        <p class="text-primary-200 text-lg">Temukan paket impian Anda</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Filter Bar -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8">
        <div class="flex flex-wrap gap-4">
          <input v-model="filters.destination" @input="applyFilters" placeholder="🔍 Cari destinasi..."
            class="input-field max-w-xs" />
          <select v-model="filters.type" @change="applyFilters" class="input-field max-w-48">
            <option value="">Semua Tipe</option>
            <option value="tour">Tour</option>
            <option value="hotel">Hotel</option>
            <option value="flight">Penerbangan</option>
            <option value="combined">Kombinasi</option>
          </select>
          <label class="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer">
            <input v-model="filters.featured" type="checkbox" @change="applyFilters" class="rounded text-primary-600" />
            Hanya Unggulan
          </label>
        </div>
      </div>

      <!-- Grid -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="h-80 bg-gray-100 rounded-3xl animate-pulse"></div>
      </div>
      <div v-else-if="!packages.length" class="text-center py-20 text-gray-400">
        <div class="text-6xl mb-4">🔍</div>
        <p class="text-lg">Tidak ada paket yang cocok dengan filter Anda</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PackageCard v-for="pkg in packages" :key="pkg.id" :package="pkg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/layout/Navbar.vue';
import PackageCard from '@/components/package/PackageCard.vue';
import { usePackagesStore } from '@/stores/packages';

const store = usePackagesStore();
const packages = computed(() => store.packages);
const loading = computed(() => store.loading);
const filters = ref({ destination: '', type: '', featured: false });

async function applyFilters() {
  await store.fetchAll({
    destination: filters.value.destination || undefined,
    type: filters.value.type || undefined,
    featured: filters.value.featured || undefined,
  });
}

onMounted(applyFilters);
</script>
