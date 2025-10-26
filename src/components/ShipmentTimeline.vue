<script setup lang="ts">
import type { Shipment } from '@/api/shipments'
import { ref, computed } from 'vue'

const { shipment } = defineProps<{ shipment: Shipment }>()

const simulatedTimeMinutes = ref(0)

const simulatedTime = computed(() => {
  const hours = Math.floor(simulatedTimeMinutes.value / 60)
  const minutes = simulatedTimeMinutes.value % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
})

const startingTimeMinutes =
  shipment.startingTime.getHours() * 60 + shipment.startingTime.getMinutes()

const STATUSES = {
  toBeShipped: { label: 'To be shipped', color: 'blue-grey' },
  inTransit: { label: 'In transit', color: 'blue' },
  stopped: { label: 'Stopped', color: 'orange' },
  delivered: { label: 'Delivered', color: 'green' },
} as const

const status = computed(() => {
  if (simulatedTimeMinutes.value < startingTimeMinutes) return STATUSES.toBeShipped
  return STATUSES.inTransit
})
</script>

<template>
  <div class="shipment-timeline">
    <div class="d-flex align-center mb-4">
      <label class="mr-2 mb-0 font-weight-bold">Simulated time: {{ simulatedTime }}</label>

      <VSlider
        v-model="simulatedTimeMinutes"
        :min="0"
        :max="1440"
        :step="1"
        color="secondary"
        hide-details
      />
    </div>

    <VCard :title="`Shipment ${shipment.id}`" :subtitle="shipment.product">
      <template #append>
        <VChip :color="status.color" :text="status.label" variant="elevated" />
      </template>

      <template #text>
        {{ simulatedTimeMinutes }}
        {{ startingTimeMinutes }}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam
        aliquet, nisl nisl aliquet nisl, eget aliquam nisl nisl eget nisl.
      </template>
    </VCard>
  </div>
</template>
