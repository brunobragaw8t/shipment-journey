export const SHIPMENT_STATUSES = {
  toBeShipped: { label: 'To be shipped', color: 'blue-grey' },
  inTransit: { label: 'In transit', color: 'blue' },
  stopped: { label: 'Stopped', color: 'orange' },
  delivered: { label: 'Delivered', color: 'green' },
} as const

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[keyof typeof SHIPMENT_STATUSES]
