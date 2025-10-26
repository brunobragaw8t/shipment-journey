import type { Shipment } from '@/api/shipments'
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
) {
  const positions: Record<number, { key: string | number; label: string; time: string }> = {}

  let position = 0
  let time = startingTimeMinutes

  for (const point of shipment.path) {
    let timeToDisplay = formatMinutesToTime(time)

    if (point.distanceFromPreviousKm > 0) {
      position += (point.distanceFromPreviousKm / totalDistanceKm) * 100
      time += calcTravelMinutes(point.distanceFromPreviousKm, shipment.truckVelocityKmH)
      timeToDisplay = formatMinutesToTime(time)
    }

    if (point.stopDurationMin > 0) {
      time += point.stopDurationMin
      timeToDisplay += ` - ${formatMinutesToTime(time)}`
    }

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
