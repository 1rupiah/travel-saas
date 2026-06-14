import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { TravelPackage } from '@/types';

export const usePackagesStore = defineStore('packages', () => {
  const packages = ref<TravelPackage[]>([]);
  const current = ref<TravelPackage | null>(null);
  const loading = ref(false);

  async function fetchAll(filters?: any) {
    loading.value = true;
    try {
      const res = await api.get('/packages', { params: filters });
      packages.value = res.data;
    } finally { loading.value = false; }
  }

  async function fetchOne(id: string) {
    loading.value = true;
    try {
      const res = await api.get(`/packages/${id}`);
      current.value = res.data;
    } finally { loading.value = false; }
  }

  async function create(data: Partial<TravelPackage>) {
    const res = await api.post('/packages', data);
    packages.value.unshift(res.data);
    return res.data;
  }

  async function update(id: string, data: Partial<TravelPackage>) {
    const res = await api.put(`/packages/${id}`, data);
    const idx = packages.value.findIndex(p => p.id === id);
    if (idx !== -1) packages.value[idx] = res.data;
    return res.data;
  }

  async function remove(id: string) {
    await api.delete(`/packages/${id}`);
    packages.value = packages.value.filter(p => p.id !== id);
  }

  return { packages, current, loading, fetchAll, fetchOne, create, update, remove };
});
