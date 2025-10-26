<script setup lang="ts">
import type { Shipment } from '@/api/shipments'
import { getShipmentTotals } from '@/utils/shipments'
import { computed } from 'vue'
import { useDate } from 'vuetify'
import { formatDuration } from '@/utils/time'

const { shipment } = defineProps<{ shipment: Shipment }>()

const { totalDistanceKm, totalDurationMinutes } = getShipmentTotals(shipment)

const date = useDate()

const startingTime = computed(() => {
  if (!shipment) return ''
  return date.format(shipment.startingTime, 'fullTime24h')
})

const arrivalTime = computed(() => {
  if (!shipment) return ''
  const arrival = date.addMinutes(shipment.startingTime, totalDurationMinutes)
  return date.format(arrival, 'fullTime24h')
})
</script>

<template>
  <div class="shipment-details">
    <VCard>
      <VCardTitle>Journey distance</VCardTitle>
      <VCardText class="text-h6 font-weight-bold text-secondary">
        {{ totalDistanceKm }} Km
      </VCardText>
    </VCard>

    <VCard>
      <VCardTitle>Estimated duration</VCardTitle>
      <VCardText class="text-h6 font-weight-bold text-secondary">
        {{ formatDuration(totalDurationMinutes) }}
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
