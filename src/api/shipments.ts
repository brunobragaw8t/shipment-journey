import { calcTravelMinutes } from '@/utils/time'

export type ShipmentPoint = {
  id: number
  name: string
  distanceFromPreviousKm: number
  stopDurationMin: number
}

export type ShipmentPoint2 = {
  id: number
  name: string
  distanceFromPreviousKm: number
}

export type Shipment = {
  id: number
  product: string
  status: string
  path: ShipmentPoint[]
  points: ShipmentPoint2[]
  truckVelocityKmH: number
  startingTime: Date
}

export type ShipmentProgress = {
  pointId: number
  arrivalTimeMinutes: number | null
  departureTimeMinutes: number | null
}[]

const items: Shipment[] = [
  {
    id: 1,
    product: 'Pallet (200 kg)',
    status: 'In transit',
    path: [
      {
        id: 1,
        name: 'Point A',
        distanceFromPreviousKm: 0,
        stopDurationMin: 0,
      },
      {
        id: 2,
        name: 'Point B',
        distanceFromPreviousKm: 300,
        stopDurationMin: 120,
      },
      {
        id: 3,
        name: 'Point C',
        distanceFromPreviousKm: 200,
        stopDurationMin: 0,
      },
    ],
    points: [
      {
        id: 1,
        name: 'Point A',
        distanceFromPreviousKm: 0,
      },
      {
        id: 2,
        name: 'Point B',
        distanceFromPreviousKm: 300,
      },
      {
        id: 3,
        name: 'Point C',
        distanceFromPreviousKm: 200,
      },
    ],
    truckVelocityKmH: 120,
    startingTime: new Date('2025-10-26T08:00:00'),
  },
  {
    id: 2,
    product: 'Item 2',
    status: 'Delivered',
    path: [
      {
        id: 1,
        name: 'Point A',
        distanceFromPreviousKm: 0,
        stopDurationMin: 0,
      },
      {
        id: 2,
        name: 'Point B',
        distanceFromPreviousKm: 300,
        stopDurationMin: 120,
      },
      {
        id: 3,
        name: 'Point C',
        distanceFromPreviousKm: 200,
        stopDurationMin: 0,
      },
    ],
    points: [
      {
        id: 1,
        name: 'Point A',
        distanceFromPreviousKm: 0,
      },
      {
        id: 2,
        name: 'Point B',
        distanceFromPreviousKm: 300,
      },
      {
        id: 3,
        name: 'Point C',
        distanceFromPreviousKm: 200,
      },
    ],
    truckVelocityKmH: 120,
    startingTime: new Date('2025-10-26T08:00:00'),
  },
  {
    id: 3,
    product: 'Item 3',
    status: 'In transit',
    path: [
      {
        id: 1,
        name: 'Point A',
        distanceFromPreviousKm: 0,
        stopDurationMin: 0,
      },
      {
        id: 2,
        name: 'Point B',
        distanceFromPreviousKm: 300,
        stopDurationMin: 120,
      },
      {
        id: 3,
        name: 'Point C',
        distanceFromPreviousKm: 200,
        stopDurationMin: 0,
      },
    ],
    points: [
      {
        id: 1,
        name: 'Point A',
        distanceFromPreviousKm: 0,
      },
      {
        id: 2,
        name: 'Point B',
        distanceFromPreviousKm: 300,
      },
      {
        id: 3,
        name: 'Point C',
        distanceFromPreviousKm: 200,
      },
    ],
    truckVelocityKmH: 120,
    startingTime: new Date('2025-10-26T08:00:00'),
  },
]

export const shipmentsApi = {
  async getShipments() {
    // simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return items
  },

  async getShipment(id: number) {
    // simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const item = items.find((item) => item.id === id)

    if (!item) throw new Error(`Shipment with id ${id} not found`)

    return item
  },

  getShipmentProgress(shipment: Shipment, currTimeMinutes: number): ShipmentProgress {
    const progress: ShipmentProgress = []

    let accTimeMinutes = shipment.startingTime.getHours() * 60 + shipment.startingTime.getMinutes()

    for (const point of shipment.path) {
      let arrivalTimeMinutes = accTimeMinutes

      if (point.distanceFromPreviousKm > 0) {
        const travelTimeMinutes = calcTravelMinutes(
          point.distanceFromPreviousKm,
          shipment.truckVelocityKmH,
        )

        arrivalTimeMinutes = accTimeMinutes + travelTimeMinutes
      }

      const departureTimeMinutes = arrivalTimeMinutes + point.stopDurationMin

      progress.push({
        pointId: point.id,
        arrivalTimeMinutes: currTimeMinutes >= arrivalTimeMinutes ? arrivalTimeMinutes : null,
        departureTimeMinutes: currTimeMinutes >= departureTimeMinutes ? departureTimeMinutes : null,
      })

      accTimeMinutes = departureTimeMinutes
    }

    return progress
  },
}
