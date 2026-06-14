<template>
  <div class="p-8 max-w-4xl">
    <div class="flex items-center gap-4 mb-8">
      <RouterLink to="/admin/packages" class="btn-secondary py-2 px-3 text-sm">← Kembali</RouterLink>
      <div>
        <h1 class="text-2xl font-display font-bold text-gray-900">{{ isEdit ? 'Edit Paket' : 'Tambah Paket Baru' }}</h1>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Info -->
      <div class="card space-y-4">
        <h2 class="font-display font-bold text-gray-900">Informasi Dasar</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nama Paket *</label>
            <input v-model="form.name" required class="input-field" placeholder="Bali Paradise 4D3N" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Tipe *</label>
            <select v-model="form.type" class="input-field">
              <option value="tour">Tour</option>
              <option value="hotel">Hotel</option>
              <option value="flight">Penerbangan</option>
              <option value="combined">Kombinasi</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Destinasi *</label>
            <input v-model="form.destination" required class="input-field" placeholder="Bali, Indonesia" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Harga Normal (IDR) *</label>
            <input v-model.number="form.basePrice" type="number" required min="0" class="input-field" placeholder="3500000" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Harga Diskon (IDR)</label>
            <input v-model.number="form.discountPrice" type="number" min="0" class="input-field" placeholder="Kosongkan jika tidak ada diskon" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Durasi (Hari)</label>
            <input v-model.number="form.durationDays" type="number" min="1" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Min. Pax</label>
            <input v-model.number="form.minPax" type="number" min="1" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Max. Pax</label>
            <input v-model.number="form.maxPax" type="number" min="1" class="input-field" placeholder="Kosongkan jika tidak ada batas" />
          </div>
          <div class="flex gap-6 items-center pt-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.isActive" type="checkbox" class="w-4 h-4 rounded text-primary-600" />
              <span class="text-sm font-medium text-gray-700">Paket Aktif</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.isFeatured" type="checkbox" class="w-4 h-4 rounded text-primary-600" />
              <span class="text-sm font-medium text-gray-700">Paket Unggulan</span>
            </label>
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Deskripsi *</label>
          <textarea v-model="form.description" required rows="4" class="input-field resize-none" placeholder="Deskripsi lengkap paket wisata..."></textarea>
        </div>
      </div>

      <!-- Includes/Excludes -->
      <div class="card space-y-4">
        <h2 class="font-display font-bold text-gray-900">Fasilitas</h2>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Sudah Termasuk</label>
            <div class="space-y-2">
              <div v-for="(item, i) in form.includes" :key="i" class="flex gap-2">
                <input v-model="form.includes[i]" class="input-field text-sm py-2" placeholder="Contoh: Hotel bintang 3" />
                <button type="button" @click="form.includes.splice(i,1)" class="text-red-400 hover:text-red-600">✕</button>
              </div>
              <button type="button" @click="form.includes.push('')" class="text-sm text-primary-600 hover:text-primary-700 font-medium">+ Tambah</button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Tidak Termasuk</label>
            <div class="space-y-2">
              <div v-for="(item, i) in form.excludes" :key="i" class="flex gap-2">
                <input v-model="form.excludes[i]" class="input-field text-sm py-2" placeholder="Contoh: Tiket pesawat" />
                <button type="button" @click="form.excludes.splice(i,1)" class="text-red-400 hover:text-red-600">✕</button>
              </div>
              <button type="button" @click="form.excludes.push('')" class="text-sm text-primary-600 hover:text-primary-700 font-medium">+ Tambah</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Itinerary -->
      <div class="card space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-display font-bold text-gray-900">Itinerary</h2>
          <button type="button" @click="addDay" class="btn-secondary text-sm py-2">+ Tambah Hari</button>
        </div>
        <div v-for="(day, i) in form.itinerary" :key="i" class="border border-gray-100 rounded-xl p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-primary-600 text-sm">Hari {{ day.day }}</span>
            <button type="button" @click="form.itinerary.splice(i,1)" class="text-red-400 hover:text-red-600 text-sm">Hapus</button>
          </div>
          <input v-model="day.title" class="input-field text-sm py-2" placeholder="Judul hari (cth: Arrival & Tanah Lot)" />
          <div class="space-y-2">
            <div v-for="(act, j) in day.activities" :key="j" class="flex gap-2">
              <input v-model="day.activities[j]" class="input-field text-sm py-2" placeholder="Aktivitas..." />
              <button type="button" @click="day.activities.splice(j,1)" class="text-red-400 hover:text-red-600 text-sm">✕</button>
            </div>
            <button type="button" @click="day.activities.push('')" class="text-xs text-gray-500 hover:text-primary-600">+ aktivitas</button>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex gap-4">
        <button type="submit" :disabled="loading" class="btn-primary px-8 py-3">
          {{ loading ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Buat Paket') }}
        </button>
        <RouterLink to="/admin/packages" class="btn-secondary py-3">Batal</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { usePackagesStore } from '@/stores/packages';

const route = useRoute();
const router = useRouter();
const store = usePackagesStore();
const loading = ref(false);
const isEdit = computed(() => !!route.params.id);

const form = ref({
  name: '', type: 'tour', destination: '', description: '',
  basePrice: 0, discountPrice: null as number | null,
  durationDays: 1, minPax: 1, maxPax: null as number | null,
  isActive: true, isFeatured: false,
  includes: [''] as string[], excludes: [''] as string[],
  itinerary: [] as any[], images: [] as string[],
});

function addDay() {
  form.value.itinerary.push({ day: form.value.itinerary.length + 1, title: '', activities: [''] });
}

async function handleSubmit() {
  loading.value = true;
  try {
    const data = {
      ...form.value,
      includes: form.value.includes.filter(Boolean),
      excludes: form.value.excludes.filter(Boolean),
      discountPrice: form.value.discountPrice || null,
    };
    if (isEdit.value) {
      await store.update(route.params.id as string, data);
      toast.success('Paket berhasil diperbarui');
    } else {
      await store.create(data);
      toast.success('Paket berhasil dibuat');
    }
    router.push('/admin/packages');
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Gagal menyimpan paket');
  } finally { loading.value = false; }
}

onMounted(async () => {
  if (isEdit.value) {
    await store.fetchOne(route.params.id as string);
    const pkg = store.current;
    if (pkg) {
      Object.assign(form.value, {
        ...pkg,
        includes: pkg.includes?.length ? pkg.includes : [''],
        excludes: pkg.excludes?.length ? pkg.excludes : [''],
        itinerary: pkg.itinerary || [],
      });
    }
  }
});
</script>
