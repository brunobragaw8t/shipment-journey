export type Shipment = {
  id: number
  product: string
  status: string
}

const items: Shipment[] = [
  { id: 1, product: 'Pallet (200 kg)', status: 'In transit' },
  { id: 2, product: 'Item 2', status: 'Delivered' },
  { id: 3, product: 'Item 3', status: 'In transit' },
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
