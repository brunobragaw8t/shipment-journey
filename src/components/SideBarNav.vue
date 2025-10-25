<script setup lang="ts">
withDefaults(
  defineProps<{
    items: {
      key: string | number
      label: string
      icon: string
      route: string
    }[]
    displayLabel: boolean
  }>(),
  {
    displayLabel: true,
  },
)
</script>

<template>
  <nav class="sidebar-nav">
    <ul>
      <li v-for="item in items" :key="item.key">
        <router-link
          :to="item.route"
          :class="['sidebar-nav__item', { 'sidebar-nav__item--display-label': displayLabel }]"
        >
          <VIcon :icon="item.icon" class="sidebar-nav__icon" />
          <span class="sidebar-nav__label">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.sidebar-nav {
  overflow: hidden;

  ul {
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    transition: background-color 0.3s;
    text-decoration: none;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &--display-label {
      justify-content: flex-start;
    }
  }

  &__icon,
  &__label {
    color: #fff;
    font-size: 1rem;
  }

  &__label {
    display: none;
  }

  &__icon {
    height: 1.5rem;
  }

  &__item--display-label &__label {
    display: block;
  }

  &__item.router-link-active &__icon,
  &__item.router-link-active &__label {
    color: var(--color-primary);
  }
}
</style>
