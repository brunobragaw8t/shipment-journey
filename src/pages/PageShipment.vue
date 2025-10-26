<script setup lang="ts">
import type { Shipment } from '@/api/shipments'
import { shipmentsApi } from '@/api/shipments'
import ShipmentDetails from '@/components/ShipmentDetails.vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
    <ShipmentDetails :shipment="shipment!" />
  </template>
</template>
