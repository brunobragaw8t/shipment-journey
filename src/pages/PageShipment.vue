<script setup lang="ts">
import type { Shipment } from '@/api/shipments'
import { shipmentsApi } from '@/api/shipments'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDate } from 'vuetify'

const router = useRouter()

const route = useRoute()
const shipmentId = route.params.id as string

const shipment = ref<Shipment | null>(null)
const loading = ref(true)
const error = ref(false)

async function fetchShipment() {
  return shipmentsApi.getShipment(Number(shipmentId))
}

onMounted(async () => {
  try {
    shipment.value = await fetchShipment()
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
})

// In my opinion we shouldn't be calculating this stuff on the frontend.
// It was done here for the sake of this exercise.

const totalDistance = computed(() => {
  if (!shipment.value) return 0
  return shipment.value.path.reduce((acc, point) => acc + point.distanceFromPreviousKm, 0)
})

const totalDuration = computed(() => {
  if (!shipment.value) return { raw: 0, formatted: '0h 0m' }

  const travelDuration = (totalDistance.value / shipment.value.truckVelocityKmH) * 60
  const stopsDuration = shipment.value.path.reduce((acc, point) => acc + point.stopDurationMin, 0)
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
  if (!shipment.value) return ''
  return date.format(shipment.value.startingTime, 'fullTime24h')
})

const arrivalTime = computed(() => {
  if (!shipment.value) return ''
  const arrival = date.addMinutes(shipment.value.startingTime, totalDuration.value.raw)
  return date.format(arrival, 'fullTime24h')
})
</script>

<template>
  <div class="d-flex justify-center" v-if="loading">
    <VProgressCircular indeterminate />
  </div>

  <VEmptyState
    v-else-if="error"
    headline="Whoops, 404"
    title="Page not found"
    text="The page you were looking for does not exist"
    action-text="Return to shipments"
    @click:action="() => router.replace({ name: 'shipments' })"
  />

  <template v-else>
    <h1 class="mb-4">Shipment details</h1>

    <div class="detail-cards">
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
</template>

<style scoped lang="scss">
.detail-cards {
  display: grid;
  gap: 1rem;
}

@media (min-width: 576px) {
  .detail-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .detail-cards {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
