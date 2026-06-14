<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-travel-ocean flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <RouterLink to="/" class="inline-flex items-center gap-2 text-white mb-6">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span class="font-display font-bold text-lg">T</span>
          </div>
          <span class="font-display font-bold text-2xl">TravelSaaS</span>
        </RouterLink>
        <h1 class="text-2xl font-display font-bold text-white">Selamat Datang Kembali</h1>
        <p class="text-primary-200 mt-1 text-sm">Masuk ke akun Anda</p>
      </div>

      <div class="bg-white rounded-3xl shadow-2xl p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input v-model="form.email" type="email" required placeholder="email@example.com" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input v-model="form.password" type="password" required placeholder="••••••••" class="input-field" />
          </div>
          <button type="submit" :disabled="loading" class="btn-primary w-full justify-center py-3 text-base">
            <span v-if="loading">Memuat...</span>
            <span v-else>Masuk</span>
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?
          <RouterLink to="/auth/register" class="text-primary-600 font-semibold hover:underline ml-1">Daftar sekarang</RouterLink>
        </div>
        <div class="mt-2 text-center text-sm text-gray-500">
          Ingin buat agen travel?
          <RouterLink to="/auth/register-tenant" class="text-travel-sand font-semibold hover:underline ml-1">Daftar sebagai agen</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);
const form = ref({ email: '', password: '' });

async function handleLogin() {
  loading.value = true;
  try {
    await auth.login(form.value.email, form.value.password);
    toast.success('Berhasil masuk!');
    router.push(auth.isAdmin ? '/admin/dashboard' : '/my/bookings');
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Email atau password salah');
  } finally { loading.value = false; }
}
</script>
