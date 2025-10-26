<script setup lang="ts">
import type { Shipment } from '@/api/shipments'
import { computed } from 'vue'
import { useDate } from 'vuetify'

const { shipment } = defineProps<{ shipment: Shipment }>()

// In my opinion we shouldn't be calculating this stuff on the frontend.
// It was done here for the sake of this exercise.

const totalDistance = computed(() => {
  if (!shipment) return 0
  return shipment.path.reduce((acc, point) => acc + point.distanceFromPreviousKm, 0)
})

const totalDuration = computed(() => {
  if (!shipment) return { raw: 0, formatted: '0h 0m' }

  const travelDuration = (totalDistance.value / shipment.truckVelocityKmH) * 60
  const stopsDuration = shipment.path.reduce((acc, point) => acc + point.stopDurationMin, 0)
  const duration = travelDuration + stopsDuration

  const durationHours = Math.floor(duration / 60)
  const durationMinutes = duration % 60

  return {
    raw: duration,
    formatted: `${durationHours}h ${durationMinutes}m`,
  }
})

const date = useDate()

const startingTime = computed(() => {
  if (!shipment) return ''
  return date.format(shipment.startingTime, 'fullTime24h')
})

const arrivalTime = computed(() => {
  if (!shipment) return ''
  const arrival = date.addMinutes(shipment.startingTime, totalDuration.value.raw)
  return date.format(arrival, 'fullTime24h')
})
</script>

<template>
  <div class="shipment-details">
    <VCard>
      <VCardTitle>Journey distance</VCardTitle>
      <VCardText class="text-h6 font-weight-bold text-secondary">
        {{ totalDistance }} Km
      </VCardText>
    </VCard>

    <VCard>
      <VCardTitle>Estimated duration</VCardTitle>
      <VCardText class="text-h6 font-weight-bold text-secondary">
        {{ totalDuration.formatted }}
      </VCardText>
    </VCard>

    <VCard>
      <VCardTitle>Starting time</VCardTitle>
      <VCardText class="text-h6 font-weight-bold text-secondary">
        {{ startingTime }}
      </VCardText>
    </VCard>

    <VCard>
      <VCardTitle>Expected arrival time</VCardTitle>
      <VCardText class="text-h6 font-weight-bold text-secondary">
        {{ arrivalTime }}
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
.shipment-details {
  display: grid;
  gap: 1rem;
}

@media (min-width: 576px) {
  .shipment-details {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .shipment-details {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
