<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-display font-bold text-gray-900">Pengguna</h1>
        <p class="text-gray-500 mt-1">Kelola staff dan pelanggan</p>
      </div>
      <button @click="showAddStaff = true" class="btn-primary">+ Tambah Staff</button>
    </div>

    <div class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="text-left p-4 font-semibold text-gray-600">Nama</th>
              <th class="text-left p-4 font-semibold text-gray-600">Email</th>
              <th class="text-left p-4 font-semibold text-gray-600">Telepon</th>
              <th class="text-left p-4 font-semibold text-gray-600">Role</th>
              <th class="text-left p-4 font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="5" class="p-8 text-center text-gray-400">Memuat...</td></tr>
            <tr v-else-if="!users.length"><td colspan="5" class="p-8 text-center text-gray-400">Belum ada pengguna</td></tr>
            <tr v-for="user in users" :key="user.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="p-4 font-medium">{{ user.name }}</td>
              <td class="p-4 text-gray-600">{{ user.email }}</td>
              <td class="p-4 text-gray-600">{{ user.phone || '-' }}</td>
              <td class="p-4"><span class="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg capitalize">{{ user.role.replace('_', ' ') }}</span></td>
              <td class="p-4"><span :class="user.isActive ? 'badge-paid' : 'badge-cancelled'">{{ user.isActive ? 'Aktif' : 'Nonaktif' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Staff Modal -->
    <div v-if="showAddStaff" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl p-8 w-full max-w-md">
        <h2 class="font-display font-bold text-xl mb-6">Tambah Staff</h2>
        <form @submit.prevent="addStaff" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nama</label>
            <input v-model="staffForm.name" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input v-model="staffForm.email" type="email" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input v-model="staffForm.password" type="password" required minlength="8" class="input-field" />
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit" :disabled="addLoading" class="btn-primary flex-1 justify-center">
              {{ addLoading ? 'Menyimpan...' : 'Tambah Staff' }}
            </button>
            <button type="button" @click="showAddStaff = false" class="btn-secondary flex-1 justify-center">Batal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import api from '@/utils/api';

const users = ref<any[]>([]);
const loading = ref(false);
const showAddStaff = ref(false);
const addLoading = ref(false);
const staffForm = ref({ name: '', email: '', password: '' });

async function fetchUsers() {
  loading.value = true;
  try {
    const res = await api.get('/users');
    users.value = res.data;
  } finally { loading.value = false; }
}

async function addStaff() {
  addLoading.value = true;
  try {
    const res = await api.post('/users/staff', staffForm.value);
    users.value.unshift(res.data);
    toast.success('Staff berhasil ditambahkan');
    showAddStaff.value = false;
    staffForm.value = { name: '', email: '', password: '' };
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Gagal menambah staff');
  } finally { addLoading.value = false; }
}

onMounted(fetchUsers);
</script>
