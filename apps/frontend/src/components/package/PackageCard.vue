<template>
  <RouterLink :to="`/packages/${pkg.id}`"
    class="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block">
    <div class="relative h-48 bg-gradient-to-br from-primary-400 to-travel-ocean overflow-hidden">
      <img v-if="pkg.images?.[0]" :src="pkg.images[0]" :alt="pkg.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div v-else class="w-full h-full flex items-center justify-center text-6xl">
        {{ destinationEmoji }}
      </div>
      <div v-if="pkg.isFeatured" class="absolute top-3 left-3 px-3 py-1 bg-travel-sand text-white text-xs font-bold rounded-full">
        ⭐ Unggulan
      </div>
      <div class="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-bold rounded-full capitalize">
        {{ pkg.type }}
      </div>
    </div>
    <div class="p-5">
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="font-display font-bold text-gray-900 group-hover:text-primary-700 transition">{{ pkg.name }}</h3>
      </div>
      <p class="text-sm text-gray-500 mb-3 flex items-center gap-1">
        📍 {{ pkg.destination }} · {{ pkg.durationDays }}H{{ pkg.durationDays - 1 }}M
      </p>
      <p class="text-xs text-gray-400 line-clamp-2 mb-4">{{ pkg.description }}</p>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xl font-display font-bold text-primary-600">
            {{ formatIDR(pkg.discountPrice || pkg.basePrice) }}
          </div>
          <div v-if="pkg.discountPrice" class="text-xs text-gray-400 line-through">{{ formatIDR(pkg.basePrice) }}</div>
          <div class="text-xs text-gray-400">/pax</div>
        </div>
        <div class="text-sm text-primary-600 font-semibold group-hover:text-primary-700">
          Lihat Detail →
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TravelPackage } from '@/types';
import { useFormatCurrency } from '@/composables/useFormatCurrency';

const props = defineProps<{ package: TravelPackage }>();
const pkg = props.package;
const { formatIDR } = useFormatCurrency();

const destinationEmoji = computed(() => {
  const d = pkg.destination.toLowerCase();
  if (d.includes('bali')) return '🏝️';
  if (d.includes('lombok') || d.includes('gili')) return '🌊';
  if (d.includes('raja ampat')) return '🐠';
  if (d.includes('jawa') || d.includes('yogya') || d.includes('jogja')) return '🏯';
  if (d.includes('komodo')) return '🦎';
  return '✈️';
});
</script>
