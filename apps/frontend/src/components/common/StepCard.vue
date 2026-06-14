<template>
  <div class="text-center">
    <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <span class="font-display font-bold text-white text-xl">{{ number }}</span>
    </div>
    <h3 class="font-display font-bold text-gray-900 text-lg mb-2">{{ title }}</h3>
    <p class="text-gray-500 text-sm leading-relaxed">{{ description }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{ number: string; title: string; description: string }>();
</script>
