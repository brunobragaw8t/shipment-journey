<script setup lang="ts">
import type { Shipment, ShipmentPoint } from '@/api/shipments'
import { ref, computed } from 'vue'
import { SHIPMENT_STATUSES, type ShipmentStatus } from '@/constants/shipment-statuses'
import { getShipmentTotals } from '@/utils/shipments'
import { calcTravelMinutes } from '@/utils/time'

const { shipment } = defineProps<{ shipment: Shipment }>()

const simulatedTimeMinutes = ref(0)
const simulatedTime = computed(() => {
  const hours = Math.floor(simulatedTimeMinutes.value / 60)
  const minutes = simulatedTimeMinutes.value % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
})

const startingTimeMinutes =
  shipment.startingTime.getHours() * 60 + shipment.startingTime.getMinutes()
const { totalDurationMinutes, totalDistanceKm } = getShipmentTotals(shipment)
const arrivalTimeMinutes = startingTimeMinutes + totalDurationMinutes

const timeline: Record<number, ShipmentStatus> = {}
let time = startingTimeMinutes
for (const step of shipment.path) {
  if (step.distanceFromPreviousKm > 0) {
    time += calcTravelMinutes(step.distanceFromPreviousKm, shipment.truckVelocityKmH)
  }

  if (step.stopDurationMin > 0) {
    timeline[time] = SHIPMENT_STATUSES.stopped
    time += step.stopDurationMin
  }

  timeline[time] = SHIPMENT_STATUSES.inTransit
}

const pointPositions: Record<number, ShipmentPoint> = {}
let position = 0
for (const point of shipment.path) {
  if (point.distanceFromPreviousKm > 0) {
    position += (point.distanceFromPreviousKm / totalDistanceKm) * 100
  }

  pointPositions[position] = point
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

const truckPositionPercent = computed(() => {
  if (simulatedTimeMinutes.value < startingTimeMinutes) return 0

  if (simulatedTimeMinutes.value >= arrivalTimeMinutes) return 100

  let accTimeMinutes = startingTimeMinutes
  let accDistanceKm = 0

  for (let i = 0; i < shipment.path.length - 1; i++) {
    const currentPoint = shipment.path[i]!
    const nextPoint = shipment.path[i + 1]!

    const stopEndTimeMinutes = accTimeMinutes + currentPoint.stopDurationMin
    if (
      simulatedTimeMinutes.value >= accTimeMinutes &&
      simulatedTimeMinutes.value < stopEndTimeMinutes
    ) {
      return (accDistanceKm / totalDistanceKm) * 100
    }
    accTimeMinutes = stopEndTimeMinutes

    const travelStartTimeMinutes = accTimeMinutes
    const travelDurationMinutes = calcTravelMinutes(
      nextPoint.distanceFromPreviousKm,
      shipment.truckVelocityKmH,
    )
    const travelEndTimeMinutes = travelStartTimeMinutes + travelDurationMinutes

    if (
      simulatedTimeMinutes.value >= travelStartTimeMinutes &&
      simulatedTimeMinutes.value < travelEndTimeMinutes
    ) {
      const progressBetweenPointsMinutes =
        (simulatedTimeMinutes.value - travelStartTimeMinutes) / travelDurationMinutes
      const progressBetweenPointsKm =
        progressBetweenPointsMinutes * nextPoint.distanceFromPreviousKm

      return ((accDistanceKm + progressBetweenPointsKm) / totalDistanceKm) * 100
    }

    accDistanceKm += nextPoint.distanceFromPreviousKm
    accTimeMinutes += travelDurationMinutes
  }

  return 100
})

const truckPositionKm = computed(() => {
  return Math.floor((truckPositionPercent.value * totalDistanceKm) / 100)
})
</script>

<template>
  <div class="shipment-timeline">
    <div class="d-flex align-center mb-4">
      <label class="mr-2 mb-0 font-weight-bold">Simulated time: {{ simulatedTime }}</label>

      <VSlider
        v-model="simulatedTimeMinutes"
        :min="360"
        :max="1080"
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
        <div class="visual-timeline">
          <div class="visual-timeline__truck" :style="{ left: `${truckPositionPercent}%` }">
            <span>{{ truckPositionKm }} Km</span>
            <VIcon icon="fa-truck" />
          </div>

          <div class="visual-timeline__line"></div>

          <div
            v-for="(point, position) in pointPositions"
            :key="point.id"
            class="visual-timeline__point"
            :style="{ left: `${position}%` }"
          >
            <label>{{ point.name }}</label>
          </div>
        </div>
      </template>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
$timeline_spacer: 2rem;

.visual-timeline {
  position: relative;
  margin: $timeline_spacer * 1.5 $timeline_spacer $timeline_spacer;

  &__truck {
    position: absolute;
    bottom: 100%;
    transform: translateX(-50%);
    text-align: center;

    span {
      display: block;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.75rem;
      line-height: $timeline_spacer * 0.5;
      white-space: nowrap;
    }

    i {
      height: $timeline_spacer;
      color: var(--color-primary);
      font-size: 1rem;
    }
  }

  &__line {
    border-bottom: 0.125rem solid rgba(0, 0, 0, 0.1);
  }

  &__point {
    position: absolute;
    top: 100%;
    transform: translateX(-50%);
    margin-top: -1px;
    line-height: $timeline_spacer;
    white-space: nowrap;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 50%;
      transform: translateX(50%) translateY(-50%);
      border-radius: 100%;
      width: 0.5rem;
      height: 0.5rem;
      background-color: var(--color-secondary);
    }
  }
}
</style>
