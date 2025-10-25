<script setup lang="ts">
import { ref } from 'vue'
import SideBarNav from './SideBarNav.vue'

const open = ref(false)

const navItems = {
  top: [
    { key: 1, label: 'Dashboard', icon: 'fa-user', route: '/' },
    { key: 2, label: 'Shipments', icon: 'fa-truck', route: '/shipments' },
    { key: 3, label: 'Reports', icon: 'fa-chart-bar', route: '/reports' },
  ],
  bottom: [
    { key: 4, label: 'Profile', icon: 'fa-user-circle', route: '/profile' },
    { key: 5, label: 'Settings', icon: 'fa-cog', route: '/settings' },
  ],
}
</script>

<template>
  <aside :class="['sidebar', { 'sidebar--open': open }]">
    <button class="sidebar__toggle" @click="open = !open">
      <VIcon v-if="open" icon="fa-angle-left" />
      <VIcon v-else icon="fa-angle-right" />
    </button>

    <img src="@/assets/img/logo.svg" class="sidebar__logo" alt="Dachser Logistics Logo" />
    <SideBarNav :items="navItems.top" :display-label="open" />
    <SideBarNav :items="navItems.bottom" class="bottom-nav" :display-label="open" />
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  position: relative;
  width: 3rem;
  background-color: var(--color-secondary);
  color: #fff;
  padding: 0 0 1.25rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0.125rem 0 0.25rem rgba(0, 0, 0, 0.1);
  transition:
    padding 0.3s ease,
    width 0.3s ease;

  &--open {
    padding: 0 1.25rem 1.25rem;
    width: 16rem;
  }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 1.25rem;
    left: 100%;
    transform: translateX(-50%);
    border-radius: 100%;
    width: 1.5rem;
    height: 1.5rem;
    background-color: #fff;
    color: var(--color-text);
    font-size: 0.75rem;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;

    &:hover {
      background-color: var(--color-primary);
      color: var(--color-secondary);
    }
  }

  &__logo {
    display: block;
    width: 100%;
    margin-bottom: 1.25rem;
  }

  .bottom-nav {
    margin-top: auto;
  }
}
</style>
