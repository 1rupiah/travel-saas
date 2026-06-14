<template>
  <div class="flex min-h-screen bg-gray-50">
    <AdminSidebar />
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '@/components/layout/AdminSidebar.vue';
</script>
