<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-display font-bold text-gray-900 mb-8">Profil Saya</h1>
      <div class="card space-y-5">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-display font-bold">
            {{ auth.user?.name?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <div class="font-display font-bold text-gray-900 text-xl">{{ auth.user?.name }}</div>
            <div class="text-gray-500 text-sm">{{ auth.user?.email }}</div>
          </div>
        </div>
        <hr />
        <form @submit.prevent="saveProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
            <input v-model="form.name" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">No. Telepon</label>
            <input v-model="form.phone" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Password Baru (opsional)</label>
            <input v-model="form.password" type="password" class="input-field" placeholder="Kosongkan jika tidak ingin ubah" />
          </div>
          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import Navbar from '@/components/layout/Navbar.vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/utils/api';

const auth = useAuthStore();
const loading = ref(false);
const form = ref({ name: auth.user?.name || '', phone: auth.user?.phone || '', password: '' });

async function saveProfile() {
  loading.value = true;
  try {
    const data: any = { name: form.value.name, phone: form.value.phone };
    if (form.value.password) data.password = form.value.password;
    await api.put('/users/me', data);
    toast.success('Profil berhasil disimpan');
    form.value.password = '';
  } catch { toast.error('Gagal menyimpan'); } finally { loading.value = false; }
}
</script>
