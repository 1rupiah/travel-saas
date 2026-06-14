import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('access_token'));

  const isLoggedIn = computed(() => !!token.value);
  const isSuperAdmin = computed(() => user.value?.role === 'super_admin');
  const isTenantAdmin = computed(() => user.value?.role === 'tenant_admin');
  const isStaff = computed(() => user.value?.role === 'staff');
  const isAdmin = computed(() => ['super_admin', 'tenant_admin', 'staff'].includes(user.value?.role || ''));

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    token.value = res.data.accessToken;
    user.value = res.data.user;
    localStorage.setItem('access_token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  }

  async function register(data: any) {
    const res = await api.post('/auth/register', data);
    token.value = res.data.accessToken;
    user.value = res.data.user;
    localStorage.setItem('access_token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  }

  async function registerTenant(data: any) {
    const res = await api.post('/auth/register-tenant', data);
    token.value = res.data.accessToken;
    user.value = res.data.user;
    localStorage.setItem('access_token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  return { user, token, isLoggedIn, isSuperAdmin, isTenantAdmin, isStaff, isAdmin, login, register, registerTenant, logout };
});
