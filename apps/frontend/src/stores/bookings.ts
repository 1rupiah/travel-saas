import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { Booking } from '@/types';

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref<Booking[]>([]);
  const current = ref<Booking | null>(null);
  const loading = ref(false);

  async function fetchAll(filters?: any) {
    loading.value = true;
    try {
      const res = await api.get('/bookings', { params: filters });
      bookings.value = res.data;
    } finally { loading.value = false; }
  }

  async function fetchOne(id: string) {
    loading.value = true;
    try {
      const res = await api.get(`/bookings/${id}`);
      current.value = res.data;
    } finally { loading.value = false; }
  }

  async function create(data: any) {
    const res = await api.post('/bookings', data);
    return res.data;
  }

  async function updateStatus(id: string, status: string) {
    const res = await api.put(`/bookings/${id}/status`, { status });
    const idx = bookings.value.findIndex(b => b.id === id);
    if (idx !== -1) bookings.value[idx] = res.data;
    return res.data;
  }

  async function cancel(id: string) {
    const res = await api.put(`/bookings/${id}/cancel`);
    const idx = bookings.value.findIndex(b => b.id === id);
    if (idx !== -1) bookings.value[idx] = res.data;
    return res.data;
  }

  return { bookings, current, loading, fetchAll, fetchOne, create, updateStatus, cancel };
});
