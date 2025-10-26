import type { Shipment } from '@/api/shipments'

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
