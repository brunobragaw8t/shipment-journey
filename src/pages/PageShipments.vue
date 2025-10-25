<script setup lang="ts">
import LayoutDefault from '@/layouts/LayoutDefault.vue'

const items = [
  { id: 1, product: 'Pallet (200 kg)', status: 'In Transit' },
  { id: 2, product: 'Item 2', status: 'Delivered' },
  { id: 3, product: 'Item 3', status: 'In Transit' },
]

type TableColumnKey = keyof (typeof items)[number] | 'actions'

type TableHeader = {
  title: string
  key: TableColumnKey
  sortable: boolean
}

const headers: TableHeader[] = [
  { title: 'Name', key: 'product', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]
</script>

<template>
  <LayoutDefault>
    <h1 class="mb-4">Shipments</h1>

    <VDataTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <RouterLink :to="`/shipments/${item.id}`">
          <VBtn icon="fa-eye" variant="outlined" color="secondary" size="x-small" />
        </RouterLink>
      </template>
    </VDataTable>
  </LayoutDefault>
</template>
