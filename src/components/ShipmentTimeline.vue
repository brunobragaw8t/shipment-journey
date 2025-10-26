<script setup lang="ts">
import type { Shipment } from '@/api/shipments'
import { ref, computed } from 'vue'
import { SHIPMENT_STATUSES, type ShipmentStatus } from '@/constants/shipment-statuses'
import { getShipmentTotals } from '@/utils/shipments'

const { shipment } = defineProps<{ shipment: Shipment }>()

const simulatedTimeMinutes = ref(0)
const simulatedTime = computed(() => {
  const hours = Math.floor(simulatedTimeMinutes.value / 60)
  const minutes = simulatedTimeMinutes.value % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
})

const startingTimeMinutes =
  shipment.startingTime.getHours() * 60 + shipment.startingTime.getMinutes()
const { totalDurationMinutes } = getShipmentTotals(shipment)
const arrivalTimeMinutes = startingTimeMinutes + totalDurationMinutes

const timeline: Record<number, ShipmentStatus> = {}
let time = startingTimeMinutes
for (const step of shipment.path) {
  if (step.distanceFromPreviousKm > 0) {
    time += (step.distanceFromPreviousKm * 60) / shipment.truckVelocityKmH
  }

  if (step.stopDurationMin > 0) {
    timeline[time] = SHIPMENT_STATUSES.stopped
    time += step.stopDurationMin
  }

  timeline[time] = SHIPMENT_STATUSES.inTransit
}

const status = computed(() => {
  if (simulatedTimeMinutes.value < startingTimeMinutes) return SHIPMENT_STATUSES.toBeShipped

  if (simulatedTimeMinutes.value >= arrivalTimeMinutes) return SHIPMENT_STATUSES.delivered

  for (let i = 0; i < Object.keys(timeline).length - 1; i++) {
    const key = Number(Object.keys(timeline)[i])
    const nextKey = Number(Object.keys(timeline)[i + 1])

    if (simulatedTimeMinutes.value >= key && simulatedTimeMinutes.value < nextKey) {
      const status = timeline[key]
      if (status === undefined) continue // Just so TS doesn't complain of a possible undefined
      return status
    }
  }

  return SHIPMENT_STATUSES.toBeShipped
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
    </VCard>
  </div>
</template>
