<template>
  <div class="card hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">{{ title }}</p>
        <p class="text-2xl font-display font-bold text-gray-900 mt-1">{{ value }}</p>
      </div>
      <span class="text-2xl">{{ icon }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; value: string | number; color?: string; icon?: string; isCurrency?: boolean }>();
</script>
