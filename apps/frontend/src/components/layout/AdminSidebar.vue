<template>
  <aside class="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
    <div class="p-6 border-b border-gray-800">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
          <span class="font-display font-bold">T</span>
        </div>
        <div>
          <div class="font-display font-bold text-sm">TravelSaaS</div>
          <div class="text-xs text-gray-400">{{ auth.user?.role === 'super_admin' ? 'Super Admin' : 'Admin Panel' }}</div>
        </div>
      </div>
    </div>

    <nav class="flex-1 p-4 space-y-1">
      <SidebarLink to="/admin/dashboard" :icon="HomeIcon" label="Dashboard" />
      <SidebarLink to="/admin/packages" :icon="TagIcon" label="Paket Wisata" />
      <SidebarLink to="/admin/bookings" :icon="CalendarIcon" label="Booking" />
      <SidebarLink to="/admin/users" :icon="UsersIcon" label="Pengguna" />
      <SidebarLink to="/admin/reports" :icon="ChartBarIcon" label="Laporan" />
      <SidebarLink to="/admin/settings" :icon="CogIcon" label="Pengaturan" />
    </nav>

    <div class="p-4 border-t border-gray-800">
      <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition cursor-pointer" @click="handleLogout">
        <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
          {{ auth.user?.name?.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium truncate">{{ auth.user?.name }}</div>
          <div class="text-xs text-gray-400 truncate">{{ auth.user?.email }}</div>
        </div>
        <ArrowRightOnRectangleIcon class="w-4 h-4 text-gray-400" />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { HomeIcon, TagIcon, CalendarIcon, UsersIcon, ChartBarIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push('/auth/login');
}
</script>

<script lang="ts">
import { defineComponent, h } from 'vue';
import { RouterLink, useLink } from 'vue-router';

const SidebarLink = defineComponent({
  props: { to: String, icon: Object, label: String },
  setup(props) {
    const { isActive } = useLink({ to: props.to! });
    return () => h(RouterLink, { to: props.to!, class: ['flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition', isActive.value ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'] }, () => [
      h(props.icon!, { class: 'w-5 h-5' }),
      props.label,
    ]);
  },
});
</script>
