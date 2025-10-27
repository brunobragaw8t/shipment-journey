<script setup lang="ts">
import type { Shipment } from '@/api/shipments'
import { ref, computed } from 'vue'
import { SHIPMENT_STATUSES } from '@/constants/shipment-statuses'
import {
  getShipmentTotals,
  getShipmentStatusTimeline,
  getShipmentPointPositions,
} from '@/utils/shipments'
import { calcTravelMinutes, formatMinutesToTime } from '@/utils/time'
import { formatDuration } from '@/utils/time'
import { shipmentsApi } from '@/api/shipments'

const { shipment } = defineProps<{ shipment: Shipment }>()

const simulatedTimeMinutes = ref(360)

const startingTimeMinutes =
  shipment.startingTime.getHours() * 60 + shipment.startingTime.getMinutes()
const { totalDurationMinutes, totalDistanceKm } = getShipmentTotals(shipment)
const arrivalTimeMinutes = startingTimeMinutes + totalDurationMinutes

const statusTimeline = getShipmentStatusTimeline(startingTimeMinutes, shipment)

const status = computed(() => {
  if (simulatedTimeMinutes.value < startingTimeMinutes) return SHIPMENT_STATUSES.toBeShipped

  if (simulatedTimeMinutes.value >= arrivalTimeMinutes) return SHIPMENT_STATUSES.delivered

  for (let i = 0; i < Object.keys(statusTimeline).length - 1; i++) {
    const key = Number(Object.keys(statusTimeline)[i])
    const nextKey = Number(Object.keys(statusTimeline)[i + 1])

    if (simulatedTimeMinutes.value >= key && simulatedTimeMinutes.value < nextKey) {
      const status = statusTimeline[key]
      if (status === undefined) continue // Just so TS doesn't complain of a possible undefined
      return status
    }
  }

  return SHIPMENT_STATUSES.toBeShipped
})

const progress = computed(() =>
  shipmentsApi.getShipmentProgress(shipment, simulatedTimeMinutes.value),
)

const pointPositions = computed(() =>
  getShipmentPointPositions(
    startingTimeMinutes,
    totalDistanceKm,
    shipment,
    simulatedTimeMinutes.value,
    progress.value,
  ),
)

const truck = computed(() => {
  if (simulatedTimeMinutes.value < startingTimeMinutes) {
    return {
      positionPercent: 0,
      positionKm: 0,
      timeRemainingMinutes: 0,
    }
  }

  if (simulatedTimeMinutes.value >= arrivalTimeMinutes) {
    return {
      positionPercent: 100,
      positionKm: totalDistanceKm,
      timeRemainingMinutes: 0,
    }
  }

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
      return {
        positionPercent: Math.floor((accDistanceKm / totalDistanceKm) * 100),
        positionKm: Math.floor(accDistanceKm),
        timeRemainingMinutes: Math.floor(stopEndTimeMinutes - simulatedTimeMinutes.value),
      }
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

      accDistanceKm += progressBetweenPointsKm

      return {
        positionPercent: Math.floor((accDistanceKm / totalDistanceKm) * 100),
        positionKm: Math.floor(accDistanceKm),
        timeRemainingMinutes: Math.floor(travelEndTimeMinutes - simulatedTimeMinutes.value),
      }
    }

    accDistanceKm += nextPoint.distanceFromPreviousKm
    accTimeMinutes += travelDurationMinutes
  }

  return {
    positionPercent: 100,
    positionKm: totalDistanceKm,
    timeRemainingMinutes: 0,
  }
})
</script>

<template>
  <div class="shipment-timeline">
    <div class="d-flex align-center mb-4">
      <label class="mr-2 mb-0 font-weight-bold">
        Simulated time: {{ formatMinutesToTime(simulatedTimeMinutes) }}
      </label>

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
          <div class="visual-timeline__truck" :style="{ left: `${truck.positionPercent}%` }">
            <span>{{ truck.positionKm }} Km</span>

            <span v-if="status.label === 'In transit'">
              ETA: {{ formatDuration(truck.timeRemainingMinutes) }}
            </span>

            <span v-if="status.label === 'Stopped'">Loading/Unloading</span>

            <VIcon icon="fa-truck" />
          </div>

          <div class="visual-timeline__line"></div>

          <div
            v-for="(point, position) in pointPositions"
            :key="point.key"
            class="visual-timeline__point"
            :style="{ left: `${position}%` }"
          >
            <label>{{ point.label }}</label>
            <span>{{ point.time }}</span>
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
  margin: $timeline_spacer * 2 $timeline_spacer $timeline_spacer * 2;

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
    width: 6.5rem;
    text-align: center;
    line-height: $timeline_spacer;

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

    span {
      display: block;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.625rem;
      line-height: $timeline_spacer * 0.5;
    }
  }
}
</style>
