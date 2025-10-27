import type { Shipment, ShipmentProgress } from '@/api/shipments'
import { SHIPMENT_STATUSES, type ShipmentStatus } from '@/constants/shipment-statuses'
import { calcTravelMinutes, formatMinutesToTime } from './time'

export function getShipmentStatusTimeline(startingTimeMinutes: number, shipment: Shipment) {
  const timeline: Record<number, ShipmentStatus> = {}

  let time = startingTimeMinutes

  for (const point of shipment.path) {
    if (point.distanceFromPreviousKm > 0) {
      time += calcTravelMinutes(point.distanceFromPreviousKm, shipment.truckVelocityKmH)
    }

    if (point.stopDurationMin > 0) {
      timeline[time] = SHIPMENT_STATUSES.stopped
      time += point.stopDurationMin
    }

    timeline[time] = SHIPMENT_STATUSES.inTransit
  }

  return timeline
}

export function getShipmentPointPositions(
  startingTimeMinutes: number,
  totalDistanceKm: number,
  shipment: Shipment,
  currentTimeMinutes: number,
  progress: ShipmentProgress,
) {
  const positions: Record<number, { key: string | number; label: string; time: string }> = {}

  let position = 0

  for (const point of shipment.path) {
    const pointProgress = progress.find((p) => p.pointId === point.id)

    if (!pointProgress) {
      throw new Error(`No progress found for point ${point.id}`)
    }

    const isFirstPoint = point.distanceFromPreviousKm === 0
    const isLastPoint = point.id === shipment.path[shipment.path.length - 1]?.id

    let timeToDisplay = ''

    if (isFirstPoint && currentTimeMinutes < startingTimeMinutes) {
      timeToDisplay = `Scheduled to ${formatMinutesToTime(startingTimeMinutes)}`
    }

    if (isFirstPoint && currentTimeMinutes >= startingTimeMinutes) {
      timeToDisplay = `Departed at ${formatMinutesToTime(startingTimeMinutes)}`
    }

    if (
      !isFirstPoint &&
      pointProgress.arrivalTimeMinutes !== null &&
      currentTimeMinutes >= pointProgress.arrivalTimeMinutes
    ) {
      timeToDisplay = `Arrived at ${formatMinutesToTime(pointProgress.arrivalTimeMinutes)}`
    }

    if (
      !isFirstPoint &&
      !isLastPoint &&
      pointProgress.departureTimeMinutes !== null &&
      currentTimeMinutes >= pointProgress.departureTimeMinutes
    ) {
      timeToDisplay += `\nDeparted at ${formatMinutesToTime(pointProgress.departureTimeMinutes)}`
    }

    position += (point.distanceFromPreviousKm / totalDistanceKm) * 100

    positions[position] = {
      key: point.id,
      label: point.name,
      time: timeToDisplay,
    }
  }

  return positions
}

// In my opinion we shouldn't be calculating this stuff on the frontend.
// It was done here for the sake of this exercise.

export function getShipmentTotals(shipment: Shipment): {
  totalDistanceKm: number
  totalStopDurationMinutes: number
  totalDurationMinutes: number
} {
  const { totalDistanceKm, totalStopDurationMinutes } = shipment.path.reduce(
    (acc, curr) => {
      acc.totalDistanceKm += curr.distanceFromPreviousKm
      acc.totalStopDurationMinutes += curr.stopDurationMin
      return acc
    },
    { totalDistanceKm: 0, totalStopDurationMinutes: 0 },
  )

  // Is it ok to assume that the truck velocity is constant?
  const travelDurationMinutes = (totalDistanceKm * 60) / shipment.truckVelocityKmH
  const totalDurationMinutes = Math.floor(travelDurationMinutes + totalStopDurationMinutes)

  return { totalDistanceKm, totalStopDurationMinutes, totalDurationMinutes }
}
