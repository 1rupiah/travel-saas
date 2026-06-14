<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <div v-if="loading" class="flex items-center justify-center h-96">
      <div class="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="pkg">
      <!-- Hero Image -->
      <div class="relative h-80 bg-gradient-to-br from-primary-500 to-travel-ocean">
        <img v-if="pkg.images?.[0]" :src="pkg.images[0]" :alt="pkg.name" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-8xl">🏝️</div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div class="absolute bottom-6 left-8 text-white">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm capitalize">{{ pkg.type }}</span>
            <span v-if="pkg.isFeatured" class="px-3 py-1 bg-travel-sand/80 rounded-full text-sm">⭐ Unggulan</span>
          </div>
          <h1 class="text-3xl font-display font-bold">{{ pkg.name }}</h1>
          <p class="text-white/80 mt-1">📍 {{ pkg.destination }} · {{ pkg.durationDays }}H{{ pkg.durationDays - 1 }}M · Min. {{ pkg.minPax }} pax</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <div class="card">
              <h2 class="font-display font-bold text-gray-900 text-xl mb-3">Deskripsi</h2>
              <p class="text-gray-600 leading-relaxed">{{ pkg.description }}</p>
            </div>

            <div v-if="pkg.includes?.length || pkg.excludes?.length" class="card">
              <h2 class="font-display font-bold text-gray-900 text-xl mb-4">Fasilitas</h2>
              <div class="grid grid-cols-2 gap-6">
                <div v-if="pkg.includes?.length">
                  <h3 class="font-semibold text-travel-forest mb-3 flex items-center gap-2">✅ Sudah Termasuk</h3>
                  <ul class="space-y-2">
                    <li v-for="item in pkg.includes" :key="item" class="text-sm text-gray-600 flex items-start gap-2">
                      <span class="text-travel-forest mt-0.5">•</span> {{ item }}
                    </li>
                  </ul>
                </div>
                <div v-if="pkg.excludes?.length">
                  <h3 class="font-semibold text-red-500 mb-3 flex items-center gap-2">❌ Tidak Termasuk</h3>
                  <ul class="space-y-2">
                    <li v-for="item in pkg.excludes" :key="item" class="text-sm text-gray-600 flex items-start gap-2">
                      <span class="text-red-400 mt-0.5">•</span> {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-if="pkg.itinerary?.length" class="card">
              <h2 class="font-display font-bold text-gray-900 text-xl mb-4">Itinerary</h2>
              <div class="space-y-4">
                <div v-for="day in pkg.itinerary" :key="day.day" class="border-l-4 border-primary-200 pl-4">
                  <div class="font-semibold text-primary-700 text-sm mb-1">Hari {{ day.day }}: {{ day.title }}</div>
                  <ul class="space-y-1">
                    <li v-for="act in day.activities" :key="act" class="text-sm text-gray-600 flex items-center gap-2">
                      <span class="w-1.5 h-1.5 bg-primary-400 rounded-full flex-shrink-0"></span> {{ act }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Sidebar -->
          <div class="lg:col-span-1">
            <div class="card sticky top-24">
              <div class="mb-4">
                <div class="text-3xl font-display font-bold text-primary-600">
                  {{ formatIDR(pkg.discountPrice || pkg.basePrice) }}
                </div>
                <div v-if="pkg.discountPrice" class="text-sm text-gray-400 line-through">{{ formatIDR(pkg.basePrice) }}</div>
                <div class="text-sm text-gray-500">/pax</div>
              </div>

              <div class="space-y-3 mb-6 py-4 border-t border-b border-gray-100">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Durasi</span>
                  <span class="font-semibold">{{ pkg.durationDays }} Hari {{ pkg.durationDays - 1 }} Malam</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Min. Pax</span>
                  <span class="font-semibold">{{ pkg.minPax }} orang</span>
                </div>
                <div v-if="pkg.maxPax" class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Max. Pax</span>
                  <span class="font-semibold">{{ pkg.maxPax }} orang</span>
                </div>
              </div>

              <RouterLink :to="`/book/${pkg.id}`" class="btn-primary w-full justify-center py-4 text-base">
                Pesan Sekarang
              </RouterLink>
              <p class="text-xs text-gray-400 text-center mt-3">Tidak ada biaya tersembunyi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/layout/Navbar.vue';
import { usePackagesStore } from '@/stores/packages';
import { useFormatCurrency } from '@/composables/useFormatCurrency';

const route = useRoute();
const store = usePackagesStore();
const { formatIDR } = useFormatCurrency();
const pkg = computed(() => store.current);
const loading = computed(() => store.loading);

onMounted(() => store.fetchOne(route.params.id as string));
</script>
