<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 flex items-center justify-center p-4">
    <div class="w-full max-w-lg">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-display font-bold text-white">Daftarkan Agen Travel Anda</h1>
        <p class="text-gray-300 mt-2">Mulai kelola bisnis travel Anda dengan platform kami</p>
      </div>

      <div class="bg-white rounded-3xl shadow-2xl p-8">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nama PIC</label>
              <input v-model="form.name" required class="input-field" placeholder="Nama Anda" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nama Perusahaan</label>
              <input v-model="form.companyName" required class="input-field" placeholder="PT. Maju Travel" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Slug (subdomain)</label>
            <div class="flex items-center">
              <input v-model="form.slug" required class="input-field rounded-r-none" placeholder="nama-agen" @input="sanitizeSlug" />
              <span class="px-3 py-3 bg-gray-100 border border-l-0 border-gray-200 rounded-r-xl text-sm text-gray-500">.travelsaas.com</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input v-model="form.email" type="email" required class="input-field" placeholder="admin@perusahaan.com" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">No. Telepon</label>
            <input v-model="form.phone" class="input-field" placeholder="08123456789" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input v-model="form.password" type="password" required minlength="8" class="input-field" placeholder="Min. 8 karakter" />
          </div>
          <button type="submit" :disabled="loading" class="btn-primary w-full justify-center py-3 mt-2">
            {{ loading ? 'Mendaftar...' : 'Buat Akun Agen' }}
          </button>
        </form>
        <div class="mt-4 text-center text-sm text-gray-500">
          Sudah punya akun? <RouterLink to="/auth/login" class="text-primary-600 font-semibold hover:underline">Masuk</RouterLink>
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
const form = ref({ name: '', companyName: '', slug: '', email: '', phone: '', password: '' });

function sanitizeSlug() {
  form.value.slug = form.value.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

async function handleRegister() {
  loading.value = true;
  try {
    await auth.registerTenant(form.value);
    toast.success('Akun agen berhasil dibuat!');
    router.push('/admin/dashboard');
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Registrasi gagal');
  } finally { loading.value = false; }
}
</script>
