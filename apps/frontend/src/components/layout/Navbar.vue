<template>
  <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-display font-bold text-sm">T</span>
          </div>
          <span class="font-display font-bold text-lg text-gray-900">TravelSaaS</span>
        </RouterLink>

        <div class="hidden md:flex items-center gap-8">
          <RouterLink to="/packages" class="text-sm font-medium text-gray-600 hover:text-primary-600 transition">Paket Wisata</RouterLink>
          <RouterLink to="/#about" class="text-sm font-medium text-gray-600 hover:text-primary-600 transition">Tentang Kami</RouterLink>
          <RouterLink to="/#contact" class="text-sm font-medium text-gray-600 hover:text-primary-600 transition">Kontak</RouterLink>
        </div>

        <div class="flex items-center gap-3">
          <template v-if="auth.isLoggedIn">
            <RouterLink v-if="auth.isAdmin" to="/admin/dashboard" class="btn-primary text-sm py-2">
              Dashboard
            </RouterLink>
            <RouterLink v-else to="/my/bookings" class="btn-secondary text-sm py-2">
              Booking Saya
            </RouterLink>
            <button @click="handleLogout" class="text-sm text-gray-500 hover:text-red-600 transition">Keluar</button>
          </template>
          <template v-else>
            <RouterLink to="/auth/login" class="btn-secondary text-sm py-2">Masuk</RouterLink>
            <RouterLink to="/auth/register" class="btn-primary text-sm py-2">Daftar</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
const auth = useAuthStore();
const router = useRouter();
function handleLogout() {
  auth.logout();
  router.push('/');
}
</script>
