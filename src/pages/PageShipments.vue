<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type Shipment, shipmentsApi } from '@/api/shipments'

type TableHeader = {
  title: string
  key: keyof Shipment | 'actions'
  sortable: boolean
}

const headers: TableHeader[] = [
  { title: 'Name', key: 'product', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

const items = ref<Shipment[]>([])
const itemsLoading = ref(true)

async function fetchShipments(): Promise<Shipment[]> {
  return await shipmentsApi.getShipments()
}

onMounted(async () => {
  items.value = await fetchShipments()
  itemsLoading.value = false
})
</script>

<template>
  <h1 class="mb-4">Shipments</h1>

  <VDataTable :headers="headers" :items="items" :loading="itemsLoading">
    <template #loading>
      <VSkeletonLoader type="table-row@10" />
    </template>

    <template #item.actions="{ item }">
      <RouterLink :to="`/shipments/${item.id}`">
        <VBtn icon="fa-eye" variant="outlined" color="secondary" size="x-small" />
      </RouterLink>
    </template>
  </VDataTable>
</template>
