export type Shipment = {
  id: number
  product: string
  status: string
  path: {
    id: number
    name: string
    distanceFromPreviousKm: number
    stopDurationMin: number
  }[]
  truckVelocityKmH: number
  startingTime: Date
}

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
}
