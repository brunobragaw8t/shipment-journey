<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { onMounted } from 'vue'

const route = useRoute()

const breadcrumbs = computed(() => {
  return route.matched.reduce<{ title: string; to: string }[]>((acc, curr) => {
    if (!curr.meta.breadcrumb) return acc

    acc.push({
      title: curr.meta.breadcrumb as string,
      to: curr.path,
    })

    return acc
  }, [])
})

onMounted(() => {
  if (route.path === '/') {
    useRouter().push('/dashboard')
  }
})
</script>

<template>
  <div class="layout">
    <SideBar />

    <main class="main">
      <header class="top-bar">
        <div class="top-bar__content">
          <VBreadcrumbs :items="breadcrumbs" />
        </div>
      </header>

      <div class="content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.top-bar {
  display: none;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-bar {
  background-color: #ecf0f1;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.top-bar__content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.top-bar__title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
  overflow-y: auto;
}

@media (min-width: 576px) {
  .top-bar {
    display: block;
  }
}
</style>
