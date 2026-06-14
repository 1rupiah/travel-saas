<template>
  <div class="min-h-screen">
    <Navbar />

    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-travel-ocean min-h-[85vh] flex items-center">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-travel-sand rounded-full blur-3xl"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm font-medium mb-8 backdrop-blur-sm">
            <span class="w-2 h-2 bg-travel-sand rounded-full animate-pulse"></span>
            Platform Travel #1 di Indonesia
          </div>
          <h1 class="text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-6">
            Jelajahi Dunia<br />
            <span class="text-travel-sand">Tanpa Batas</span>
          </h1>
          <p class="text-xl text-primary-200 mb-10 leading-relaxed max-w-xl">
            Temukan ribuan paket wisata terbaik dari agen-agen travel terpercaya di seluruh Indonesia.
          </p>
          <div class="flex flex-wrap gap-4">
            <RouterLink to="/packages" class="inline-flex items-center gap-2 px-8 py-4 bg-travel-sand text-white font-bold rounded-2xl hover:bg-amber-600 transition-all text-lg">
              Lihat Semua Paket →
            </RouterLink>
            <RouterLink to="/auth/register-tenant" class="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all text-lg border border-white/20">
              Daftar Sebagai Agen
            </RouterLink>
          </div>
        </div>
      </div>
      <!-- Floating stats -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8 text-center text-white">
        <div class="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <div class="text-2xl font-display font-bold">500+</div>
          <div class="text-xs text-primary-200">Paket Wisata</div>
        </div>
        <div class="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <div class="text-2xl font-display font-bold">200+</div>
          <div class="text-xs text-primary-200">Agen Travel</div>
        </div>
        <div class="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <div class="text-2xl font-display font-bold">50K+</div>
          <div class="text-xs text-primary-200">Pelanggan Puas</div>
        </div>
      </div>
    </section>

    <!-- Featured Packages -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-display font-bold text-gray-900 mb-4">Paket Wisata Unggulan</h2>
          <p class="text-gray-500 text-lg">Destinasi terpopuler pilihan ribuan traveler</p>
        </div>
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="h-80 bg-gray-100 rounded-3xl animate-pulse"></div>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PackageCard v-for="pkg in featuredPackages" :key="pkg.id" :package="pkg" />
        </div>
        <div class="text-center mt-12">
          <RouterLink to="/packages" class="btn-primary text-base px-8 py-4">Lihat Semua Paket →</RouterLink>
        </div>
      </div>
    </section>

    <!-- How it Works -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-display font-bold text-gray-900 mb-4">Cara Pesan</h2>
          <p class="text-gray-500 text-lg">Mudah, cepat, dan terpercaya</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StepCard v-for="step in steps" :key="step.number" v-bind="step" />
        </div>
      </div>
    </section>

    <!-- CTA for agents -->
    <section class="py-20 bg-gradient-to-r from-primary-900 to-travel-ocean">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-display font-bold text-white mb-4">Punya Agen Travel?</h2>
        <p class="text-primary-200 text-xl mb-8 max-w-2xl mx-auto">Bergabung dengan platform kami dan kelola bisnis travel Anda lebih efisien dengan fitur multi-tenant kami.</p>
        <RouterLink to="/auth/register-tenant" class="inline-flex items-center gap-2 px-8 py-4 bg-travel-sand text-white font-bold rounded-2xl hover:bg-amber-600 transition-all text-lg">
          Mulai Gratis Sekarang →
        </RouterLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-display font-bold">T</div>
            <span class="font-display font-bold text-lg">TravelSaaS</span>
          </div>
          <p class="text-gray-400 text-sm">© {{ new Date().getFullYear() }} TravelSaaS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/layout/Navbar.vue';
import PackageCard from '@/components/package/PackageCard.vue';
import StepCard from '@/components/common/StepCard.vue';
import { usePackagesStore } from '@/stores/packages';

const store = usePackagesStore();
const loading = computed(() => store.loading);
const featuredPackages = computed(() => store.packages.slice(0, 6));

const steps = [
  { number: '01', title: 'Pilih Paket', description: 'Browse ratusan paket wisata dari berbagai agen terpercaya' },
  { number: '02', title: 'Isi Data', description: 'Lengkapi informasi penumpang dan tanggal keberangkatan' },
  { number: '03', title: 'Bayar', description: 'Bayar aman via transfer bank, kartu kredit, atau e-wallet' },
  { number: '04', title: 'Berangkat!', description: 'Terima konfirmasi dan nikmati perjalanan impian Anda' },
];

onMounted(() => store.fetchAll({ featured: true }));
</script>
